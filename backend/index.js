require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const goalsRoutes = require('./routes/goalsRoutes');

app.use('/api/auth',authRoutes);
app.use('/api/goals',goalsRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is started on ${process.env.PORT}`);
})