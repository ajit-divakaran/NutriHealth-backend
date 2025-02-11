require('dotenv').config()
const jwt =  require('jsonwebtoken')
const users = require("../models/userModel")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


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

exports.paymentFunc = async(req,res) =>{
    const {products} = req.body;
    console.log(products)
    try{
      const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data:{
            currency:"inr",
            product_data:{
              name:products,
                // images:[product.imgdata]
            },
            unit_amount:99 * 100,
        },
        quantity:1
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: 'newdemo@gmail.com',
    })
    
    res.status(200).json(session)
    }
    catch(err){
      res.status(500).json('Internal server error')
    }
}

exports.verifypayment = async (req, res) => {
    const { sessionId } = req.body;
    const userid = req.payload;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
    
      if(session.payment_status === 'paid'){
        const existingUser = await users.findOne({_id:userid})
        if(existingUser){
            existingUser.payment_status = 'paid'
            await existingUser.save()
            res.status(200).json(session);
        }
        else{
            res.status(401).json('Error in updating the payment status')
        }
      }
    } catch (error) {
      console.error('Error retrieving session:', error);
      res.status(500).json({ error: 'Failed to retrieve session' });
    }
  }


  exports.cancelSession = async(req,res) =>{
    const {sessionId} = req.body
    try {
        const session = await stripe.checkout.sessions.expire(sessionId);
        res.status(200).send({ success: true, session });
      } catch (error) {
        res.status(500).send({ success: false, error: error.message });
      }
    
  }

// result_add = collection.update_one(
//     {"name": "John Doe"}, 
//     {"$set": {"foods.Pizza": new_food}} 
//      {returnDocument: 'after'}
// )