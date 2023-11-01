const Router = require("express");
const {
    createBoatHullMetarial_post,
    updateBoatHullMetarial_put,
    deleteBoatHullMetarial_delete,
    getAllBoatHull_metarials_get,
    getBoatHullMetarialById_get
} = require("../controllers/boatHullMetarialController.js");

const router = Router();

router.post("/hullmetarial/add", createBoatHullMetarial_post);
router.put("/hullmetarial/update/:id", updateBoatHullMetarial_put);
router.delete("/hullmetarial/delete/:id", deleteBoatHullMetarial_delete);
router.get("/getallhullmetarials", getAllBoatHull_metarials_get);
router.get("/hullmetarialgetbyid/:id", getBoatHullMetarialById_get);

module.exports = router;