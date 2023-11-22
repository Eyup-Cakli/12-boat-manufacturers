const Router = require("express");
const {
    createBoatHullMetarial_post,
    updateBoatHullMetarial_put,
    deleteBoatHullMetarial_delete,
    getAllBoatHull_metarials_get,
    getBoatHullMetarialById_get
} = require("../controllers/boatHullMetarialController.js");

const router = Router();

router.post("/hullmetarial", createBoatHullMetarial_post);
router.put("/hullmetarial/:id", updateBoatHullMetarial_put);
router.delete("/hullmetarial/:id", deleteBoatHullMetarial_delete);
router.get("/hullmetarial", getAllBoatHull_metarials_get);
router.get("/hullmetarial/:id", getBoatHullMetarialById_get);

module.exports = router;