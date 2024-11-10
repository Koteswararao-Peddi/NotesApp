
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")


dotenv.config()

const app = express()

const PORT = 4000;


mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Mongodb connected successfully"))
    .catch((err)=>console.log(`error: ${err}`))

app.use(express.json())
app.use(cookieParser())
app.use(cors({ 
    origin: ["http://localhost:5173"], 
    credentials: true 
}))


app.use('/auth', require('./routes/authRoutes'))
app.use('/user',require('./routes/userRoutes'))
app.use('/notes',require('./routes/noteRoutes'))


// error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Serer Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})


app.listen(PORT, ()=> console.log(`Server started and running at ${PORT}`))


