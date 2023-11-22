const Router = require("express");
const {
    createType_post,
    updateType_put,
    deleteType_delete,
    getAllTypes_get,
    getTypeById_get
} = require("../controllers/boatTypeController.js");

const router = Router();

router.post("/type", createType_post);
router.put("/type/:id", updateType_put);
router.delete("/type/:id",deleteType_delete);

router.get("/type/", getAllTypes_get);
router.get("/type/:id", getTypeById_get);

module.exports = router;