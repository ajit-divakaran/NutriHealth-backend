const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  food_name: {
    required: true,
    type: String,
  },
  serving:{
    required: true,
    type: String
  },
  serveUnit:{
    
    type: String
  },
  calories: {
    required: true,
    type: Number,
  },
  protein: {
    required: true,
    type: Number,
  },
  fat: {
    required: true,
    type: Number,
  },
  carbs: {
    required: true,
    type: Number,
  },
  userId:{
    type:String
  },
  foodimg:{
    type:String
  }
});

const foods = mongoose.model("foods", foodSchema);

module.exports = foods;
