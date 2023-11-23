const mongoose=require('mongoose')

const userModel=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    psw:{
        type:String,
        require:true,
        trim:true
    },
    cart:Array,
    whishlist:Array
})
const users=new mongoose.model('users',userModel)
module.exports=users