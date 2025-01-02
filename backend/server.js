const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors'); 
const authRoutes = require('./routes/auth');
const planRoutes=require('./routes/planRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const gigTicket=require('./routes/gigTicket')
const taskRoutes=require('./routes/taskRoutes')
const memberRoutes=require('./routes/memberRoutes')
const path = require('path');

dotenv.config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const sessionOptions={
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,  
        httpOnly: true,               
        secure: false,              
        sameSite: 'None',             
    }

}
app.use(cors({
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  
}));

mongoose.connect('mongodb://127.0.0.1:27017/user')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(session(sessionOptions));


app.use('/user', authRoutes); 
app.use('/api/plans', planRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/ticket", gigTicket);
app.use("/api/member", memberRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
