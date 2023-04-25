const express = require('express')
const AuthMiddleware =require("../Middlewares/AuthMiddleware")
const { getDoctorController, updateProfileCtrl, getDoctorIdCtrl, DoctorAppointmentCtrl, UpdateStatusCtrl } = require('../Controllers/DoctorCtrl')

const router= express.Router()

//get signle doctor list

router.post('/getDoctorInfo',AuthMiddleware,getDoctorController)

//post update result

router.post('/updateProfile',AuthMiddleware,updateProfileCtrl)

// post get single doctor id
router.post('/getDoctorId',AuthMiddleware,getDoctorIdCtrl)

//get Appointments

router.get('/doctor-appointments',AuthMiddleware,DoctorAppointmentCtrl)

// update status
router.post('/update-status',AuthMiddleware,UpdateStatusCtrl)

module.exports=router