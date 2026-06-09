const pool = require('../config/db.js');

const display_goals = async(req,res)=>{
    try{
        const user_id = req.user.user_id;
        const result = await pool.query("SELECT * FROM daily_goals WHERE user_id = $1",[user_id]);

        if(result.rows.length===0){
            return res.status(400).json({success:false,message:"no goals set yet"});
        }else{
            return res.status(200).json({success:true,result : result.rows[0]});
        }
    }catch(err){
        return res.status(500).json({success:false,message:`some issue found ${err}`});
    }
}

const change_goals = async(req,res)=>{
    try{
        const user_id = req.user.user_id;
        const { calories, protein, carbs, fat, sugar } = req.body;

        const UpsertQuery = `
            INSERT INTO daily_goals(user_id, calories, protein, carbs, fat, sugar)
                VALUES ($1,$2,$3,$4,$5,$6)
                    ON CONFLICT (user_id)
                        DO UPDATE SET
                            calories = EXCLUDED.calories,
                            protein = EXCLUDED.protein,
                            carbs = EXCLUDED.carbs,
                            fat = EXCLUDED.fat,
                            sugar = EXCLUDED.sugar
            Returning *;
        `
        const result = await pool.query(UpsertQuery, [user_id, calories, protein, carbs, fat, sugar]);
        res.status(201).json({ success: true, goals: result.rows[0] });

    }catch(err){
        return res.status(500).json({success:false,message:`some issue found ${err}`});
    }
}

module.exports = { display_goals, change_goals };