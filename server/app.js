import express from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from 'cors';

// Routes
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
mongoose
    .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT_URL, () => console.log(`Listening at Port ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));
