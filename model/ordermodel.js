const mongoose=require('mongoose')

const ordermodel=new mongoose.Schema({
    user:String,
    uname:String,
    address:String,
    ttlamnt:Number,
    pay:String,
    cart:Array,
    orderStatus:
        {type:String,
            default:"ordered"
        }
})

const orders=new mongoose.model('orders',ordermodel)
module.exports=orders