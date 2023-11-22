const boatModel = require('../models/concrete/boatModel.js');
const boatManufacturer = require('../models/concrete/boatManufacturer.js');
const boatType = require('../models/concrete/boatType.js');
const boatHullMetarial = require('../models/concrete/boatHullMetarial.js');
const { model } = require('mongoose');

// COMMANDS 
// add a new model
const createModel_post = async (req, res) => {
    try {
        const manufacturerId = req.body.manufacturerId;
        const modelName = req.body.modelName;
        const typeId = req.body.typeId;
        const lengthMeter = req.body.lengthMeter;
        const beamMeter = req.body.beamMeter;
        const draftMeter = req.body.draftMeter;
        const boatHullMetarialId = req.body.boatHullMetarialId;

        const newModel = new boatModel({
            manufacturerId: manufacturerId,
            modelName: modelName,
            typeId: typeId,
            lengthMeter: lengthMeter,
            beamMeter: beamMeter,
            draftMeter: draftMeter,
            boatHullMetarialId: boatHullMetarialId     
        });

        const existingModel = await boatModel.findOne({
            manufacturerId: manufacturerId,
            modelName: modelName
        });
        
        if (!modelName) {
            return res.status(403).json({ erro: "Enter a model name." });
        }

        if (existingModel) {
            return res.status(403).json({ error: "This model already exists." });
        } else {
            const savedModel = await newModel.save();
            return res.status(200).json(savedModel);
        }
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// update a model
const updateModel_put = async (req, res) => {
    try {
        const modelId = req.params.id;
        const newManufacturerId = req.body.manufacturerId;
        const newModelName = req.body.modelName;
        const newTypeId = req.body.typeId;
        const newLengthMeter = req.body.lengthMeter;
        const newBeamMeter = req.body.beamMeter;
        const newDraftMeter = req.body.draftMeter;
        const boatHullMetarialId = req.body.boatHullMetarialId;

        if (!newModelName) {
            return res.status(403).json({ error: 'Model name can not be empty.' });
        }

        const existingModel = await boatModel.findOne({
            _id: modelId
        });

        const checkModelNameExists = await boatModel.findOne({ 
            modelName: newModelName
        });

        if (!existingModel) {
            return res.status(404).json({ error: "Model not found." });
        }

        if (existingModel.isDeleted) {
            return res.status(403).json({
                error: "You are not authorized to update this model because it is deleted."
            });
        }

        if (checkModelNameExists) {
            return res.status(403).json({
                error: "This model name is already in use, please use a different model name"
            });
        }

        if (existingModel) {
            existingModel.manufacturerId = newManufacturerId;
            existingModel.modelName = newModelName;
            existingModel.typeId = newTypeId;
            existingModel.lengthMeter = newLengthMeter;
            existingModel.beamMeter = newBeamMeter;
            existingModel.newDraftMeter = newDraftMeter; 
            existingModel.boatHullMetarialId = boatHullMetarialId;

            const savedModel = await existingModel.save();
            return res.status(200).json(savedModel);
        } else {
            return res.status(403).json(err);
        }
    } catch (err) {
        console.error('Caught an error: ', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// delete a model
const deleteModel_delete = async (req, res) => {
    try {
        const modelId = req.params.id;

        const existingModel = await boatModel.findOne({
            _id: modelId
        });

        if (!existingModel) {
            return res.status(404).json({ error: "Model not found." });
        }

        if(existingModel.isDeleted) {
            return res.status(403).json({ error: "You can not delete this model, beacause this model already deleted." });
        }

        if (existingModel) {
            existingModel.isDeleted = true;
            await existingModel.save();
            return res.status(200).json({ message: "Model deleted successfully." });
        } else {
            return res.status(403).json({ err });
        }

    } catch (err) {
        console.error("Caught an error: ", err);
    };
};

// QUERIES
// get all models
const getAllModels_get = async (req, res) => {
    try {
        const models = await boatModel.find({ isDeleted: false });
        res.status(200).json(models);
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json("Internal server error.");
    }
};

// population
const getModelDetails = async (req, res) => {
    try {
        const modelDetails = await boatModel.find({ isDeleted: false })
            .populate({
                path: 'manufacturerId',
                select: 'manufacturerName'
            })
            .populate({
                path: 'typeId',
                select: 'typeName'
            })
            .populate({
                path: 'boatHullMetarialId',
                select: 'boatHullMetarialName'
            });

        return res.status(200).json(modelDetails);
    } catch (err) {
        console.error("Caught an error: ", err );
        return res.status(500).json({ error: "Internal server error." });
    }
}

// get model by modelcode
const getModelById_get = async (req, res) => {
    try {
        const modelId = req.params.id;
        
        const model = await boatModel.findOne({
            _id: modelId
        });

        if (!model) {
            return res.status(404).json({ error: "Model not found." });
        }

        if (model.isDeleted) {
            return res.status(404).json({ error: "You can not get this model, because it is deleted." });
        } else {
            return res.status(200).json(model);
        }
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json("Internal server error.");
    }
}

// get models by manufacturers
const getModelsByManufacturerId_get = async (req, res) => {
    try {
        const manufacturerId = req.params.id;

        const model = await boatModel.find({
            manufacturerId: manufacturerId,
            isDeleted: false
        });

        if (!model) {
            return res.status(404).json({ error: "Model not found." })
        }

        return res.status(200).json(model);
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json('Internal server error.');
    }
}

// get manufacturer name by id
const getManufacturerNameById = async (req, res) => {
    try {
        const modelId = req.params.id;
        const model = await boatModel.findOne({
            _id: modelId,
        });
        const manufacturerId = model.manufacturerId;

        const manufacturer = await boatManufacturer.findOne({
            _id: manufacturerId
        });
        const manufacturerName = manufacturer.manufacturerName;
        res.status(200).json(manufacturerName);
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// get type name by id
const getTypeNameById = async (req, res) => {
    try {
        const modelId = req.params.id;
        const model = await boatModel.findOne({
            _id: modelId
        });
        const typeId = model.typeId;

        const type = await boatType.findOne({
            _id: typeId
        });

        const typeName = type.typeName;
        res.status(200).json(typeName);
    } catch (err) {
        console.error("Caught an error: ", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

const getHullMetarialNameById = async (req, res) => {
    try {
        const modelId = req.params.id;
        const model = await boatModel.findOne({
            _id: modelId
        });
        const boatHullMetarialId = model.boatHullMetarialId;

        const hullMetarial = await boatHullMetarial.findOne({
            _id: boatHullMetarialId
        });

        const hullMetarialName = hullMetarial.boatHullMetarialName
        res.status(200).json(hullMetarialName);
    } catch (err) {
        console.error("Caught an error: ", err );
        return res.status(500).json({ error: "Internal server error." });
    }
}

module.exports = {
    createModel_post,
    updateModel_put,
    deleteModel_delete,
    getAllModels_get,
    getModelById_get,
    getModelsByManufacturerId_get,
    getManufacturerNameById,
    getTypeNameById,
    getHullMetarialNameById,
    getModelDetails
};