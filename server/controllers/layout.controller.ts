import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary"
import { url } from "inspector";
import { title } from "process";
// create layout
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, image, title, subTitle, faq, categories } = req.body;

        // Kiểm tra loại layout đã tồn tại hay chưa
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exists`, 400));
        }

        if (type === "Banner") {
            if (!image || !title || !subTitle) {
                return next(new ErrorHandler("Image, title, and subtitle are required for Banner", 400));
            }

            // Upload ảnh lên Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(image, { folder: "layout" });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };

            // Lưu Banner vào MongoDB
            await LayoutModel.create({ type: "Banner", banner });
        }

        if (type === "FAQ") {
            if (!faq || faq.length === 0) {
                return next(new ErrorHandler("FAQ array cannot be empty", 400));
            }

            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    };
                })
            );

            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }

        if (type === "Categories") {
            if (!categories || categories.length === 0) {
                return next(new ErrorHandler("Categories array cannot be empty", 400));
            }

            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    };
                })
            );

            await LayoutModel.create({ type: "Categories", categories: categoriesItems });
        }

        // Trả về thành công
        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message || "Server error", 500));
    }
});

// edit layout
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;

            if (bannerData && bannerData.image && bannerData.image.public_id) {
                // Nếu bannerData có ảnh và public_id thì tiến hành xóa ảnh cũ
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
            }

            // Tải ảnh mới lên Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(image, {
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
            await LayoutModel.findByIdAndUpdate(bannerData.id, { banner });

        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItem = await LayoutModel.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    };
                })
            );
            await LayoutModel.findByIdAndUpdate(faqItem?._id, { type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData = await LayoutModel.findOne({ type: "Categories" });

            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    };
                })
            );
            await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoriesItems
            });
        }

        res.status(200).json({
            success: true,
            message: "Layout updated successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// get layout by type
export const getLayoutByType = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params; // Sử dụng req.params nếu type được truyền trong URL
        // const { type } = req.query; // Hoặc sử dụng req.query nếu type được truyền như query parameter

        const layout = await LayoutModel.findOne({ type });

        if (!layout) {
            return next(new ErrorHandler("Layout not found", 404));
        }

        res.status(200).json({
            success: true,
            layout,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});