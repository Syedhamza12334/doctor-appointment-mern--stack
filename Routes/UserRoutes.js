const express = require("express")
const { LoginController, RegisterController, authCtrl,authDocCtrl,authNotiFicationCtrl,deleteauthNotiFicationCtrl, getAllDoctorCtrl, BookAppointmentsCtrl, useAppointmentController } = require("../Controllers/UserCtrl");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

//routes object 
const router =express.Router()

//routes
//login ||  post 

router.post("/login",LoginController);

//Register ||post
router.post("/register",RegisterController);

//auth ||post
router.post("/GetUserData",AuthMiddleware,authCtrl);

//apply-doctor ||post
router.post("/apply-doctor",AuthMiddleware,authDocCtrl);
//get all notification
router.post("/get-all-notification",AuthMiddleware,authNotiFicationCtrl);

//get deleete notification
router.post("/delete-all-notification",AuthMiddleware,deleteauthNotiFicationCtrl);


//get all doctor

router.get("/getAlldoctors", AuthMiddleware,getAllDoctorCtrl)

//book appointmrnt

router.post("/book-appointment",AuthMiddleware,BookAppointmentsCtrl)


router.get("/user-appointments",AuthMiddleware,useAppointmentController)

module.exports=router;


