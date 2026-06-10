require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json({ limit: '50mb' }));// to ensure backend global body size is large 
const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const productRoutes = require('./routes/productsRoutes');

app.use('/api/auth',authRoutes);
app.use('/api/goals',goalsRoutes);
app.use('/api/products',productRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is started on ${process.env.PORT}`);
})