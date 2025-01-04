const dailyfoods = require("../models/dailyfoodModel")

exports.eachdayfoods = async(req,res)=>{
    const userId = req.payload
    const {reQ} = req.params
    console.log(userId)
    // const {breakFast,lunch,dinner,snacks,date} = req.body
    const {food_id,food_name,serving,serveUnit,calories,protein,fat,carbs,mealtime,date,foodimg,customServing} = req.body
    console.log("data",req.body)
    const uploadedImage = req.file? process.env.SERVER +'/upload/'+req.file.filename:foodimg
    try {
        const existingData = await dailyfoods.findOne({userId:userId,date:date})
        if(existingData){
            // existingData.breakFast = breakFast;
            // existingData.lunch = lunch;
            // existingData.dinner = dinner;
            // existingData.snacks = snacks;
            console.log("User ID", userId)
            console.log("Date",date)
            console.log("Alraedy existing")
            console.log(existingData[mealtime])
         if(reQ=='edit'){   if(existingData[mealtime]){
                console.log('Inside', mealtime)
                existingData[mealtime].push({...req.body,foodimg:uploadedImage})
                await existingData.save()
                res.status(200).json(existingData)
            }
            else{
                console.log('Inside error', mealtime)
                res.status(406).json('Error occured due to improper meal time or server error')
            }}

        else if(reQ=='delete'){
            if(existingData[mealtime] && existingData[mealtime].findIndex(x=>x.food_id)!= -1){
                console.log('Delete')
                res.status(200).json('deleted item')
            }
        }
        else{
            res.status(406).json('Invalid query')
        }

           
        }
        else{
            const newData = new dailyfoods({
                userId,breakFast:[],lunch:[],dinner:[],snacks:[],date
            })
            console.log("Does not exist")
            
            if(newData[mealtime]){
                console.log('Inside', mealtime)
                newData[mealtime].push({...req.body,foodimg:uploadedImage})
                console.log(newData)
                await newData.save()
                res.status(200).json(newData)
            }
            else{
                console.log('Inside error', mealtime)
                res.status(406).json('Error occured due to improper meal time or Server error')
            }
            
        }
    } catch (err) {
        res.status(401).json(err)
    }

}

exports.getusermeals = async(req,res) =>{
    const userid = req.payload
    const {date} = req.params
    try {
        const existingmeal = await dailyfoods.findOne({userId:userid,date:date})
        if(existingmeal){
            
            res.status(200).json(existingmeal)
        }
        else{
            res.status(406).json(false)
        }

    } catch (err) {
        res.status(401).json(err)
    }
}