const DocgiaService = require('../services/docgia.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.tenDG) {
        return next(new ApiError(400, 'Tên không được bỏ trống'));
    }

    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const { _id, ...payload } = req.body; // Bỏ qua `_id` nếu có
        const document = await docgiaService.create(payload);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, "Có lỗi trong khi tạo độc giả mới"));
    }
};


exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const {name} = req.query;
        const {taikhoanDG} = req.query;
        if (name) {
            documents = await docgiaService.findByName(name);
        }else if(taikhoanDG){
            documents = await docgiaService.findByTaiKhoan(taikhoanDG);
        } else {
            documents = await docgiaService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, 'Có lỗi xảy ra khi tìm kiếm độc giả')
        );
    }
    return res.send(documents); 
};

const { ObjectId } = require('mongodb');

exports.findOne = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return next(new ApiError(400, 'ID không hợp lệ'));
        }

        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.findById(req.params.id);

        if (!document) {
            return next(new ApiError(404, 'Độc giả không tồn tại'));
        }

        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Có lỗi xảy ra khi tìm độc giả với id=${req.params.id}`));
    }
};



exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cập nhật không được để trống'));
    }

    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.update(req.params.id, req.body);
        return res.send({ message: 'Độc giả đã được cập nhật thành công', document });    
    } catch (error) {
        console.error('Lỗi khi cập nhật độc giả:', error);
        return next(new ApiError(404, error.message));
    }
};



exports.delete = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return next(new ApiError(400, 'ID không hợp lệ'));
        }

        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id);

        if (!document) {
            return next(new ApiError(404, 'Độc giả không tồn tại'));
        }

        return res.send({ message: 'Độc giả được xóa thành công' });
    } catch (error) {
        return next(new ApiError(500, `Có lỗi xảy ra trong khi xoá id=${req.params.id}`));
    }
};


exports.deleteAll = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const deletedCount = await docgiaService.deleteAll();
        return res.send({
            message: `${deletedCount} Độc giả đã được xóa thành công`
        });
    } catch (error){
        return next (
            new ApiError(500, 'Có lõi xảy ra khi xóa tất cả độc giả')
        );
    }
}

exports.loginDocGia = async (req, res, next) => {
    try {
        const { dienthoaiDG, matkhauDG } = req.body;

        if (!dienthoaiDG || !matkhauDG) {
            return next(new ApiError(400, 'Số điện thoại và mật khẩu là bắt buộc'));
        }

        const docgiaService = new DocgiaService(MongoDB.client);
        const result = await docgiaService.loginDocGia(dienthoaiDG, matkhauDG);
        
        return res.send(result);
    } catch (error) {
        return next(new ApiError(401, error.message || 'Đăng nhập thất bại'));
    }
};



exports.registerDocGia = async (req, res, next) => {
    try {
        const { tenDG, dienthoaiDG, matkhauDG, confirmmatkhauDG } = req.body;
        const docgiaService = new DocgiaService(MongoDB.client);
        const result = await docgiaService.registerDocGia(tenDG, dienthoaiDG, matkhauDG, confirmmatkhauDG);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};