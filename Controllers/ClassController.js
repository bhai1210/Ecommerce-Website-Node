const ClassModel = require('../Models/class');

// ✅ Create Class
const Createclass = async (req, res) => {
  try {
    const { name, subject, students, teacher, image } = req.body; // added image
    const user = new ClassModel({
      name,
      subject,
      teacher,
      students,
      image, // save image URL or path
    });
    await user.save(); // ✅ await to ensure saving
    res.status(200).send({ message: "Class saved successfully" });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

// ✅ Get All Classes
const getalluser = async (req, res) => {
  try {
    const allclass = await ClassModel.find();
    res.status(200).send({
      message: "All class data sent successfully",
      data: allclass,
    });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

// ✅ Get Class by ID
const getuserbyid = async (req, res) => {
  try {
    const finduserbyid = await ClassModel.findById(req.params.id); // ✅ added await
    if (!finduserbyid) {
      return res.status(404).send({ message: "Class not found" });
    }
    res.status(200).send({
      message: "Class found by ID",
      data: finduserbyid,
    });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

// ✅ Update Class
const getclassupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, students, teacher, image } = req.body; // added image
    const userupdated = await ClassModel.findByIdAndUpdate(
      id,
      {
        name,
        subject,
        students,
        teacher,
        image, // update image if provided
      },
      { new: true } // ✅ returns updated doc
    );

    if (!userupdated) {
      return res.status(404).send({ message: "Class not found" });
    }

    return res.status(200).send({
      message: "Data updated successfully",
      updateduser: userupdated,
    });
  } catch (err) {
    res.status(500).send("Internal Server error");
  }
};

// ✅ Delete Class
const deleteuser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteuser = await ClassModel.findByIdAndDelete(id);
    if (!deleteuser) {
      return res.status(404).send({ message: "Class not found" });
    }
    return res.status(200).send("Class deleted successfully");
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getalluser,
  getuserbyid,
  deleteuser,
  getclassupdate,
  Createclass,
};
