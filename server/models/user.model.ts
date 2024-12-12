require('dotenv').config();
import mongoose,{Document,Schema,Model} from "mongoose";

import bcrybt from 'bcryptjs'
import jwt from 'jsonwebtoken';
const emailRegexPattern : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name:string;
    email:string;
    password:string;
    avatar : {
        public_id : string;
        url:string;
    };
    role: string;
    level:string;
    isVerified : boolean;
    isTest : false,
    courses:Array<{courseId:string}>;
    comparePassword:(password:string) => Promise<boolean>;
    SignAccessToken:() => string;
    SignRefreshToken:()=>string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name : {
        type:String,
        required:[true,"Please enter your name"]
    },
    email : {
        type:String,
        required:[true,"Plese enter your name"],
        validate: {
            validator:function(value:string) {
                return emailRegexPattern.test(value);
            },
            message : "pleas enter a valid email"
        },
        unique:true,
    },
    password: {
        type: String,
        // required: [true,"Please Enter your password"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false
    },
    avatar: {
        public_id: String,
        url : String
    },
    role : {
        type:String,
        default:"user",
    },
    isVerified: {
        type:Boolean,
        default:false,
    },
    courses: [
        {
            courseId: String,

        }
    ],
    level: {
        type:String,
        default: "Beginner"
    },
    isTest : {
        type:Boolean,
        default:false
    }


},{timestamps:true})

// Hash Password

userSchema.pre<IUser>('save',async function(next){
    if(!this.isModified('password')) {
        next();
    }
    this.password = await bcrybt.hash(this.password,10);
    next();
})

// Sign access Token
userSchema.methods.SignAccessToken = function(){
    return jwt.sign({id:this._id},process.env.ACCESS_TOKEN  || '',{
        expiresIn:"5m",
    })
}
// sign refresh Token
userSchema.methods.SignRefreshToken = function(){
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN  || '',{
        expiresIn:"3d",
    })
}

// compare password
userSchema.methods.comparePassword = async function(enteredPassword:string):Promise<boolean> {
    return await bcrybt.compare(enteredPassword,this.password)
};

const userModel:Model<IUser> = mongoose.model("User",userSchema);
export default userModel;