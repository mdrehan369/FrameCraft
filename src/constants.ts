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

export const reactContainer = `
import React from 'react'

function Container({
    children, 
    className,
    ...props
}) {
  return (
    <div className='w-[100vw] h-auto relative min-h-[90vh] dark:bg-primary-color dark:text-white' {...props}>
        {children}
    </div>
  )
}

export default Container
`

export const reactContainerTs = `
import React from 'react'

type Props = {
  children?: React.ReactNode,
  className?: string
}

function Container({
    children, 
    className,
    ...props
}: Props) {
  return (
    <div className='w-[100vw] h-auto relative min-h-[90vh] dark:bg-primary-color dark:text-white' {...props}>
        {children}
    </div>
  )
}

export default Container
`

export const reactHome = `
import React from 'react'

function Home({
    children,
    className,
    ...props
}) {
  return (
    <div>
        Hello World by FrameCraft
    </div>
  )
}

export default Home
`

export const reactHomeTs = `

import React from 'react'

type Props = {
  children?: React.ReactNode,
  className?: string
}

function Home({
    children,
    className,
    ...props
}: Props) {
  return (
    <div {...props}>
        Hello World by FrameCraft
    </div>
  )
}

export default Home

`

export const loader = `
import React from 'react'

function LightSpinner({color}) {
    return (
        <div role="status" className='w-[100%] h-[100%] flex items-center justify-center'>
            <svg aria-hidden="true" className='inline w-6 h-6 text-white text-opacity-50 animate-spin dark:text-gray-600 dark:fill-gray-300' viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default LightSpinner
`

export const reactApp = `
import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react";

function App() {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])

    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default App
`

export const reactMain = (ts: boolean) => `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')${ts ? '!' : ''}).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
`

export const NotFound = `
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
        404 Page Not Found!
        <Link to="/"> Go Back </Link>
    </div>
  );
};

export default NotFound;
`