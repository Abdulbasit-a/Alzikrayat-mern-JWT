// Comment controller - comments belong to a photo (/api/photos/:id/comments)

const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

// GET /api/photos/:id/comments - oldest first
const getAll = async (req, res, next) => {
  try {
    const photoExists = await Photo.exists({ _id: req.params.id });
    if (!photoExists) {
      return res.status(404).json({ success: false, message: 'الذكرى غير موجودة.' });
    }

    const comments = await Comment.find({ photoId: req.params.id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 });

    res.json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    next(error);
  }
};

// POST /api/photos/:id/comments - any logged-in user
const create = async (req, res, next) => {
  try {
    const photoExists = await Photo.exists({ _id: req.params.id });
    if (!photoExists) {
      return res.status(404).json({ success: false, message: 'الذكرى غير موجودة.' });
    }

    const newComment = await Comment.create({
      photoId: req.params.id,
      userId: req.user._id,
      comment: req.body.comment,
    });

    const populated = await Comment.findById(newComment._id).populate('userId', 'firstName lastName');
    res.status(201).json({ success: true, message: 'تمت إضافة التعليق.', data: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/photos/:id/comments/:commentId - only the comment's author (checked server-side)
const remove = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, photoId: req.params.id });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'التعليق غير موجود.' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'لا يمكنك حذف تعليق لا يخصك.' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'تم حذف التعليق.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, remove };
