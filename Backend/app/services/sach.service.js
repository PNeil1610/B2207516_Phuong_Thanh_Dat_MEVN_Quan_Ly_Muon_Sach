const { ObjectId } = require('mongodb');

class SachService {
    constructor(client) {
        this.Sach = client.db().collection('sach');
        this.NXB = client.db().collection('nxb');
    }

    extractSachData(payload) {
        const sach = {
            _id: payload._id,
            tenSach: payload.tenSach,
            soquyenSach: payload.soquyenSach,
            dongiaSach: payload.dongiaSach,
            namXB: payload.namXB,
            maNXB: payload.maNXB,
            // tenNXB: payload.tenNXB,
            tacgia: payload.tacgia,
        };
        Object.keys(sach).forEach(
            (key) => sach[key] === undefined && delete sach[key]
        );
        return sach;
    }

    // async getNXBIdByName(tenNXB) {
    // const nxb = await this.NXB.findOne({ tenNXB: tenNXB });
    // return nxb ? nxb._id : null;
    // }

    async gettenNXBById(maNXB) {
    const nxb = await this.NXB.findOne({ _id: new ObjectId(maNXB) });
    return nxb ? nxb.tenNXB : null;
}

    async create(payload) {
        // console.log(payload);
        let maNXB = payload.maNXB;
    
        if (!ObjectId.isValid(maNXB)) {
        // Nếu `maNXB` không phải ObjectId, tìm theo `tenNXB`
        const nxb = await this.NXB.findOne({ tenNXB: payload.tenNXB });
        if (!nxb) throw new Error("Nhà xuất bản không tồn tại");
        maNXB = nxb._id; // Lấy ObjectId của `nxb`
        }
        const tenNXB = await this.gettenNXBById(maNXB);
        const sach = this.extractSachData({ ...payload, tenNXB });
        // const sach = this.extractSachData(payload);
        const result = await this.Sach.insertOne(sach);
        return result;
    }

    async find(filter) {
        const cursor = this.Sach.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            tenSach: { $regex: new RegExp(name, 'i') },
        });
    }

    async findById(id) {
    try {
        if (!ObjectId.isValid(id)) {
            console.error(`ID không hợp lệ: ${id}`);
            return null; // Trả về null thay vì ném lỗi
        }

        const sach = await this.Sach.findOne({ _id: new ObjectId(id) });

        if (!sach) {
            console.warn(`Không tìm thấy sách với ID: ${id}`);
            return null; // Trả về null thay vì ném lỗi
        }

        return sach;
    } catch (error) {
        console.error('Lỗi khi tìm sách:', error);
        throw error; // Giữ nguyên xử lý lỗi hệ thống
    }
}



    async update(id, payload) {
        if (payload._id) {
            delete payload._id; // Xoá trường _id nếu có trong payload
        }

        const update = await this.extractSachData(payload);

        try {
            const result = await this.Sach.findOneAndUpdate(
            { _id: new ObjectId(id) }, 
            { $set: update }, 
            { returnDocument: 'after' }
            );

            if (!result) {
            throw new Error(`Không tìm thấy sách với ID=${id}`);
            }
            return result;
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            throw new Error(`Lỗi khi cập nhật sách với ID=${id}`);
        }
    }
    async delete(id) {
        const result = await this.Sach.findOneAndDelete({ _id: new ObjectId(id) });
        return result;
    }


    async deleteAll() {
        const result = await this.Sach.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = SachService;
