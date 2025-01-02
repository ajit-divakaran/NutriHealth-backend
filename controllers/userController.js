const jwt =  require('jsonwebtoken')
const users = require("../models/userModel")

exports.register = async(req,res) =>{
    const {username,email,password} = req.body
    try {
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json('User Alraedy exists')
        }
        else{
            const newUser = new users({
                username,
                email,
                password
            })

            await newUser.save()
            res.status(200).json('New User Added')
        }
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.login = async(req,res)=>{
    //logic
    const {email,password} = req.body;
    console.log(email,password)
    console.log("inside login")
    try {
        const existingUser = await users.findOne({email,password})
        if(existingUser){
            const { password, email, ...userWithoutSensitiveInfo } = existingUser.toObject()
            console.log(userWithoutSensitiveInfo)
            const token = jwt.sign({userId:existingUser._id},'secretkey')
            res.status(200).json({existingUser:userWithoutSensitiveInfo,token})
        }
        else{
         res.status(406).json("Incorrect email id or password")
        }
        
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.editgoals = async(req,res)=>{
    const userid = req.payload
    console.log(userid)
    const{goals} = req.body
    console.log(goals)
    try {
        const existingUser = await users.findByIdAndUpdate({_id:userid},{
            goals
        },{new:true})
        console.log(existingUser)

        await existingUser.save()
        const updatedUser = await users.findOne({_id:userid})
        const {email,password,...detailswithoutsensitiveinfo} = updatedUser.toObject()
        res.status(200).json(detailswithoutsensitiveinfo)
        
           
       
    } catch (error) {
        res.status(401).json(error)
    }
}


exports.addUserSearchfoods = async(req,res)=>{
    const userid = req.payload
    console.log(userid)
    const {search,data} = req.body
    console.log(search,data)
    try {
        const existingSearch = await users.findOne({_id:userid})
        console.log(existingSearch)
        if(!existingSearch.searchedfoods){
            existingSearch.searchedfoods={}
        }

        if(existingSearch.searchedfoods.hasOwnProperty(search)){

            res.status(406).json("Already recipe exists")
        }
        else{
            existingSearch.searchedfoods[search] = data
            existingSearch.markModified("searchedfoods");
            await existingSearch.save()
            res.status(200).json({message:"New Recipe added",existingUser:existingSearch})
        }

    } catch (error) {
        res.status(401).json(error)
    }

}


exports.editUSDAImages = async(req,res) =>{
    const userid = req.payload
    const {fdcId,foodimg} = req.body
    const uploadedImage = req.file?req.file.filename:foodimg
    try {
        const existingFoodId = await users.findById({_id:userid})
        if(!existingFoodId){
            return res.status(406).json('Invalid user')
        }
        if(!existingFoodId.changedImages){
            existingFoodId.changedImages = []
        }

     
            
            // const check = existingFoodId.changedImages.filter(x=>x.fdcId==fdcId)
            const check = existingFoodId.changedImages.findIndex(obj=>obj.fdcId==fdcId)
            if(check !== -1){

                // const updatedArray = existingFoodId.map(obj=>{
                //     if(obj.fdcId==fdcId){
                //         return {...obj,foodimg:foodimg}
                //     }
                //     return obj
                // })
                existingFoodId.changedImages[check].foodimg = uploadedImage;
            }
            else{
                existingFoodId.changedImages.push({fdcId:fdcId,foodimg:uploadedImage})
                
            }
            await existingFoodId.save()
           

        
        
        
        res.status(200).json({existingUser:existingFoodId})
    } catch (err) {
        res.status(401).json(err)
    }
}


// result_add = collection.update_one(
//     {"name": "John Doe"}, 
//     {"$set": {"foods.Pizza": new_food}} 
//      {returnDocument: 'after'}
// )