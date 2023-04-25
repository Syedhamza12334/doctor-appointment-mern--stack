const express= require('express')
const { getAllUserCtrl, getAllDoctorsCtrl,changeAccountCtrl } = require("../Controllers/AdminCtrl");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();

//get method || user

router.get('/getAllusers',AuthMiddleware,getAllUserCtrl)


//get method || doctor

router.get('/getAlldoctors',AuthMiddleware,getAllDoctorsCtrl)

//post method || status

router.post('/changeAccountStatus',AuthMiddleware,changeAccountCtrl)

module.exports = router;