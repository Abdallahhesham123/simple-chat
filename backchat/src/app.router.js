import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js'
import messageRouter from './modules/message/message.router.js';
import mongoose from 'mongoose';
import connectionDb from '../DB/connection.js';
import { globalErrorHandler } from './utils/errorHandling.js';
import cors from "cors";


const initApp = (app, express) => {

    app.use(express.json({}))
    mongoose.set('strictQuery', false)
    app.use(cors({}))
    connectionDb()
    app.get('/', (req, res) => res.send('Hello World!'))

    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/message', messageRouter)

    app.use("*" , (req,res)=>{
        return res.json({message:"404 Page Not Found"})
    })
    app.use(globalErrorHandler)

}


export default initApp