const DocgiaService = require('../services/docgia.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

//create and save a new contact
exports.create = async (req, res, next) => {
    if (!req.body?.tenDG){
        return next(new ApiError(400, 'Tên không được bỏ trống'));
    }

    if (!req.body?._id){
        return next(new ApiError(400, 'Id không được bỏ trống'));
    }

    try {
        const docgiaService = new DocgiaService(MongoDB.client);        
        const document = await docgiaService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "Có lỗi trong khi tạo độc giả mới")
        );
    }

    // res.send ({message: "sdafafd"});
}

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

exports.findOne = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        
        const document = await docgiaService.findById(req.params.id);
        
        if (!document) {
            return next(new ApiError(404, 'Độc giả không tồn tại'));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Error occurred while retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Dữ liệu cập nhật không được bỏ trống'));
    }

    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.update(req.params.id, req.body);
        if (document) {
            return next(new ApiError(404, 'Đọc giả không tồn tại'));
        }
        return res.send({message: 'Độc gia được cập nhật thành công'});	
    }catch (error){
        return next(
            new ApiError(500,`Có lỗi xảy ra trong khi cập nhật id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const document = await docgiaService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, 'Độc giả không tồn tại'));
        }
        return res.send({message: 'Độc giả được xóa thành công'});
    }catch (error){
        return next(
            new ApiError(500, `Có lỗi xảy ra trong khi xoá id=${req.params.id}`)
        );
    }
}

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
        const docgiaService = new DocgiaService(MongoDB.client);
        const result = await docgiaService.loginDocGia(dienthoaiDG, matkhauDG);
        return res.json({ message: "Đăng nhập thành công", ...result });
    } catch (error) {
        next(error);
    }
};

exports.registerDocGia = async (req, res, next) => {
    try {
        const { dienthoaiDG, matkhauDG, confirmmatkhauDG } = req.body;
        const docgiaService = new DocgiaService(MongoDB.client);
        const result = await docgiaService.registerDocGia(dienthoaiDG, matkhauDG, confirmmatkhauDG);
        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};