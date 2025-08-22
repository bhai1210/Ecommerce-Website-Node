const studentinfomodel = require('../Models/studentinfomodel')
const studentinfo = require('../Models/studentinfomodel')

const createStudent = async (req,res)=> {
    try{

const createStudent = await studentinfo.create(req.body)
console.log(createStudent,"my post data")
createStudent.save()

res.status(200).send({data: createStudent,message:"student created succesfully"})

    }catch(err){

        res.status(500).send({message: err.message})



    }
}


const getallstudent = async (req,res)=> {
    try{

        const allstudent = await studentinfo.find({})

        res.status(200).send({data:allstudent,message:"alll student data send succesfully"})

    }catch(err){
           res.status(500).send({message: err.message})
    }
}


const getstudentbyid = async (req,res)=> {
    try{

        const studentbyid = await studentinfo.findById(req.params.id)
        if(!studentbyid) return res.status(400).send("user not found")

            res.status(200).send({data:studentbyid,"message":"student find succesfully"})



    }catch(err){
           res.status(500).send({message: err.message})
    }
}


const updatestudent = async (req,res)=> {
    try{


    const updatestudents = await studentinfo.findByIdAndUpdate(req.params.id,req.body,{new: true})
    if(!updatestudents){
        res.status(404).send("student not found that id")
    }

    res.status(200).send({data:updatestudent,"message":"student updated succesfully"})

    }catch(err){
          res.status(500).send({message: err.message}) 
    }
}

const deletestudent = async (req,res)=> {

    
    try{

        const deletestudent = await studentinfo.findByIdAndDelete(req.params.id)

        if(!deletestudent){
            res.status(404).send("student don't found with this id")
        }

        res.status(200).send("student deleted succesfully")
    }catch(err){
           res.status(500).send({message: err.message})
    }
}



module.exports = {createStudent,getstudentbyid,getallstudent,updatestudent,deletestudent}