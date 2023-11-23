const books = require("../model/bookmodel");
const users = require("../model/usermodel");
const orders=require("../model/ordermodel")

const register = async (req, res) => {
    const { name, email, psw } = req.body
    if (!name || !email || !psw) {
        res.status(400).json("All fields are required")
    }
    else {
        try {
            const user = await users.findOne({ email })
            if (user) {
                res.status(401).send("User already exist")
            }
            else {
                var newUser = new users({
                    name, email, psw
                })
                newUser.save()
                res.json(newUser.name)
            }
        }
        catch {
            res.status(400).json("Connection Error")
        }
    }
}

const login= async (req,res)=>{
    const {email,psw}=req.body
    if(!email || !psw){
        res.status(400).json("All fields are required")
    }
    else{
        try{
            const user= await users.findOne({email,psw})
            // res.json(user.cart.length)
            if(user){
                res.status(200).json({id:user._id,email,uname:user.name,cartlen:user.cart.length,whishlen:user.whishlist.length})
            }
            else{
                res.status(404).json("Incorrect Credinals")
            }
        }
        catch{
            res.status(400).json("Connection Error")
        }
    }
}

//add books
const addbooks= async(req,res)=>{
    const {name,category,price,author,language,publisher,isbn,img}=req.body
    if(!name || !category || !price || !author || !language || !publisher || !isbn || !img){
        res.status(400).json("All fields are required")
    }
    else{
        try{
            let isbno=await books.findOne({isbn})
            if(isbno){
                res.status(400).json("Book Already Exist")   
            }
            else{
                let newBook=new books({
                    name,category,price,author,language,publisher,isbn,img
                })
                await newBook.save()
                res.status(200).json(name)   
            }
        }
        catch{
            res.status(400).json("Connection Error")
        }
    }
}

//view users
const viewusers =async(req,res)=>{
    try{
        const result= await users.find()
        res.status(200).json(result.reverse())
    }
    catch{
        res.status(400).json("connection error")
    }
}

//get all books
const allbooks =async(req,res)=>{
    //access query param from api
    const searchKey=req.query.search
    //query
    // const query={
    //     name:{$regex:searchKey,$options:'i'}
    // }
    try{
        const result =await books.find({
            $or:[
               {
                name:{$regex:searchKey,$options:'i'},
               },
               {
                author:{$regex:searchKey,$options:'i'} 
               }
            ],
        })
        res.status(200).json(result.reverse())
    }
    catch{
        res.status(400).json("Connection error")
    }
}

//get single book
const singlebook=async(req,res)=>{
    const {id}=req.params
    try{
        const result=await books.findOne({_id:id})
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(400).json("No data found")
        }
    }
    catch{
        res.status(400).json("Connection error")
    }
}

//add to cart
const addcart=async(req,res)=>{
    const {id}=req.params
    const {name,price,img,isbn}=req.body
    try{
        const data=await users.findOne({_id:id})
        // console.log(data.cart.find(i=>i.name==name));
        if(data){
            if((data.cart.find(i=>i.name==name))!=null){
                let qty =(data.cart.find(i=>i.name==name).qty)+1
                const output = await users.updateOne({'cart.name':name},{'$set':{'cart.$.qty':qty,'cart.$.total':qty*price},})
                res.status(200).json(data.cart.length)    
            }
            else{
            data.cart.push({name,price,img,isbn,qty:1,total:price})
            data.save()
            res.status(200).json(data.cart.length)
            } 
        }
        else{
            res.staus(400).json("No user found")
        }   
    }
    catch{
        res.status(400).json("Connection error")
    }
}

//view cart items
const viewcart=async(req,res)=>{
    const {id}=req.params
    try
    {
        const user = await users.findOne({_id:id})
    if(user){
        res.status(200).json(user.cart)
    }
    else{
        res.status(400).json("User Not found")
    }
    }
    catch{
        res.status(400).json("Connection Error")
    }
}

//remove from cart
const removecart=async(req,res)=>{
    const {id,isbn}=req.body
    const data=await users.findOne({_id:id})
    try{
        if(data){
            users.updateOne(
                {_id:id},
                {$pull:{cart:{isbn:isbn}}},
                {multi:true}
            ).then(data=>{
                res.status(200).json(data)
            })
        }
        else{
            res.status(400).json("No Book found")
        }
    }
    catch{
        res.status(400).json("Connection Error")
    }
}

//clear cart
const clearcart =async(req,res)=>{
    const {id}=req.params
    // const data = await users.updateOne({_id:id},{$unset:{ cart : 1}})   //to remove a key from object
   try
    { const data = await users.updateOne({_id:id},{$set:{'cart':[]}})
    res.status(200).json(data)}
    catch{
        res.status(400).json("Connection Error")
    }
}

//placeorder
const placeorder=async(req,res)=>{
    const id=req.params.id
    const {address,ttlamnt,pay,cart}=req.body
    const data=await users.findOne({_id:id})
   try
    { 
    if(data){
        var neworder=new orders({
            user:id,address,ttlamnt,pay,cart
        })
        await neworder.save()
        res.status(200).json(neworder)
    }
    else{
        res.status(400).json("User Not registered")
    }
}
    catch{
        res.status(400).json("Connection Error")
    }
}

//filter 
const filterbook=async(req,res)=>{
    const {filterData}=req.query
    const filterbooks= await books.find({category:filterData})
    res.status(200).json(filterbooks)
}

//change pswd
const changepsw=async(req,res)=>{
    const {id,psw,newpsw}=req.body
    try{
        const result = await users.findOne({_id:id})
        if(result.psw==psw){
            // const data = await users.updateOne({_id:id},{$set:{'psw':newpsw}})       //will get only modified count
            const data = await users.findOneAndUpdate({_id:id},{$set:{'psw':newpsw}},{new:true})        //will get modified data also
            res.status(200).json("Password Changed")
        }
        else{
            res.status(400).json("Incorrect password")
        }
    }
     catch{
        res.status(400).json("Connection Error")
    }
}

//get order details
const myorder=async(req,res)=>{
    const {id}=req.params
    try{
        const result = await users.findOne({_id:id})
        if(result){
            const data=await orders.find({user:id})
            res.status(200).json(data.reverse())
        }
        else{
            res.status(400).json("No User Found")
        }
    }
    catch{
        res.status(400).json("Connection Error")
    }
}

//get all orders
const allorders=async(req,res)=>{
    try{
        const result=await orders.find({})
        res.status(200).json(result.reverse())
    }
    catch{
        res.status(400).json("Connection Error")
    }
}

//delete user
const deleteuser=async(req,res)=>{
    const{id}=req.params
    const result= await users.deleteOne({_id:id})
    try{
        if(result){
        res.status(200).json("Account deleted")
    }
    else{
        res.status(400).json("No user found")
    }
    }
    catch{
        res.status(400).json("Connection Error")
    }
}

//add to whishlist
const addwhishlist=async(req,res)=>{
    const {id}=req.params
    const {name,price,img,isbn}=req.body
    try{
        const data=await users.findOne({_id:id})
        if(data){
            if(!(data.whishlist.find(i=>i.name==name))){
                data.whishlist.push({name,price,img,isbn,total:price})
                data.save()
                res.status(200).json(data)
            }
            else{
                res.status(400).json(data.whishlist)
            }
        }
        else{
            res.staus(400).json("No user found")
        }  
    }
    catch{
        res.status(400).json("Connection error")
    }
}

//view whishlist
const viewwhishlist=async(req,res)=>{
    const {id}=req.params
    try{
        const user = await users.findOne({_id:id})
        if(user){
            res.status(200).json(user.whishlist)
        }
        else{
            res.status(400).json("User Not found")
        }
        }
    catch{
        res.status(400).json("Connection Error")
    }
}

//remove from whishlist
const removewhishlist=async(req,res)=>{
    const {id,isbn}=req.body
    const data=await users.findOne({_id:id})
    try{
        if(data){
            users.updateOne(
                {_id:id},
                {$pull:{whishlist:{isbn:isbn}}},
                {multi:true}
            ).then(data=>{
                res.status(200).json(data)
            })
        }
        else{
            res.status(400).json("No User found")
        }
    }
    catch{
        res.status(400).json("Connection Error")
    }
}

module.exports = { register,login,addbooks,viewusers,allbooks,singlebook,addcart,viewcart,removecart,clearcart,filterbook,placeorder,changepsw,
                    myorder,allorders,deleteuser,addwhishlist,viewwhishlist,removewhishlist}