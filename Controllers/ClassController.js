const ClassModel = require('../Models/class')


const Createclass = async (req, res)=> {
    try{
          const { name, subject, students,teacher  } = req.body;
          const user = new ClassModel({
            name , subject, teacher , students
          })
          user.save()
          res.status(200).send({message : "class saved succesfully"})
    }
  catch (err){
        return res.status(500).send("internal server error")

    }
}


const getalluser = async (req,res) => {
    try {
            


        const allclass =  await  ClassModel.find()

        res.status(200).send({message :"all  class data send succussfully",
            data: allclass
        })
        }  catch (err){
        return res.status(500).send("internal server error")

    }

}

const getuserbyid = async (req,res)=> {
    try{
const finduserbyid = ClassModel.findById(req.params.id)
res.status(200).send({message :"user by id founded",
    data : finduserbyid
})
    }
    catch (err){
        return res.status(500).send("internal server error")

    }
}

const getclassupdate = async (req,res )=> {
    try{

   const { id } = req.params;
        const { name, subject, students,teacher }  = req.body
        const userupdated = await  ClassModel.findByIdAndUpdate(id,{
            name : name ,
            subject : subject,
            students : students,
            teacher : teacher

        })

        return res.status(200).send({data : "Data updated succusfully",
            updateduser: userupdated
        })

    }
    catch (err){

        res.status(500).send("internal Server error")


    }


}



const  deleteuser = async (req,res) => {
    try{


         const { id } = req.params;
        const deleteuser = await ClassModel.findByIdAndDelete(id)
        return res.status(200).send("class deleted succesfully")

    }
    catch(err){

        return res.status(500).send({message : err.message})

    }
}


module.exports = { getalluser,getuserbyid,deleteuser,getclassupdate,Createclass}