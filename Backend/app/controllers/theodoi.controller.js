const TheodoiService = require('../services/theodoi.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.maDG){
        console.log(req.body?.maDG)
        return next(new ApiError(400, 'Mã đọc giả không được bỏ trống'));
    }

    if (!req.body?.maSach){
        return next(new ApiError(400, 'Mã sách không được bỏ trống'));
    }

    try {
        const theodoiService = new TheodoiService(MongoDB.client);        
        const document = await theodoiService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "Có lỗi trong khi theo dõi mới")
        );
    }

}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const {maDG} = req.query;
        const {maSach} = req.query;
        const {ngaymuon} = req.query;
        const {trangthai} = req.query;
        if (maDG) {
            documents = await theodoiService.findByMaDG(maDG);
        }else if (maSach) {
            documents = await theodoiService.findByMaSach(maSach);
        }else if (ngaymuon) {
            documents = await theodoiService.findByNgayMuon(ngaymuon);
        } else if (trangthai) {
            documents = await theodoiService.findByTrangthai(trangthai);
        } else{
            documents = await theodoiService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'Có lỗi xảy ra khi tìm theo dõi')
        );
    }
    return res.send(documents); 
};

exports.findOne = async (req, res, next) => {
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        
        const document = await theodoiService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'Lịch sử không tồn tại'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Có lỗi xảy ra trong khi tìm kiếm id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cập nhật không được để trống'));
    }

    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const document = await theodoiService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, 'Lịch sử mượn không tồn tại'));
        }
        return res.send({message: 'Sổ mượn được cập nhật thành công'});	
    }catch (error){
        return next(
            new ApiError(500,`Có lỗi xảy ra trong khi cập nhật id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const document = await theodoiService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Lịch sử mượn không tồn tại'));
        }
        return res.send({message: 'Lịch sử mượn được xóa thành công'});
    }catch (error){
        return next(
            new ApiError(500, `Có lỗi xảy ra trong khi xóa id=${req.params.id}`)
        );
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const deletedCount = await theodoiService.deleteAll();
        return res.send({
            message: `${deletedCount} Theo dõi được xóa thành công`
        });
    } catch (error){
        return next (
            new ApiError(500, 'Có lỗi xảy ra trong khi xóa')
        );
    }
}

exports.muonSach = async (req, res, next) => {
    // console.log(req.body)
    const { docGiaID, maSach } = req.body;
    
    if (!docGiaID || !maSach) {
        return next(new ApiError(400, 'Mã độc giả và mã sách không được bỏ trống'));
    }
    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        
        // Kiểm tra số lượng sách độc giả đã mượn (chưa trả)
        const dsMuon = await theodoiService.find({ docGiaID, trangthai: 'Chờ duyệt' });

        if (dsMuon.length >= 2) {
            return next(new ApiError(400, 'Độc giả chỉ được mượn tối đa 2 sách cùng lúc'));
        }

        // Thêm vào danh sách chờ duyệt
        const requestMuon = {
            maDG: docGiaID,
            maSach,
            ngaymuon: new Date().toISOString(),
            trangthai: 'Chờ duyệt'
        };

        const document = await theodoiService.create(requestMuon);
        return res.send({ message: 'Yêu cầu mượn sách đã được gửi', data: document });
        
    } catch (error) {
        return next(new ApiError(500, 'Có lỗi xảy ra khi mượn sách'));
    }
};

exports.duyetMuonSach = async (req, res, next) => {
    const { id } = req.params;
    const sachService = require('../services/sach.service'); // Import service quản lý sách

    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const sachSvc = new sachService(MongoDB.client);

        // Lấy thông tin mượn sách
        const muonSach = await theodoiService.findById(id);
        if (!muonSach) {
            return next(new ApiError(404, 'Không tìm thấy yêu cầu mượn sách'));
        }

        if (muonSach.trangthai !== 'Chờ duyệt') {
            return next(new ApiError(400, 'Yêu cầu này đã được xử lý'));
        }

        // Kiểm tra số lượng sách còn lại
        const sach = await sachSvc.findById(muonSach.maSach);
        if (!sach) {
            return next(new ApiError(404, 'Sách không tồn tại'));
        }
        if (sach.soquyenSach <= 0) {
            return next(new ApiError(400, 'Sách này đã hết, không thể mượn'));
        }

        // Giảm số lượng sách đi 1
        await sachSvc.update(sach._id, { soquyenSach: sach.soquyenSach - 1 });

        // Cập nhật trạng thái mượn thành "Đã duyệt"
        const updatedDoc = await theodoiService.update(id, { 
            trangthai: 'Đã duyệt',
            ngaymuon: new Date().toISOString()
        });

        return res.send({ message: 'Yêu cầu mượn sách đã được duyệt', data: updatedDoc });

    } catch (error) {
        return next(new ApiError(500, 'Có lỗi xảy ra khi duyệt yêu cầu mượn sách'));
    }
};


exports.xacNhanTraSach = async (req, res, next) => {
    const { id } = req.params;
    const ngaytra = new Date().toISOString();
    const sachService = require('../services/sach.service'); // Import service quản lý sách

    try {
        const theodoiService = new TheodoiService(MongoDB.client);
        const sachSvc = new sachService(MongoDB.client);

        // Lấy thông tin mượn sách
        const muonSach = await theodoiService.findById(id);
        if (!muonSach) {
            return next(new ApiError(404, 'Không tìm thấy yêu cầu mượn sách'));
        }

        if (muonSach.trangthai !== 'Đã duyệt') {
            return next(new ApiError(400, 'Chỉ có thể xác nhận trả sách cho các yêu cầu đã được duyệt'));
        }

        // Tăng số lượng sách lên 1 khi sách được trả
        const sach = await sachSvc.findById(muonSach.maSach);
        if (sach) {
            await sachSvc.update(sach._id, { soquyenSach: sach.soquyenSach + 1 });
        }

        // Cập nhật trạng thái mượn thành "Đã trả"
        const updatedDoc = await theodoiService.update(id, { 
            trangthai: 'Đã trả',
            ngaymuon: muonSach.ngaymuon,
            ngaytra: ngaytra
        });

        return res.send({ message: 'Xác nhận trả sách thành công', data: updatedDoc });

    } catch (error) {
        return next(new ApiError(500, 'Có lỗi xảy ra khi xác nhận trả sách'));
    }
};



