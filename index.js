const express=require('express')
const cors=require('cors')
require('dotenv').config()
const router=require('./route/userrouting')

const server=express()
server.use(express.json())
server.use(cors())
server.use(router)
require('./db/dbconnection')

const port=4000 || process.env.port
server.listen(port,()=>{
    console.log(`LMS server started at port ${port}`);
})