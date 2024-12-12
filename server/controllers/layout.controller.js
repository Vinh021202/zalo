"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const layout_model_1 = __importDefault(require("../models/layout.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
// create layout
exports.createLayout = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, image, title, subTitle, faq, categories } = req.body;
        // Kiểm tra loại layout đã tồn tại hay chưa
        const isTypeExist = yield layout_model_1.default.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler_1.default(`${type} already exists`, 400));
        }
        if (type === "Banner") {
            if (!image || !title || !subTitle) {
                return next(new ErrorHandler_1.default("Image, title, and subtitle are required for Banner", 400));
            }
            // Upload ảnh lên Cloudinary
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(image, { folder: "layout" });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };
            // Lưu Banner vào MongoDB
            yield layout_model_1.default.create({ type: "Banner", banner });
        }
        if (type === "FAQ") {
            if (!faq || faq.length === 0) {
                return next(new ErrorHandler_1.default("FAQ array cannot be empty", 400));
            }
            const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    question: item.question,
                    answer: item.answer
                };
            })));
            yield layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            if (!categories || categories.length === 0) {
                return next(new ErrorHandler_1.default("Categories array cannot be empty", 400));
            }
            const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    title: item.title
                };
            })));
            yield layout_model_1.default.create({ type: "Categories", categories: categoriesItems });
        }
        // Trả về thành công
        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message || "Server error", 500));
    }
}));
// edit layout
exports.editLayout = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = yield layout_model_1.default.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            if (bannerData && bannerData.image && bannerData.image.public_id) {
                // Nếu bannerData có ảnh và public_id thì tiến hành xóa ảnh cũ
                yield cloudinary_1.default.v2.uploader.destroy(bannerData.image.public_id);
            }
            // Tải ảnh mới lên Cloudinary
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(image, {
                folder: "layout"
            });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle
            };
            // Cập nhật layout với banner mới
            yield layout_model_1.default.findByIdAndUpdate(bannerData.id, { banner });
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItem = yield layout_model_1.default.findOne({ type: "FAQ" });
            const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    question: item.question,
                    answer: item.answer
                };
            })));
            yield layout_model_1.default.findByIdAndUpdate(faqItem === null || faqItem === void 0 ? void 0 : faqItem._id, { type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData = yield layout_model_1.default.findOne({ type: "Categories" });
            const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    title: item.title
                };
            })));
            yield layout_model_1.default.findByIdAndUpdate(categoriesData === null || categoriesData === void 0 ? void 0 : categoriesData._id, {
                type: "Categories",
                categories: categoriesItems
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get layout by type
exports.getLayoutByType = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params; // Sử dụng req.params nếu type được truyền trong URL
        // const { type } = req.query; // Hoặc sử dụng req.query nếu type được truyền như query parameter
        const layout = yield layout_model_1.default.findOne({ type });
        if (!layout) {
            return next(new ErrorHandler_1.default("Layout not found", 404));
        }
        res.status(200).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
