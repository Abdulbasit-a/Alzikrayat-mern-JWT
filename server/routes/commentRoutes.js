// Comment routes - nested under a photo: /api/photos/:id/comments

const express = require('express');
const router = express.Router({ mergeParams: true }); // gives access to :id from the parent path
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const { validate, validateObjectId, schemas } = require('../middleware/validation');

router.get('/', validateObjectId(), commentController.getAll);
router.post('/', validateObjectId(), auth, validate(schemas.comment), commentController.create);
router.delete('/:commentId', validateObjectId('id', 'commentId'), auth, commentController.remove);

module.exports = router;
