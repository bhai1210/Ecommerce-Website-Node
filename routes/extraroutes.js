const express = require('express')
const router = express.Router()
const extraController = require('../Controllers/extracontroller')

// CRUD routes
router.get('/', extraController.getalluser)
router.get('/:id', extraController.getuserbyid)
router.post('/', extraController.createuser)
router.put('/:id', extraController.updateuser)
router.delete('/:id', extraController.deleteuser)

module.exports = router
