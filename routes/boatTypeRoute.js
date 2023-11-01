const Router = require("express");
const {
    createType_post,
    updateType_put,
    deleteType_delete,
    getAllTypes_get,
    getTypeByTypeCode_get
} = require("../controllers/boatTypeController.js");

const router = Router();

router.post("/type/add", createType_post);
router.put("/type/update/:id", updateType_put);
router.delete("/type/delete/:id",deleteType_delete);

router.get("/type/getall", getAllTypes_get);
router.get("/type/getone/:id", getTypeByTypeCode_get);

module.exports = router;