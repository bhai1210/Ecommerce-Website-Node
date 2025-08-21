const extramodel =  require('../Models/extra')


const createuser = async (req,res) => {
    try{


        const { first, second, third,forth,five } =  req.body

        const response = await extramodel.create(req.body)

        response.save()

        res.status(200).send("your data saved successfully")




    }catch(err){

        res.status(500).send("can't save user internal server error")

     

    }
}



const getalluser = async (req,res) => {
    try{


     const getalluser = await extramodel.find()

     res.status(200).send({data:getalluser,"message":"all data send succesfully"})

    }catch(err){
        res.status(500).send({"errr": err.message})
    }
}



const getuserbyid = async (req,res) => {



    try{


          const respone =  await  extramodel.findById(req.params.id)

          if(!respone){
            res.status(400).send("Id Not Found")
          }
          res.status(200).send({data: respone,"message":"user easily get by id"})
    }catch(err){
               res.status(500).send({"errr": err.message})
    }
}




const updateuser = async (req,res) => {


    try{


        const updateddata = await extramodel.findByIdAndUpdate(req.params.id,req.body,  { new: true })

 


          if (!updateddata) return res.status(404).json({ message: "Item not found" });
    res.json(updateddata);

          return res.status(200).json({
      updateddata,
      message: "User updated successfully"
    });

    }catch(err){
               res.status(500).send({"errr": err.message})
    }
}





const deleteuser = async (req,res) => {
    try{

        const id = req.params.id

    
        const deletedata = await extramodel.findByIdAndDelete(id);
        if(!deletedata){
            res.status(404).send("don't find the particualr id")
        }
        res.status(200).send({data:deletedata,
            "message":"user deleted succesfully"
        })

    }catch(err){
               res.status(500).send({"errr": err.message})
    }
}



module.exports = {createuser ,getalluser,getuserbyid,updateuser,deleteuser}