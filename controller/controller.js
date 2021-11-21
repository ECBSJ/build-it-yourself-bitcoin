const TXObject = require("../models/TX_Data")

let newTXObject = {}

exports.mainPage = function (req, res) {
  res.render("mainPage")
}

exports.home = function (req, res) {
  res.render("home")
}

exports.retrieveData = async function (req, res) {
  newTXObject = new TXObject(req.body)

  let fetchedData = await newTXObject.grabAPIData()
  let submittedpubAdd = newTXObject.sendingAdd
  let finalBalance = fetchedData[newTXObject.sendingAdd]["final_balance"]
  let numOfTXs = fetchedData[newTXObject.sendingAdd]["n_tx"]
  let totalReceived = fetchedData[newTXObject.sendingAdd]["total_received"]
  res.render("PubAddData", { submittedpubAdd: submittedpubAdd, finalBalance: finalBalance, numOfTXs: numOfTXs, totalReceived: totalReceived })
}

exports.retrieveUTXO = async function (req, res) {
  let fetchedUTXO = await newTXObject.grabUTXO()
  let UTXOS = await fetchedUTXO["unspent_outputs"]

  res.render("retrieveUTXO", { UTXOS: UTXOS })
}

exports.enterRecipientAdd = async function (req, res) {
  newTXObject.inputTXID = req.body.TXID
  newTXObject.inputOutputN = req.body.output
  newTXObject.inputValue = req.body.Value

  res.render("enterRecipientAdd", { inputTXID: newTXObject.inputTXID, outputN: newTXObject.inputOutputN, inputValue: newTXObject.inputValue })
}

exports.buildScriptPubKey = async function (req, res) {
  newTXObject.outputAdd = req.body.RecipientAdd2Hash160
  newTXObject.outputAddhash160 = newTXObject.hash160()

  res.render("buildScriptPubKey", { inputTXID: newTXObject.inputTXID, outputN: newTXObject.inputOutputN, inputValue: newTXObject.inputValue, hash160: newTXObject.outputAddhash160, RecAdd: newTXObject.outputAdd })
}

exports.finalScriptPubKey = function (req, res) {
  newTXObject.ScriptPubKey = newTXObject.createSPK()
  res.json(newTXObject.ScriptPubKey)
}

exports.enterWIF = function (req, res) {
  newTXObject.outputAmount = req.body.Amount
  res.render("enterWIF", { inputTXID: newTXObject.inputTXID, outputN: newTXObject.inputOutputN, inputValue: newTXObject.inputValue, RecAdd: newTXObject.outputAdd, Amount: newTXObject.outputAmount, ScriptPubKey: newTXObject.ScriptPubKey })
}

exports.createScriptSig = function (req, res) {
  newTXObject.PrivateKey = req.body.PrivateKey
  newTXObject.createTXHash()

  res.render("createScriptSig", { inputTXID: newTXObject.inputTXID, outputN: newTXObject.inputOutputN, inputValue: newTXObject.inputValue, RecAdd: newTXObject.outputAdd, Amount: newTXObject.outputAmount, ScriptPubKey: newTXObject.ScriptPubKey, presignedTXHash: newTXObject.txPreSigned })
}

exports.transmitTX = function (req, res) {
  res.render("transmitTX", { inputTXID: newTXObject.inputTXID, outputN: newTXObject.inputOutputN, inputValue: newTXObject.inputValue, RecAdd: newTXObject.outputAdd, Amount: newTXObject.outputAmount, ScriptPubKey: newTXObject.ScriptPubKey, presignedTXHash: newTXObject.txPreSigned, Signature: newTXObject.Signature, PublicKey: newTXObject.senderPubKey, TXHex: newTXObject.transactionHex })
}

exports.broadcastTX = async function (req, res) {
  await newTXObject.broadcastTX()
  res.render("broadcastTX", { transactionHex: newTXObject.transactionHex, transactionHash: newTXObject.transactionHash })
}
