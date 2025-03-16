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
            matkhauNV: payload.matkhauNV,
        };
        Object.keys(nhanvien).forEach(
            (key) => nhanvien[key] === undefined && delete nhanvien[key]
        );
        return nhanvien;
    }

    async create(payload) {       
        const nhanvien = await this.extractNhanvienData(payload);

        const result = await this.Nhanvien.findOneAndUpdate(
            nhanvien,
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
            const nhanvien = await this.Nhanvien.findOne({
                _id: id,
            });
            if (!nhanvien) {
                console.error('Không tìm thấy tâì liệu nhân viên:', id);
                throw new Error('Không tìm thấy tâì liệu nhân viên với id');
            }
            return nhanvien;
        } catch (error) {
            console.error('Có lỗi xảy ra trong khi tìm kiếm nhân viên:', error);
            throw error;
        }
    }

    async update(id, payload) {
        const filter = {
            _id: id ? id : null,
        };    
        const update = {
            _id: payload._id,
            tenNV: payload.tenNV,
            diachiNV: payload.diachiNV,
            chucvuNV: payload.chucvuNV,
            dienthoaiNV: payload.dienthoaiNV,
            taikhoanNV: payload._id,
            matkhauNV: payload.matkhauNV,
        };
        const result = await this.Nhanvien.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.updatedExisting;
    }

    async delete(id) {
        const result = await this.Nhanvien.findOneAndDelete({
            _id: id ? id : null,
        });
        return result;
    }

    async deleteAll (){
        const result = await this.Nhanvien.deleteMany({});
        return result.deletedCount;
    }

    async loginNhanVien(dienthoaiNV, matkhauNV) {
        console.log(dienthoaiNV, matkhauNV);
        if (!dienthoaiNV || !matkhauNV) {
            throw new Error("Số điện thoại và mật khẩu là bắt buộc");
        }
        const nhanVien = await this.Nhanvien.findOne({ dienthoaiNV: dienthoaiNV });

        if (!nhanVien || nhanVien.matkhauNV !== matkhauNV) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        const isMatch = await bcrypt.compare(matkhauNV, nhanVien.matkhauNV);
        if (!isMatch) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        return { role: "nhanvien", user: nhanVien };
    }
}

module.exports = NhanvienService;