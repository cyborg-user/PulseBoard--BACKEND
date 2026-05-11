import "dotenv/config" 
import app from "./src/app.js"
import { connect } from "node:http2"
import connectDB from "./src/common/config/db.js"

console.log("Server file started...");
console.log(process.env.MONGO_URI)

const PORT= process.env.PORT || 5000

const start = async() =>{
    //connection to database
    await connectDB()
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT}`)
    })
}

start().catch((err)=>{
    console.error("failed to start server", err)
    process.exit(1)
})
