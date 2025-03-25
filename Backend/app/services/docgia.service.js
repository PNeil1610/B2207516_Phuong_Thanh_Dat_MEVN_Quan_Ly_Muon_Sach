const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class DocgiaService {
    constructor(client) {
        this.Docgia = client.db().collection('docgia');
    }

    async extractDocgiaData(payload) {
        const docgia = {
            _id: payload._id,
            tenDG: payload.tenDG,
            diachiDG: payload.diachiDG,
            gioitinhDG: payload.gioitinhDG,
            ngaysinhDG: payload.ngaysinhDG,
            dienthoaiDG: payload.dienthoaiDG,
            taikhoanDG: payload.taikhoanDG,
            matkhauDG: payload.matkhauDG ? await bcrypt.hash(payload.matkhauDG, 10) : undefined,
        };
        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );
        return docgia;
    }

    async create(payload) {
        const docgia = await this.extractDocgiaData(payload);
        
        const result = await this.Docgia.findOneAndUpdate(
            docgia,
            { $set: docgia },
            { returnDocument: 'after', upsert: true }
            );
        return result;
    }


    async find (filter) {
        const cursor = this.Docgia.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tenDG: {$regex: new RegExp(new RegExp(name)), $options: 'i'}
        });
    }

    async findByTaiKhoan(taikhoanDG) {
        return await this.find({
            taikhoanDG: taikhoanDG
        });
    }

    

    async findById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('ID không hợp lệ');
            }
            const docgia = await this.Docgia.findOne({ _id: new ObjectId(id) });
            if (!docgia) {
                throw new Error(`Không tìm thấy tài liệu độc giả với ID: ${id}`);
            }
            return docgia;
        } catch (error) {
            console.error('Lỗi khi tìm độc giả:', error);
            throw error;
        }
    }



async update(id, payload) {
        const filter = { _id: new ObjectId(id) };
        const update = await this.extractDocgiaData(payload);
        const result = await this.Docgia.findOneAndUpdate(
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

    const result = await this.Docgia.findOneAndDelete({
        _id: new ObjectId(id),
    });

    return result;
}


    async deleteAll (){
        const result = await this.Docgia.deleteMany({});
        return result.deletedCount;
    }

    async loginDocGia(dienthoaiDG, matkhauDG) {
        if (!dienthoaiDG || !matkhauDG) {
            throw new Error("Số điện thoại và mật khẩu là bắt buộc");
        }

        const docGia = await this.Docgia.findOne({ dienthoaiDG });
        if (!docGia) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        const isMatch = await bcrypt.compare(matkhauDG, docGia.matkhauDG);
        if (!isMatch) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        return { role: "docgia", user: docGia };
    }

    async updateSoSachDangMuon(maDG) {
    if (!ObjectId.isValid(maDG)) {
        throw new Error("ID độc giả không hợp lệ");
    }

    const count = await this.Theodoi.countDocuments({
        maDG: new ObjectId(maDG),
        trangthai: { $in: ["Đã mượn", "Chờ duyệt"] }
    });

    await this.Docgia.findOneAndUpdate(
        { _id: new ObjectId(maDG) },
        { $set: { soSachDangMuon: count } }
    );
}


    async registerDocGia(tenDG, dienthoaiDG, matkhauDG, confirmmatkhauDG) {
    if (!tenDG || !dienthoaiDG || !matkhauDG || !confirmmatkhauDG) {
        throw new Error("Tên độc giả, số điện thoại, mật khẩu và xác nhận mật khẩu là bắt buộc");
    }

    if (matkhauDG !== confirmmatkhauDG) {
        throw new Error("Mật khẩu xác nhận không khớp");
    }

    const existingDocGia = await this.Docgia.findOne({ dienthoaiDG });
    if (existingDocGia) {
        throw new Error("Số điện thoại đã được đăng ký");
    }

    const hashedPassword = await bcrypt.hash(matkhauDG, 10);
    const newDocGia = {
        _id: new ObjectId(),
        tenDG: tenDG || "Chưa cập nhật",
        dienthoaiDG,
        matkhauDG: hashedPassword,
    };

    await this.Docgia.insertOne(newDocGia);
    return { message: "Đăng ký thành công", user: newDocGia };
}

};

module.exports = DocgiaService;