const pool = require('../config/db.js');
const{GoogleGenerativeAI} = require('@google/generative-ai');

const scanLable = async(req,res)=>{
    try{
            const { image } = req.body;
            const user_id = req.user.user_id;
            const {name} = req.body;
            const prompt = `You are analyzing a nutrition label image for a product called "${name}".
            Extract the nutritional information and respond with ONLY a valid JSON object, 
            no explanation, no markdown, no extra text. 

            Use this exact format:
            {
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number,
            "sugar": number,
            "serving_size": number,
            "serving_unit": "g or ml or piece etc"
            }

            All values should be numbers per serving. If you cannot read the label clearly, 
            return: { "error": "unable to read label" }`;

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const result = await model.generateContent([
            prompt,
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: image
                    }
                }
            ]);
            const text = result.response.text();
            const parsed = JSON.parse(text);
            if(parsed.error){
                return res.status(400).json({success:false,message:'there is some issue with product listing'});
            }
            const is_custom = true;
            const productQ = await pool.query(`INSERT INTO products(user_id,name,is_custom) values($1,$2,$3) returning product_id`,[user_id, name, true]);
            const product_id = productQ.rows[0].product_id;
            await pool.query(
                `INSERT INTO nutrients (product_id, calories, protein, carbs, fat, sugar, serving_size, serving_unit)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [product_id, parsed.calories, parsed.protein, parsed.carbs, parsed.fat, parsed.sugar, parsed.serving_size, parsed.serving_unit]
            );
            return res.status(201).json({
                success: true,
                message: 'product scanned and saved',
                product_id: product_id,
                nutrients: parsed
            });
        }catch(err){
            return res.status(500).json({success:false,message:`there is an error ${err}`});
    }
}
module.exports = { scanLable };