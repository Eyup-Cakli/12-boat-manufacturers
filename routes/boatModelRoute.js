const Router = require("express");
const {
    createModel_post,
    updateModel_put,
    deleteModel_delete,
    getAllModels_get,
    getModelByModelCode_get,
    getModelsByManufacturerCode_get,
    getManufacturerNameById,
    getTypeNameById,
    getHullMetarialNameById
} = require("../controllers/boatModelController.js");

const router = Router();

router.post("/model/add", createModel_post);
router.put("/model/update/:id", updateModel_put);
router.delete("/model/delete/:id", deleteModel_delete);
router.get("/model/getall", getAllModels_get);
router.get("/model/getone/:id",getModelByModelCode_get);
router.get("/model/getonemanufacturer/:id", getModelsByManufacturerCode_get);
router.get("/model/getmanufacturername/:id", getManufacturerNameById);
router.get("/model/gettypename/:id", getTypeNameById);
router.get("/model/gethullmetarialname/:id", getHullMetarialNameById);

module.exports = router;