// Photo controller - photo CRUD operations

const fs = require('fs/promises');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const User = require('../models/User');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// GET /api/photos?limit=6 - newest first, with author name
const getAll = async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10);

    let query = Photo.find().populate('userId', 'firstName lastName').sort({ dateTime: -1 });
    if (Number.isInteger(limit) && limit > 0) query = query.limit(Math.min(limit, 100));

    const photos = await query;
    res.json({ success: true, count: photos.length, data: photos });
  } catch (error) {
    next(error);
  }
};

// GET /api/photos/:id
const getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) {
      return res.status(404).json({ success: false, message: 'الذكرى غير موجودة.' });
    }
    res.json({ success: true, data: photo });
  } catch (error) {
    next(error);
  }
};

// POST /api/photos (multipart/form-data: photo, title, description) - logged-in users only
const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'يرجى اختيار صورة.' });
    }

    const { title, description } = req.body;
    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title,
      description: description || undefined,
    });

    const populated = await Photo.findById(photo._id).populate('userId', 'firstName lastName');
    res.status(201).json({ success: true, message: 'تم نشر الذكرى بنجاح.', data: populated });
  } catch (error) {
    // Do not leave an orphaned file on disk if the database write failed
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    next(error);
  }
};

// DELETE /api/photos/:id - owner only (checked server-side)
const remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'الذكرى غير موجودة.' });
    }

    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'لا يمكنك حذف ذكرى لا تخصك.' });
    }

    await photo.deleteOne();
    await Comment.deleteMany({ photoId: photo._id });
    await fs.unlink(path.join(UPLOADS_DIR, photo.fileName)).catch(() => {}); // file may already be gone

    res.json({ success: true, message: 'تم حذف الذكرى.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/photos/stats - counters for the home page
const getStats = async (req, res, next) => {
  try {
    const [users, photos, comments] = await Promise.all([
      User.countDocuments(),
      Photo.countDocuments(),
      Comment.countDocuments(),
    ]);
    res.json({ success: true, data: { users, photos, comments } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, remove, getStats };
