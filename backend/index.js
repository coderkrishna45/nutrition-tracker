require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth',authRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is started on ${process.env.PORT}`);
})