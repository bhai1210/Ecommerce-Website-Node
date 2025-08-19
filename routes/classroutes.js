const express = require('express')
const router= express.Router()

const clascontroller = require('../Controllers/ClassController')


router.get('/',clascontroller.getalluser)
router.get("/:id",clascontroller.getuserbyid)
router.post('/',clascontroller.Createclass)
router.put('/:id',clascontroller.getclassupdate)
router.delete('/:id',clascontroller.deleteuser)


module.exports = router;
