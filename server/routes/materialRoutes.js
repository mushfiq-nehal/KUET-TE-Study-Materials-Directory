const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', materialController.getMaterials);
router.post('/', authMiddleware, adminMiddleware, materialController.addMaterial);
router.put('/:id', authMiddleware, adminMiddleware, materialController.updateMaterial);
router.delete('/:id', authMiddleware, adminMiddleware, materialController.deleteMaterial);

module.exports = router;
