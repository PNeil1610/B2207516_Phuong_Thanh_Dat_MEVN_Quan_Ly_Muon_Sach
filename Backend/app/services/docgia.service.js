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
            taikhoanDG: payload._id,
            matkhauDG: payload.matkhauDG,
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
            const docgia = await this.Docgia.findOne({
                _id: id,
            });
            if (!docgia) {
                console.error('Không tìm thấy tài liệu độc giả:', id);
                throw new Error('Không tìm thấy tài liệu độc giả với id');
            }
            return docgia;
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm kiếm độc giả:', error);
            throw error;
        }
    }

    async update(id, payload) {
        const filter = {
            _id: id ? id : null,
        };    
        const update = {
            _id: payload._id,
            tenDG: payload.tenDG,
            diachiDG: payload.diachiDG,
            gioitinhDG: payload.gioitinhDG,
            ngaysinhDG: payload.ngaysinhDG,
            dienthoaiDG: payload.dienthoaiDG,
            matkhauDG: payload.matkhauDG,
        };
        const result = await this.Docgia.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.updatedExisting;
    }

    async delete(id) {
        const result = await this.Docgia.findOneAndDelete({
            _id: id ? id : null,
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

        const docGia = await this.Docgia.findOne({ dienthoaiDG: dienthoaiDG });

        if (!docGia || docGia.matkhauDG !== matkhauDG) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        const isMatch = await bcrypt.compare(matkhauDG, docGia.matkhauDG);
        if (!isMatch) {
            throw new Error("Số điện thoại hoặc mật khẩu không chính xác");
        }

        return { role: "docgia", user: docGia };
    }

    async registerDocGia(dienthoaiDG, matkhauDG, confirmmatkhauDG) {
        if (!dienthoaiDG || !matkhauDG || !confirmmatkhauDG) {
            throw new Error("Số điện thoại, mật khẩu và xác nhận mật khẩu là bắt buộc");
        }

        if (matkhauDG !== confirmmatkhauDG) {
            throw new Error("Mật khẩu xác nhận không khớp");
        }

        const existingDocGia = await this.Docgia.findOne({ dienthoaiDG: dienthoaiDG });
        if (existingDocGia) {
            throw new Error("Số điện thoại đã được đăng ký");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(matkhauDG, saltRounds);

        const newDocGia = {
            _id: new ObjectId(),
            tenDG: "Chưa cập nhật",
            dienthoaiDG: dienthoaiDG,
            matkhauDG: hashedPassword, // Lưu mật khẩu đã hash vào database
        };

        await this.Docgia.insertOne(newDocGia);
        return { message: "Đăng ký thành công", user: newDocGia };
    }
};

module.exports = DocgiaService;