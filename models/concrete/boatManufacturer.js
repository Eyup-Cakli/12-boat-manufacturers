const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatManufacturerSchema = new mongoose.Schema({
    manufacturerCode: {
        type: Number,
        unique: [true, 'This manufacturer code already used.']
    },
    manufacturerName: {
        type: String,
        required: [true, 'Please enter a manufacturer name.'],
        unique: [true, 'This manufacturer already registered']
    },
    filePath: {
        type: String,
        default: ''
    },
    fileName: {
        type: String,
        default: ''
    },
    manufacturerWebSite: {
        type: String,
        default: ''
    },
    ...projectBaseModel
},{timestamps: true});

boatManufacturerSchema.index({ manufacturerCode: 1 }, { unique: true });

// a middleware that automatically increases the manufacturerCode field
boatManufacturerSchema.pre('save', async function (next) {
    // if the value of manufacturerCode has not yet been assigned or is empty
    // Find the latest used manufacturerCode
    if (!this.manufacturerCode) {
        const lastBoatManufacturer = await this.constructor.findOne({}, { manufacturerCode: 1 }, { sort: { manufacturerCode: -1 } });
        
        if (lastBoatManufacturer) {
            this.manufacturerCode = lastBoatManufacturer.manufacturerCode + 1;
        } else {
            this.manufacturerCode = 1;
        }
    } 
    next();
});

const boatManufacturer = mongoose.model('boatManufacturers', boatManufacturerSchema);

module.exports = boatManufacturer;