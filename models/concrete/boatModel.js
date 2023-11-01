const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatModelSchema = new mongoose.Schema({
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Manufacturer code should be declared.']
    },
    modelName: {
        type: String,
        required: [true, 'Model name should be declared.']
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Type code should be declared.']
    },
    lengthMeter: {
        type: Number
    },
    beamMeter: {
        type: Number
    },
    draftMeter: {
        type: Number
    },
    boatHullMetarialId: {
        type: mongoose.Schema.Types.ObjectId
    },
    ...projectBaseModel
},{timestamps: true});

const boatModel = mongoose.model('boatModel', boatModelSchema);

module.exports = boatModel;