const DoctorModels = require("../Models/DoctorModels");
const AppointmentModels = require("../Models/AppointmentModels");
const userModel = require("../Models/UserModels");

const getDoctorController =async(req,res)=>{

    try {
        const doctor = await DoctorModels.findOne({userId: req.body.userId});
        res.status(200).send({
            success:true,
            message:"doctor data fetch success",
            data: doctor,
        })
        
    } catch (error) {
        console.log(error);
            res.status(500).send({
                success: false,
                error,
                message:"doctor data fetch success ",        

            })
        }
        
    }



//update doctor file
const updateProfileCtrl =async(req,res) =>{
try {
    const doctor = await DoctorModels.findOneAndUpdate(
        {userId: req.body.userId},
        req.body
    );

    res.status(201).send({
        success:true,
        message:"doctor profile updated",
        data:doctor,
    })
    
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"doctor profile updated issue",
        error,
    })
    

    
}
   
};

const getDoctorIdCtrl =async(req,res)=>{
    try {
        const doctor=await DoctorModels.findOne({ _id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:"single doctor info fetched",
            data:doctor,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in single doctor info"
        })
        
    }

}

const DoctorAppointmentCtrl =async(req,res)=>{
    try {

        const doctor=await DoctorModels.findOne({userId: req.body.userId});
const appointments= await  AppointmentModels.find({
    doctorId: doctor._id,
});
res.status(200).send({
    success:true,
    message:"doctor appointments fetch successfully",
    data: appointments,
})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error in doc apponitments"
        })
        
    }

}

const UpdateStatusCtrl=async(req,res)=>{
    try {
        const {appointmentsId,status} = req.body
        const appointments = await AppointmentModels.findByIdAndUpdate(appointmentsId,{status})
        const user = await userModel.findOne({_id: appointments.userId});
        const notification=user.notification;
        notification.push({
            type:"status-updated",
            message:`your appointments has been updated ${status}`,
            onclickPath:"/doctor-appointments",
        });

        await user.save();

        res.status(200).send({
            success:true,
            message:"appointment status updated",
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error in update status"
        })
        
    }

}

module.exports={getDoctorController,updateProfileCtrl,getDoctorIdCtrl,DoctorAppointmentCtrl,UpdateStatusCtrl};