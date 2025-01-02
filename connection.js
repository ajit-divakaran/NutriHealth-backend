const mongoose = require('mongoose')
const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>
 console.log('mongoose connected successfully')
).catch((err)=>console.log(err))