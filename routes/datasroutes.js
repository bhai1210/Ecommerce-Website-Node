const datascontroller = require('../Controllers/datasController')
const express = require('express')
const router = express.Router()

router.get('/',datascontroller.getalldatas)
router.get('/:id',datascontroller.getdatasbyid)
router.post('/',datascontroller.createdatas)
router.put('/:id',datascontroller.updatedatas)
router.delete('/:id',datascontroller.deletedatas)

module.exports= router