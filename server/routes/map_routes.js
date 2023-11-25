const express = require("express")
const router = express.Router()
const { saveUserMap, getMap, queryMaps, changeLikesMap, getUserMaps } = require("../controllers/map_controllers")
const { verifyToken } = require("../jwt_middleware")
router.put("/save", verifyToken, saveUserMap)
router.get("/getMap", getMap)
router.get("/queryMaps", queryMaps)
router.put("/changeLikesMap", changeLikesMap)
router.post("/getUserMaps", getUserMaps)
module.exports = router