import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,

    },
    password:{
        type:String,
        required:true,
        select:false,
    },
})



userSchema.statics.hashPassword = async(password)=>{
return await bcrypt.hash(password,12);
}


userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = async function(){
    return jwt.sign({email:this.email},process.env.CODEXY_SECRET,{expiresIn:"24h"});
}


const User = mongoose.model('user',userSchema);

export default User;