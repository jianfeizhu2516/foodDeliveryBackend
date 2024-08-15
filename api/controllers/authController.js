import db from "../db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = (req,res)=>{

    const q = 'SELECT * FROM users WHERE email = ?';

    db.query(q,[req.body.email],(err,results)=>{
        if(err) return res.status(500).json({message:err.message})
        console.log('results是是',results)
        if(results?.length === 0) return res.status(404).json({message:'User not found!'})
        //check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password,results[0].password);

        if (!isPasswordCorrect) return res.status(400).json({message:"Wrong username or password!"});
        
        const token = jwt.sign({email:req.body.email},"jwtkey");

        res.cookie('access_token',token,{httpOnly:true})

        return res.status(200).json({message:"Login successul"})
    }) 
}

export const signup = (req,res)=>{

    const q = 'SELECT * FROM users WHERE email = ?';

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const {email,password} = req.body;

    const token = jwt.sign({email}, "jwtkey");
    
    db.query(q, req.body.email, (err,results)=>{
        if(err){
          return res.status(500).json({ error: err.message });
        }
        if(results?.length > 0)
        {   
            return res.json({message:"Email has alrady been used"})
        }
        const insertUserQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';

        db.query(insertUserQuery,[req.body.email,hashedPassword],(err,results)=>{
            if(err){
                return res.status(500).json({error:err.message});
            }
            return res.status(201).cookie("access_token",token,{
                httpOnly:true
            }).json({message:'User registration successful'})
        })

      
    }) 
}
