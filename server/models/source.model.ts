import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./user.model";
interface IComment extends Document {
    user:IUser,
    question:string,
    questionReplies : IComment[];
}

interface IReview extends Document {
    user:IUser,
    rating:number,
    comment : string,
    commentReplies?:IComment[]
}

interface ILink extends Document {
    title : string,
    url: string,
}

interface ICourse extends Document {
    title: string,
    description : string,
    image : string,
    instructor: object,
    price:number,
    category:string,
    lessons:ILink[],
    reviews: IReview[]
}

interface ICourceData extends Document {
    title:string,
    description : string,
    videoUrl : string,
    videoThumbnail:object,
    videoSection:string,
    videoLength: number,
    videoPlayer:string,
    link:ILink[],
    suggestion : string,
    comments:IComment[],
    questions:IComment[],
    assignmentFile:string
}

 interface ICourse extends Document {
    name:string,
    description:string,
    category:string,
    price:number,
    estimatedPrice?: number,
    thumbnail : object,
    tags:string,
    level:string,
    demoUrl: string,
    benefits: {title:string}[],
    prerequisites: {title: string}[],
    reviews: IReview[],
    courseData : ICourceData[],
    ratings?: number;
    purchased : number,
    isApprove : boolean,
    creator : IUser,
    registeredUsers: Array<{userId:string}>;
}

const reviewSchema = new Schema<IReview>({
    user : Object,
    rating: {
        type:Number,
        default:0
    },  
    comment:String,
    commentReplies:[Object]
},{timestamps:true});

const linkSchema = new Schema<ILink>({
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  });
const commentSchema = new Schema<IComment>({
    user:Object,
    question:String,
    questionReplies: [Object],

},{timestamps:true});

const courseDataSchema = new Schema<ICourceData>({
    videoUrl: { type: String, required: true },  // Lưu videoUrl là chuỗi (URL)
    title:String,
    videoSection:String,
    videoPlayer:String,
    videoLength:Number,
    description:String,
    links:[linkSchema],
    questions:[commentSchema],
    suggestion:String,
    assignmentFile:String
},{timestamps:true});


const courseSchema = new Schema<ICourse>({
    name: {
        type:String,
        required: true,
    },
    description: {
        type:String,
        required:true,
    }, 
    category: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:false,
    },
    estimatedPrice: {
        type:Number
    },
    thumbnail : {
        public_id : {
            type:String
        },    
        url:{
            type:String,
        },
    },
    tags : {
        type:String,
        required:true
    },
    level: {
        type:String,
        required:true
    },
    demoUrl: {
        type:String,
        required:true
    },
    benefits: [{
        title: String
    }],
    prerequisites: [{
        title:String,
    }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    registeredUsers:[  {
        userId: String,

    }],
    ratings: {
        type:Number,
        default:0,
    },
    purchased: {
        type: Number,
        default:0
    },
    isApprove :  {
        type:Boolean,
        default : false

    },
    creator : {
        type:Object,
        required:true
    }
  
},{timestamps:true})

const CourseModel : Model<ICourse> = mongoose.model("Course",courseSchema);
export default CourseModel;
