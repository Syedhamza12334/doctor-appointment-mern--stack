const DoctorModels = require("../Models/DoctorModels");
const userModel = require("../Models/UserModels");

const getAllUserCtrl = async (req,res)=>{

    try {
        const users=await userModel.find({});
        res.status(200).send({
            success: true,
            message:"users data list ",
            data:users,

        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while fetching users",
            error
        })
        
    }

}

const getAllDoctorsCtrl =async(req,res)=>{

    try {
        const doctors=await DoctorModels.find({});
        res.status(200).send({
            success: true,
            message:"doctor data list",
            data:doctors,

        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while fetching doctors",
            error,
        })
        
    }

    
};

//doctor account status
const changeAccountCtrl = async(req,res) =>{
    try {
        const {doctorId,status} =req.body
        const doctor= await DoctorModels.findByIdAndUpdate(doctorId,{status});
        const user= await userModel.findOne({_id:doctor.userId})
        const notification= user.notification
        notification.push({
            type:'doctor-account-request-updated',
            message:`Your Doctor Account Request has ${status}`,
            onClickPath:"/notification",
        });

        user.isDoctor = status === "approved" ? true : false;
        await user.save();
        res.status(201).send({
            success:true,
            message:"Account status Updated",
            data:doctor,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in Account Status",
            error
        })
        
    }

} 

module.exports={getAllDoctorsCtrl,getAllUserCtrl,changeAccountCtrl}