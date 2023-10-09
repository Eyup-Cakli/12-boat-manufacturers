const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatManufacturerLogosSchema = new mongoose.Schema({
    fileName: {
        type: String,
        default: ''
    },
    ...projectBaseModel
},{timestamps: true});

const boatManufacturerLogo = mongoose.model('boatManufacturerLogos', boatManufacturerLogosSchema);
module.exports = boatManufacturerLogo;