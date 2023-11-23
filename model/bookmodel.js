const mongoose=require('mongoose')

const bookmodel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        required:true
    },
    isbn:{
        type:Number,
        required:true
    },
    img:{
        type:String,
        required:true
    }
})

const books=new mongoose.model('books',bookmodel)
module.exports = books