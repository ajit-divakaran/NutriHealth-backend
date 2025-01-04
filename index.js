// create server
const express = require('express')

const cors = require('cors')

const router = require('./router')
require('dotenv').config()
require('./connection')

const apikey = process.env.API_KEY
// parse json data received

const nhServer = express()
nhServer.use(cors())

nhServer.use(express.json())



nhServer.use('/upload',express.static('./uploads'))
nhServer.use(router)

const PORT = 4002 || process.env.PORT

nhServer.listen(PORT,()=>{
    console.log(`Server successfully running on PORT ${PORT}`)
})

nhServer.get('/usda-foods/:datatype/list',async(req,res)=>{
    // console.log("seacrh",req)
let searchkey = req.query.search
const search = searchkey.split(' ').join('%20') 
const {datatype} = req.params
console.log(searchkey,datatype)
try {
    // console.log(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${search}&dataType=${datatype}&pageSize=50&sortBy=lowercaseDescription.keyword&sortOrder=asc&api_key=${apikey}`)
    const result = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${search}&dataType=${datatype}&api_key=${apikey}`)
    const data = await result.json()
    // console.log(data)
    res.status(200).json(data)
} catch (error) {
    res.status(500).json('Server Error'.error)
}
})

