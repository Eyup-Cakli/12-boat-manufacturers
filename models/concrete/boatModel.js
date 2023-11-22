const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatModelSchema = new mongoose.Schema({
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Manufacturer id should be declared.'],
        ref: 'boatManufacturers'
    },
    modelName: {
        type: String,
        required: [true, 'Model name should be declared.']
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Type id should be declared.'],
        ref: 'boatType'
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
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Hull metarial id should be declared.'],
        ref: 'boatHullMetarial'
    },
    ...projectBaseModel
},{timestamps: true});

const boatModel = mongoose.model('boatModel', boatModelSchema);

module.exports = boatModel;