const express = require('express')
const colors=require('colors')
const morgan=require('morgan')
const dotenv=require('dotenv')
const connectDB = require("./Config/db")

//config
dotenv.config();

//mongoosee connection
connectDB();

//rest object
const app = express()

//middlewares
app.use(express.json())
app.use(morgan("dev"))

//routes
app.use('/api/v1/user',require("./Routes/UserRoutes"))
app.use('/api/v1/admin',require("./Routes/AdminRoutes"));
app.use('/api/v1/doctor',require("./Routes/DoctorRoutes"));


//port
const port = process.env.PORT || 8080;

//listen port

app.listen(port,() =>{
    console.log(`server running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
    .bgCyan.white
    );
});


