import * as ai from '../services/ai.service.js'

export const getResultController = async(req,res)=>{
    try{
        const {prompt} = req.query
        const result = await ai.generateResult(prompt)
        res.json(result)
    }
    catch(err){
        console.log(err)
        res.status(500).send({message:err.message})
    }
}