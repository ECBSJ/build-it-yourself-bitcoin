const express = require("express")
const session = require("express-session")
const csrf = require("csurf")
const ourApp = express()

let sessionOptions = session({
  secret: "Build your own fuckin bitcoin transaction",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 30, httpOnly: true }
})

ourApp.use(sessionOptions)

const dotenv = require("dotenv")
dotenv.config()

const router = require("./router")

ourApp.use(express.static("public"))
ourApp.use("/css", express.static(__dirname + "public/css"))
ourApp.use("/img", express.static(__dirname + "public/img"))
ourApp.set("views", "views")
ourApp.set("view engine", "ejs")

ourApp.use(express.json())
ourApp.use(express.urlencoded({ extended: false }))

ourApp.use(csrf())

ourApp.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

ourApp.use("/", router)

ourApp.use(function (err, req, res, next) {
  if (err) {
    if (err.code == "EBADCSRFTOKEN") {
      res.send("Cross site request forgery detected")
    } else {
      res.send("ERROR")
    }
  }
})

ourApp.listen(process.env.PORT)
