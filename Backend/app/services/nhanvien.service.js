const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class NhanvienService {
    constructor(client) {
        this.Nhanvien = client.db().collection('nhanvien');
    }


    async extractNhanvienData(payload) {
        const nhanvien = {
            _id: payload._id,
            tenNV: payload.tenNV,
            diachiNV: payload.diachiNV,
            chucvuNV: payload.chucvuNV,
            dienthoaiNV: payload.dienthoaiNV,
            matkhauNV: payload.matkhauNV ? await bcrypt.hash(payload.matkhauNV, 10) : undefined,
        };
        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

    async create(payload) {       
        const nhanvien = await this.extractNhanvienData(payload);

        const result = await this.Nhanvien.findOneAndUpdate(
            { dienthoaiNV: nhanvien.dienthoaiNV }, // Tìm theo số điện thoại
            { $set: nhanvien },
            { returnDocument: 'after', upsert: true }
        );

        return result;
    }


    async find(filter) {
        const cursor = this.Nhanvien.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tenNV: {$regex: new RegExp(new RegExp(name)), $options: 'i'}
        });
    }

    async findByTaiKhoan(name) {
        return await this.find({
            taikhoanNV: name
        });
    }

    async findById(id) {        
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }

        const nhanvien = await this.Nhanvien.findOne({
            _id: new ObjectId(id),
        });

        if (!nhanvien) {
            console.error('Không tìm thấy tài liệu nhân viên:', id);
            throw new Error('Không tìm thấy tài liệu nhân viên với id');
        }

        return nhanvien;
    } catch (error) {
        console.error('Có lỗi xảy ra trong khi tìm kiếm nhân viên:', error);
        throw error;
    }
}


   async update(id, payload) {
    if (!ObjectId.isValid(id)) {
        throw new Error("ID không hợp lệ");
    }

    const filter = { _id: new ObjectId(id) };
    const update = await this.extractNhanvienData(payload);
    const result = await this.Nhanvien.findOneAndUpdate(
        filter,
        { $set: update },
        { returnDocument: 'after' }
    );
    return result.value;
}

    async delete(id) {
    if (!ObjectId.isValid(id)) {
        throw new Error("ID không hợp lệ");
    }

    const result = await this.Nhanvien.findOneAndDelete({
        _id: new ObjectId(id),
    });

    return result;
}


    async deleteAll (){
        const result = await this.Nhanvien.deleteMany({});
        return result.deletedCount;
    }

    async loginNhanVien(dienthoaiNV, matkhauNV) {
        if (!dienthoaiNV || !matkhauNV) {
            throw new Error("Số điện thoại và mật khẩu là bắt buộc");
        }

        const nhanVien = await this.Nhanvien.findOne({ dienthoaiNV });
        if (!nhanVien) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        const isMatch = await bcrypt.compare(matkhauNV, nhanVien.matkhauNV);
        if (!isMatch) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        return { role: "nhanvien", user: nhanVien };
    }

    async registerNhanVien(data) {
        if (!data.dienthoaiNV || !data.matkhauNV || !data.tenNV) {
            throw new Error("Số điện thoại, mật khẩu, họ tên là bắt buộc");
        }

        if (data.matkhauNV !== data.confirmmatkhauNV) {
            throw new Error("Mật khẩu xác nhận không khớp");
        }

        try {
            const dienthoaiNV = data.dienthoaiNV;
            const existingNhanVien = await this.Nhanvien.findOne({ dienthoaiNV });
            if (existingNhanVien) {
                throw new Error('Số điện thoại đã được đăng ký');
            }

            const hashedPassword = bcrypt.hashSync(data.matkhauNV, 10);
            const count = await this.Nhanvien.countDocuments();
            const newNhanVien = {
                _id: new ObjectId(),
                tenNV: data.tenNV || 'Chưa cập nhật',
                chucvuNV: data.chucvuNV || 'Chưa cập nhật',
                diachi: data.diachi || 'Chưa cập nhật',
                dienthoaiNV: data.dienthoaiNV,
                matkhauNV: hashedPassword,
            };

            await this.Nhanvien.insertOne(newNhanVien);
            return { message: 'Đăng ký thành công', user: newNhanVien };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async approveMuonSach(id) {
    if (!ObjectId.isValid(id)) {
        throw new Error("ID không hợp lệ");
    }
    return await this.TheodoiService.approveMuonSach(new ObjectId(id));
}

}

module.exports = NhanvienService;