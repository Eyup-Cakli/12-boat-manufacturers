const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatModelSchema = new mongoose.Schema({
    manufacturerCode: {
        type: Number,
        required: [true, 'Manufacturer code should be declared.']
    },
    modelCode: {
        type: Number,
        unique: [true, 'Model code should be unique.']
    },
    modelName: {
        type: String,
        required: [true, 'Model name should be declared.']
    },
    typeCode: {
        type: Number,
        required: [true, 'Type code should be declared.']
    },
    lengthMeter: {
        type: Number
    },
    lengthFeet: {
        type: Number
    },
    lengthInches: {
        type: Number
    },
    beamMeter: {
        type: Number
    },
    beamFeet: {
        type: Number
    },
    beamInches: {
        type: Number
    },
    ...projectBaseModel
},{timestamps: true});

boatModelSchema.index({ modelCode: 1 }, { unique: true });

boatModelSchema.pre('save', async function (next) {
    if (!this.modelCode) {
        const lastBoatModelCode = await this.constructor.findOne({}, { modelCode:1 }, { sort: { modelCode: -1 } });

        if (lastBoatModelCode) {
            this.modelCode = lastBoatModelCode.modelCode +1;
        } else {
            this.modelCode = 1;
        }
    }
    next();
});

const boatModel = mongoose.model('boatModel', boatModelSchema);

module.exports = boatModel;