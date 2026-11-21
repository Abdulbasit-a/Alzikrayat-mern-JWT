// Photo routes - RESTful, resource-oriented endpoints (Lecture 14)

const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate, validateObjectId, schemas } = require('../middleware/validation');

// Public routes
router.get('/', photoController.getAll);
router.get('/stats', photoController.getStats); // must stay above '/:id'
router.get('/:id', validateObjectId(), photoController.getOne);

// Protected routes (logged-in users only)
// Order matters: authenticate -> parse multipart body -> validate fields -> controller
router.post('/', auth, upload.single('photo'), validate(schemas.photo), photoController.create);
router.delete('/:id', validateObjectId(), auth, photoController.remove);

module.exports = router;
