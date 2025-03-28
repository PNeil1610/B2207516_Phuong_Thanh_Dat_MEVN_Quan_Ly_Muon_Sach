const { ObjectId } = require('mongodb');

class TheodoiService {
    constructor(client) {
        this.Theodoi = client.db().collection('theodoi');
    }

    extractTheodoiData(payload) {
        const theodoi = {
            maSach: payload.maSach,
            maDG: payload.maDG,
            ngaymuon: payload.ngaymuon || null,
            trangthai: payload.trangthai || "Chờ duyệt",
            ngaytra: payload.ngaytra || null,
        };
        Object.keys(theodoi).forEach(
            (key) => theodoi[key] === undefined && delete theodoi[key]
        );
        return theodoi;
    }

    async create(payload) {
        const theodoi = this.extractTheodoiData(payload);
        const result = await this.Theodoi.findOneAndUpdate(
            { maSach: theodoi.maSach, maDG: theodoi.maDG },
            { $set: theodoi },
            { returnDocument: 'after', upsert: true }
        );
        return result;
    }

    async find(filter) {
        return await this.Theodoi.find(filter).toArray();
    }

    async findByMaDG(ma) {
        return await this.find({ maDG: new RegExp(ma, 'i') });
    }

    async findByMaSach(ma) {
        return await this.find({ maSach: new RegExp(ma, 'i') });
    }

    async findByTrangthai(tt) {
        return await this.find({ trangthai: new RegExp(tt, 'i') });
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid ObjectId');
        }
        return await this.Theodoi.findOne({ _id: new ObjectId(id) });
    }

    async update(id, payload) {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid ObjectId");
        }
        const update = this.extractTheodoiData(payload);
        const result = await this.Theodoi.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: 'after' }
        );
        return result;
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid ObjectId");
        }
        return await this.Theodoi.findOneAndDelete({ _id: new ObjectId(id) });
    }

    async deleteAll() {
        return await this.Theodoi.deleteMany({});
    }

    
    /* Nhân viên duyệt yêu cầu mượn sách
     */
    async approveMuonSach(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid ObjectId");
        }

        const loan = await this.Theodoi.findOne({ _id: new ObjectId(id) });
        if (!loan) {
            throw new Error("Không tìm thấy yêu cầu mượn sách.");
        }
        if (loan.trangthai !== "Chờ duyệt") {
            throw new Error("Chỉ có thể duyệt các yêu cầu có trạng thái 'Chờ duyệt'.");
        }

        // Cập nhật trạng thái thành "Đã mượn" và thêm ngày mượn thực tế
        const result = await this.Theodoi.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    trangthai: "Đã mượn",
                    ngaymuon: new Date().toISOString(),
                },
            },
            { returnDocument: 'after' }
        );
        return { message: "Yêu cầu mượn sách đã được duyệt", loan: result };
    }
}

module.exports = TheodoiService;
