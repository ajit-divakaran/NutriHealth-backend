
const foods = require("../models/foodModel")
const fs = require('fs')
const path =require('path')


exports.getfooddata = async(req,res)=>{
    const id = req.payload // to be changed with req.payload
    console.log(typeof id, id)
    try {
        const allfoods = await foods.find({
            $or: [
                { userId: null }, // Include recipes without userId
                { userId: ""}, // Include recipes where userId is undefined
                { userId:`${id}` }
                 // Include recipes with the provided userId
            ]
        })
        console.log(allfoods)
        res.status(200).json({allfoods,userId:id})
        
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.addfoodgetfooddata = async(req,res) =>{
    const searchkey = req.query.search
    const inputArr = searchkey.trim().split(' ')
    try {
        //Convert the arry into regular expression array
        const regexArray = inputArr.map(input=> new RegExp(input,'i'))
        // const query = {
        //     food_name:{
        //         $regex:searchkey, $options:"i",
        //     }
        // }
        const searchfoods = await foods.find(
            {food_name:
                {$in:regexArray}
            }
        )
        if(searchfoods){
            res.status(200).json(searchfoods) 
        }
        else{
            res.status(200).json([])
        }
        
    } catch (error) {
        res.status(401).json(error)
    }
}


exports.newuserfood = async(req,res)=>{
    const userId = req.payload;
    const {food_name,serving,serveUnit,calories,protein,fat,carbs,foodimg} = req.body
    const uploadedImage = req.file?req.file.filename:foodimg
try {
    
    const fooddata = new foods({
        food_name,
        serving,
        serveUnit,
        calories:parseInt(calories,10),
        protein:parseInt(protein,10),
        fat:parseInt(fat,10),
        carbs:parseInt(carbs,10),
        userId,
        foodimg:uploadedImage
    })

    await fooddata.save()
    res.status(200).json(fooddata)
} catch (error) {
    res.status(401).json(error)
}
}

exports.editUserfood = async(req,res)=>{
    const {foodId} = req.params;
    const {food_name,serving,serveUnit,calories,protein,fat,carbs} = req.body
    const uploadedImage = req.file?req.file.filename:"";
    // console.log(req.file)
    console.log(uploadedImage)
    try {
        const existingFood = await foods.findOne({_id:foodId})
        
            let oldimgpath = existingFood.foodimg
            console.log("Old Image",oldimgpath)

            
            const editData = await foods.findByIdAndUpdate({_id:foodId},{
                food_name,serving,serveUnit,calories,protein,fat,carbs,foodimg:uploadedImage?uploadedImage:existingFood.foodimg
            },{ new: true})
            await editData.save()
            if(uploadedImage){
                console.log("New image",uploadedImage)
                fs.unlink(path.resolve(`uploads/${oldimgpath}`),(err)=>{
                    if(err){
                        console.log('Error deleting the image file')
                    }
                    else{
                        console.log('Old image deleted successfully')
                    }
                })
            }
     res.status(200).json(editData)
        
    } catch (error) {
        res.status(401).json(error)
    }

}

exports.deleteUserfood = async(req,res) =>{
    const {foodId} = req.params
    console.log("Inside delete foods")
    try {
        const existingFood = await foods.findOne({_id:foodId})
        
        if(existingFood){
        let oldimgpath = existingFood.foodimg
        console.log("Old Image",oldimgpath)
        const deletedFood = await foods.findByIdAndDelete({_id:foodId},{new: true})
        console.log(deletedFood)
       
        fs.unlink(path.resolve(`uploads/${oldimgpath}`),(err)=>{
                if(err){
                    console.log('Error deleting the image file')
                }
                else{
                    console.log('Old image deleted successfully')
                }
            })
        }
        res.status(200).json(existingFood)
    } catch (error) {
        res.status(401).json(error)
    }
}