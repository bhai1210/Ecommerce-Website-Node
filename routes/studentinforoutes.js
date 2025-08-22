const express= require('express')

const router = express.Router()

const studentinfocontroller = require('../Controllers/studentinfocontroller')


router.get('/',studentinfocontroller.getallstudent);
router.get('/:id',studentinfocontroller.getstudentbyid);
router.post('/',studentinfocontroller.createStudent);
router.put('/:id',studentinfocontroller.updatestudent);
router.delete('/:id',studentinfocontroller.deletestudent)

module.exports= router
