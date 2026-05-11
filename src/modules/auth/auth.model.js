import mongoose from "mongoose"
import bcrypt from"bcryptjs"

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Name is required"],
            trim: true,
            minlength:2,
            maxlength:50,
        },
         email:{
            type:String,
            required:[true, "Email is required"],
            unique:true,
            trim: true,
            lowercase:true
         },
          password:{
            type: String,
            required:[true, "password is required"],
            unique:true
        },
        role: {
      type: String,
      enum: [ "Admin", "Student"],
      default: "Student",
    },
     isVerified:{
        type:Boolean,
        default: false,

     },
     verificationToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  {
    timestamps:true
  },
    
)

// hash passowrd before saving

userSchema.pre("save", async function(){
    if(!this.isModified("password"))return;
    this.password =await bcrypt.hash(this.password,12)
})
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User =mongoose.model("User", userSchema);
export default User
