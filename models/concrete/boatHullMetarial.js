const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatHullMetarialSchema = new mongoose.Schema({
    boatHullMetarialName: {
        type: String,
        required: [true, 'Metarial name should be declared.']
    },
    ...projectBaseModel
},{timestamps: true});

const boatHullMetarial = mongoose.model('boatHullMetarial', boatHullMetarialSchema);

module.exports = boatHullMetarial;