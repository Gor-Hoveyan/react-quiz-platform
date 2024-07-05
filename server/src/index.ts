import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import { errorMiddleware } from './utils/errorMiddleware';
import { authRouter } from './routes/authRouter';
import { testRouter } from './routes/testRouter';
import { userRouter } from './routes/userRouter';
import { commentRouter } from './routes/commentRouter';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true, 
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorMiddleware);

app.use('/api', authRouter);
app.use('/api', testRouter);
app.use('/api', userRouter);
app.use('/api', commentRouter);
connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})