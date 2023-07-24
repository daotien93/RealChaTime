import express from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors';

// Routes
import AuthRoute from "./routes/AuthRoute";
import UserRoute from "./routes/UserRoute";
import PostRoute from "./routes/PostRoute";
import UploadRoute from "./routes/UploadRoute";
import ChatRoute from "./routes/ChatRoute";
import MessageRoute from "./routes/MessageRoute";

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// to serve images inside public folder
app.use(express.static('public'));
app.use('/images', express.static('images'));

dotenv.config();
const PORT_URL =process.env.PORT || 8000;

const CONNECTION =process.env.MONGODB_CONNECTION;   


app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)