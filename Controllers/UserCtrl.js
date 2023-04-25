const userModel = require("../Models/UserModels")
const bcrypt =require('bcryptjs')
const jwt = require("jsonwebtoken")
const DoctorModels = require("../Models/DoctorModels")
const AppointmentModels = require("../Models/AppointmentModels")
const moment = require("moment");


const RegisterController =async (req,res) =>{
    try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res
            .status(200)
            .send({message:'User already Exist',success:false})
        } 
        const password=req.body.password

        const salt = await bcrypt.genSalt(10)

        const hashedPassword= await bcrypt.hash(password,salt)
        req.body.password=hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save();
        res.status(201).send({message:"Register successfully", success:true})


    } catch(error) {
        console.log(error)
        res.status(500).send({success:false,message:`Register Controller ${error.message}`})
    }


};

const LoginController =async(req,res) =>{

    try{
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:'User not found',success:false})
        } 

       const isMatch= await bcrypt.compare(req.body.password,user.password)
       if(!isMatch){
        res.status(200).send({message:"invalid email or password", success:false})
       }
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
       res.status(200).send({message:"Login succesfully", success:true,token});

    } catch(error) {
        console.log(error)
        res.status(500).send({message:`Error in login CTRL ${error.message}`})
    }

}

const authCtrl =async (req,res) =>{

    try {
        const user = await userModel.findById({_id:req.body.userId})
        user.password= undefined ;
        if(!user){
            return res.status(200).send({message:'User not found',success:false})
        } 
        else{
            res.status(200).send({
                success:true,
                data:user
            });

        }
    
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
        message:'Auth Error',
        success:false,
        error,
    })
        
    }
};

//aply doctor ctrl
const authDocCtrl =async (req,res) =>{
    try {
        const newDoctor = await DoctorModels({...req.body,status:'pending'})
        await newDoctor.save()
        const adminUser = await userModel.findOne({isAdmin:true})
        const notification=adminUser.notification
        notification.push({
            type:'apply-doctor-request',
            message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data:{
                doctorId:newDoctor._id,
                name:newDoctor.firstName + " " + newDoctor.lastName,
                onclickPath:'/admin/doctors'
            }
        });
        await userModel.findByIdAndUpdate(adminUser._id,{notification});
        res.status(201).send({
            success:true,
            message:'Doctor Account Applied Successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while applying for doctor'
        })
        
    }

};

//notification ctrl

const authNotiFicationCtrl=async(req,res) =>{
    try {
        const user= await userModel.findOne({_id:req.body.userId})
        const seennotification=user.seennotification
        const notification=user.notification
        seennotification.push(...notification)
        user.notification=[];
        user.seennotification=notification;
        const updatedUser=await user.save();
        res.status(200).send({
            success:true,
            message:'all Notifoication marked as read',
            data:updatedUser,
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error in notification',
            success:false,
            error,
           
        })
        
    }

};

const deleteauthNotiFicationCtrl =async(req,res)=>{
    try {
        const user= await userModel.findOne({_id:req.body.userId})
        user.notification=[];

        user.seennotification=[];
        const updatedUser=await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success:true,
            message:' Notifoication deleted successfully',
            data:updatedUser,
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'unable to delete all  notification',
            success:false,
            error,
           
        })
        
    }



};

//get all doctors

const getAllDoctorCtrl = async (req,res) => {

    try {
        const doctors= await DoctorModels.find({ status: "approved" });
        res.status(200).send({
        success:true,
        message:'doctor list fetch successfully',
        data:doctors,

        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
        success:false,
        error,
        message:'error while fetching doctor',
        });
        
    }
};

//book appointment
const BookAppointmentsCtrl=async(req,res)=>{
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status="pending";
        const newAppoointment = new AppointmentModels(req.body);
        await newAppoointment.save();
        const user = await userModel.findOne({_id: req.body.doctorInfo.userId});
        user.notification.push({
            type:'new appointment request',
            message:`new-Appointment request from ${req.body.userInfo.name}`,
            onclickPath:"/user/appointments",
        });

        await user.save();
        res.status(200).send({
            success:true,
            message:"Appointment book Successfully",
        });

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error While Booking Appointment"
        })
        
    }

}

const useAppointmentController=async(req,res)=>{
    try {
        const appointmemts= await AppointmentModels.find({
            userId: req.body.userId,

        });
        res.status(200).send({
            success:true,
            message:"user Appoints fetch successfully",
            data: appointmemts
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error in user appointment"
        });
        
    }

}


module.exports={LoginController,RegisterController,authCtrl,authDocCtrl,authNotiFicationCtrl,deleteauthNotiFicationCtrl,getAllDoctorCtrl,BookAppointmentsCtrl
,useAppointmentController

}