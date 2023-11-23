const mongoose=require('mongoose')

mongoose.connect(process.env.base_url
//     ,{
//     useUnifiedTopology:true,
//     useNewUrlParser:true
// }
).then(()=>{
    console.log("MongoDB Atlas Connected");
}).catch((error)=>{
    console.log("Connection Error",error);
})
