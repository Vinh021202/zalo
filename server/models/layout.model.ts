import { Schema,model,Document, Model } from "mongoose";



interface FaqItem extends Document{
    question:string,
    answer :string
}

interface Category extends Document {
    title:string,

}

interface BannerImage extends Document{
    public_id : string,
    url:string,

}

interface level extends Document {
    levelName : string
}
interface Layout extends Document{
    type:string,
    faq:FaqItem[],
    categories:Category[],
    banner:{
        image:BannerImage,
        title:string,
        subTitle:string,
    };
    levels:level[];
}

const faqSchema = new Schema<FaqItem>({
    question:{type:String},
    answer:{type:String}
})
const levelSchema = new Schema<level>({
    levelName:{type:String}
})
const categorySchema = new Schema<Category>({
    title:{type:String},

})

const bannerImageSchema = new Schema<BannerImage> ({
    public_id:{type:String},
    url:{type:String}
});

const layoutSchema = new Schema<Layout>({
    type:{type:String},
    faq:[faqSchema],
    categories:[categorySchema],
    banner: {
        image:bannerImageSchema,
        title:{type:String},
        subTitle:{type:String}
    },
    levels:[levelSchema]
})


const LayoutModel = model<Layout>('Layout',layoutSchema);
export default LayoutModel
