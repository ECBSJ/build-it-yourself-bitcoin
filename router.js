const express = require("express")
const router = express.Router()
const controller = require("./controller/controller")

router.get("/", controller.mainPage)

router.get("/home", controller.home)

router.post("/retrieveData", controller.retrieveData)

router.get("/retrieveUTXO", controller.retrieveUTXO)

router.post("/enterRecipientAdd", controller.enterRecipientAdd)

router.post("/buildScriptPubKey", controller.buildScriptPubKey)

router.get("/createSPK", controller.finalScriptPubKey)

router.post("/enterWIF", controller.enterWIF)

router.post("/createScriptSig", controller.createScriptSig)

router.post("/transmitTX", controller.transmitTX)

router.post("/broadcastTX", controller.broadcastTX)

module.exports = router
