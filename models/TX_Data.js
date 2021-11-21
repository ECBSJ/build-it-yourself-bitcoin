const fetch = require("node-fetch")
let { bech32, bech32m } = require("bech32")
const bitcoin = require("bitcoinjs-lib")
const bs58 = require("bs58")
let MAINNET = bitcoin.networks.bitcoin

function concatTypedArrays(a, b) {
  // a, b TypedArray of same type
  var c = new a.constructor(a.length + b.length)
  c.set(a, 0)
  c.set(b, a.length)
  return c
}

const isP2WPKH = address => address.startsWith("bc1") && address.length === 42
const isP2PKH = address => address.startsWith("1") && address.length == 34

let txb = new bitcoin.TransactionBuilder(MAINNET)
var transactionhex = ""

let TXObject = function (data) {
  this.sendingAdd = data.publicAddress
  this.inputTXID = null
  this.inputOutputN = null
  this.inputValue = null
  this.PrivateKey = null
  this.ScriptSig = null
  this.outputAdd = null
  this.outputAddhash160 = null
  this.outputAmount = null
  this.ScriptPubKey = null
  this.fee = null
  this.transactionScript = null
  this.transactionHex = null
  this.txPreSigned = null
  this.Signature = null
  this.senderPubKey = null
  this.transactionHash = null
  this.errors = []
}

TXObject.prototype.grabAPIData = async function () {
  const url = "https://blockchain.info/balance?active="

  pubAdd = this.sendingAdd

  const response = await fetch(url + pubAdd, {
    method: "GET"
  })

  const data = await response.json()

  return data
}

TXObject.prototype.grabUTXO = async function () {
  const url = "https://blockchain.info/unspent?active="

  pubAdd = this.sendingAdd

  const response = await fetch(url + pubAdd, {
    method: "GET"
  })

  const data = await response.json()

  return data
}

TXObject.prototype.hash160 = function () {
  if (isP2WPKH(this.outputAdd)) {
    const decodeAddress = bitcoin.address.fromBech32(this.outputAdd)
    const legAdd = bitcoin.address.toBase58Check(decodeAddress.data, 0x00)
    const bytes = bs58.decode(legAdd)
    const hash160 = bytes.slice(1, 21)
    return hash160.toString("hex")
  } else {
    const bytes = bs58.decode(this.outputAdd)
    const hash160 = bytes.slice(1, 21)
    return hash160.toString("hex")
  }
}

TXObject.prototype.createSPK = function () {
  var rawSPK = bitcoin.address.toOutputScript(this.outputAdd, MAINNET).toString("hex")
  return rawSPK
}

TXObject.prototype.createTXHash = function () {
  let PrivateKey = this.PrivateKey
  let keypairSpend = bitcoin.ECPair.fromWIF(PrivateKey, MAINNET)

  if (isP2WPKH(this.sendingAdd)) {
    const hash = bitcoin.crypto.hash160(keypairSpend.publicKey)
    const prefix = new Uint8Array(2)
    prefix[0] = 0
    prefix[1] = hash.length
    const scriptPubKey = concatTypedArrays(prefix, hash)
    txb.addInput(this.inputTXID, +this.inputOutputN, undefined, Buffer.from(scriptPubKey, "Hex"))
  } else {
    txb.addInput(this.inputTXID, +this.inputOutputN)
  }

  txb.addOutput(this.outputAdd, +this.outputAmount)
  txb.sign(0, keypairSpend, null, null, +this.inputValue)

  let tx = txb.build()
  this.transactionScript = tx
  this.transactionHex = this.transactionScript.toHex()

  if (isP2WPKH(this.sendingAdd)) {
    this.Signature = tx["ins"][0]["witness"][0].toString("hex")
    this.senderPubKey = tx["ins"][0]["witness"][1].toString("hex")
    SPK = bitcoin.address.toOutputScript(this.sendingAdd, MAINNET)
    tx["ins"][0]["script"] = SPK
    tx["ins"][0]["witness"] = []
    this.txPreSigned = tx.toHex()
  } else {
    this.Signature = tx["ins"][0]["script"].slice(0, 73).toString("hex")
    this.senderPubKey = tx["ins"][0]["script"].slice(74, 107).toString("hex")
    SPK = bitcoin.address.toOutputScript(this.sendingAdd, MAINNET)
    tx["ins"][0]["script"] = SPK
    this.txPreSigned = tx.toHex()
  }

  this.PrivateKey = null
}

TXObject.prototype.broadcastTX = async function () {
  var myHeaders = new fetch.Headers()
  myHeaders.append("Content-Type", "text/plain")

  const response = await fetch("https://mempool.space/api/tx", {
    method: "POST",
    headers: myHeaders,
    body: this.transactionHex,
    redirect: "follow"
  })
    .then(response => response.text())
    .then(result => (this.transactionHash = result))
    .catch(error => console.log("error", error))
}

module.exports = TXObject
