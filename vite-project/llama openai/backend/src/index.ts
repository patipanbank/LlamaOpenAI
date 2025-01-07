import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/gradeRoutes';

const app = express();
const PORT = 3000;

// แก้ไข URL ให้ตรงกับ MongoDB Compass
const MONGODB_URL = 'mongodb://localhost:27017/gradeDB';

// เพิ่ม debug logs
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// เชื่อมต่อ MongoDB
mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB at:', MONGODB_URL);
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 