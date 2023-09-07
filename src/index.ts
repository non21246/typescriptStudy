import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(4040, () => {
    console.log('Server is running on localhost:4040/')
});

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://winserve:wins65@cluster0.glerzu7.mongodb.net/registration');
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());