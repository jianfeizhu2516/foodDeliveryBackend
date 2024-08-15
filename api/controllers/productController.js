import db from "../db.js"
export const fetchAllProducts = (req,res)=>{
    const q = 'SELECT * FROM products';
    db.query(q,(err,results)=>{
        if(err){
          return res.status(500).json({ error: err.message });
        }
        res.json(results);
    }) 
}

