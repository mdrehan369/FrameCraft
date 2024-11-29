export const TsConfig = `
{
"compilerOptions": {
"target": "es2016",                                  
"module": "commonjs",                               
"rootDir": "src",                                  
"outDir": "build",                                   
"strict": true,                                      
"skipLibCheck": true                                 
  }
}
`

export const expressAppBoilerplate = `
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(express.static(path.join(__dirname, "/dist")));

app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => res.send("Hello World! by FrameCraft!"))

// Add your routers here


export default app
`

export const expressIndexBoilerplate = `
import dotenv from "dotenv"
import connectDB from "./lib/connectDB.js";
import app from "./app.js"
dotenv.config()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(\`⚙️ Server is running at port : \${process.env.PORT || 3000}\`);
    })
})
.catch((err) => {
    console.log("Database connection failed !!! Please configure your database first.", err);
})
`

export const expressConnectDBBoilerplate = `
const connectDB = async () => {
    try {
        // Connect your database here
    } catch (error) {
        console.log("Database connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB
`

export const expressApiResponse = `
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }
`

export const expressApiError = `
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}
`

export const expressAsyncHandler = `
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {console.log(err);next(err)})
    }
}

export { asyncHandler }

`

export const prettierrcFile = `
{
    "singleQuote": true,
    "bracketSameLine": true,
    "semi": false,
    "tabWidth": 4
}
`