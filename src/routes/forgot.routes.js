const { FORGOT,UPDATE } = require('../global/_var.js')

/******** DEPENDENCY  *******/

const express = require('express');
const route = express.Router()

/******** CONTROLLER *******/

const getInfoController = require('../controller/getInfoController.js')
const saveInfoController = require('../controller/saveinfo.Controller.js')

/******** ROUTER *********/

route.post(FORGOT, getInfoController.Recuperacion)
route.post(UPDATE,saveInfoController.editPassword)


module.exports= route