const dailyfoods = require("../models/dailyfoodModel")

exports.eachdayfoods = async(req,res)=>{
    const userId = req.payload
    console.log(userId)
    // const {breakFast,lunch,dinner,snacks,date} = req.body
    const {food_name,serving,serveUnit,calories,protein,fat,carbs,mealtime,date,foodimg} = req.body
    console.log("data",req.body)
    const uploadedImage = req.file?req.file.filename:foodimg
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
            if(existingData[mealtime]){
                console.log('Inside', mealtime)
                existingData[mealtime].push({...req.body,foodimg:uploadedImage})
                await existingData.save()
                res.status(200).json(existingData)
            }
            else{
                console.log('Inside error', mealtime)
                res.status(406).json('Error occured due to improper meal time')
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
                res.status(406).json('Error occured due to improper meal time')
            }
            
        }
    } catch (err) {
        res.status(401).json(err)
    }

}