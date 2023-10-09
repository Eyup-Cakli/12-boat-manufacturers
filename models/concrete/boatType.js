const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: [true, 'Type name should be declared.']
  },
  ...projectBaseModel
},{timestamps: true});

const boatType = mongoose.model('boatType', boatTypeSchema);

module.exports = boatType;