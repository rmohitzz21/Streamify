import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    bio: {
      type: String,
      default: "",
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default: "",
    },
    nativeLanguage: {
        type:String,
        default: "",
    },
    learningLanguage:{
        type:String,
        default: ""
    },
    location:{
        type:String,
        default: "",
    },
    isOnboarded: {
        type:Boolean,
        default:false
    },
    friends: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
        }
    ]

},{timestamps: true});

// John@gmail.com 123445 = > $?_3411 // Password Hashing
// TODO :
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    // If password is not modified, skip hashing
    // If password is modified, hash it
    try {
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
} 

const User = mongoose.model("User", userSchema);

// Pre Hook


export default User;