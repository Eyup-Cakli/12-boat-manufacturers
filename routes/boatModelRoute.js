const Router = require("express");
const {
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
} = require("../controllers/boatModelController.js");

const router = Router();

router.post("/model", createModel_post);
router.put("/model/:id", updateModel_put);
router.delete("/model/:id", deleteModel_delete);
router.get("/model", getAllModels_get);
router.get("/modeldetails", getModelDetails);
router.get("/model/:id",getModelById_get);
router.get("/model-bytmanufacturerid/:id", getModelsByManufacturerId_get);
router.get("/model-manufacturername/:id", getManufacturerNameById);
router.get("/model-typename/:id", getTypeNameById);
router.get("/model-hullmetarialname/:id", getHullMetarialNameById);

module.exports = router;