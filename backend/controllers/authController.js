const pool = require('../config/db.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const register = async(req,res)=>{
    try{
        const{email,name,password,mobile}=req.body;
        const result = await pool.query("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", [email]);
        const emailExists = result.rows[0].exists; 
        if(emailExists){
            return res.status(401).json({
                success:false,
                message:'email already exists'
            });
        }
        const saltRound = 10;
        const hashedPass = await bcrypt.hash(password,saltRound);
        const insertQuery = `
            INSERT INTO users (email, password,name,mobile) 
            VALUES ($1, $2,$3,$4) 
            RETURNING user_id, email;
        `;
        const newUser = await pool.query(insertQuery, [email, hashedPass,name,mobile]);

        res.status(201).json({ success: true, user: newUser.rows[0] });
    }catch(err){
        res.status(404).json({
            success:false,
            message:`there is an error ${err}`
        });
    }
};



const login = async(req,res)=>{
    try{
        const{email,password} = req.body;
        const queryText = "SELECT password,user_id,email FROM users WHERE email = $1 LIMIT 1;";
        const result = await pool.query(queryText, [email]);
        const userExists = result.rows.length > 0;
        if(!userExists){
            return res.status(401).json({
                success:false,
                message:`email ${email} doesn't exist`
            });
        }
        const storedHashedPassword = result.rows[0].password;
        const match = await bcrypt.compare(password,storedHashedPassword);
        if(match){
            const token = jwt.sign(
                {user_id:result.rows[0].user_id},
                process.env.JWT_SECRET,
                {expiresIn:'2D'}
            );            
            const dbUser = result.rows[0];
            res.status(200).json({
                success:true,
                message: "Login successful",
                token:token,
                user:{
                    id:dbUser.user_id,
                    email:dbUser.email
                }
            })
        }else{
             return res.status(401).json({ success:false , message: "Invalid email or password" });
        }
    }catch(err){
        res.status(500).json({success:false,message:`there is some error ${err} unable to login`});
    }
}

module.exports = { register, login };