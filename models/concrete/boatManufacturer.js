const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatManufacturerSchema = new mongoose.Schema({
    logoId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: [true, 'This logo id already used.']
    },
    manufacturerName: {
        type: String,
        required: [true, 'Please enter a manufacturer name.'],
        unique: [true, 'This manufacturer already registered']
    },
    manufacturerWebSite: {
        type: String,
        default: ''
    },
    ...projectBaseModel
},{timestamps: true});
const boatManufacturer = mongoose.model('boatManufacturers', boatManufacturerSchema);

module.exports = boatManufacturer;