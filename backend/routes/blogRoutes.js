// backend/routes/blogRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');

const router = express.Router();

/**
 * GET /api/blogs
 * Get all blogs for the logged-in user
 */
router.get('/', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('user', ['name', '_id']);

    return res.json(blogs);
  } catch (err) {
    console.error('Fetch blogs error:', err.message);
    return res
      .status(500)
      .json({ msg: 'Server Error: Failed to fetch blogs.' });
  }
});

/**
 * GET /api/blogs/:id
 * Get single blog by id
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', [
      'name',
      '_id',
    ]);

    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found.' });
    }

    return res.json(blog);
  } catch (err) {
    console.error('Get blog error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found.' });
    }
    return res
      .status(500)
      .json({ msg: 'Server Error: Failed to fetch blog.' });
  }
});

/**
 * POST /api/blogs
 * Create a new blog
 */
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { title, content } = req.body;

    try {
      const blog = new Blog({
        user: req.user.id,
        title: title.trim(),
        content: content.trim(),
      });

      await blog.save();
      return res.json(blog);
    } catch (err) {
      console.error('Create blog error:', err.message);
      return res
        .status(500)
        .json({ msg: 'Server Error: Failed to create blog.' });
    }
  }
);

/**
 * PUT /api/blogs/:id
 * Update blog
 */
router.put('/:id', auth, async (req, res) => {
  const { title, content } = req.body;
  const blogFields = {};
  if (title) blogFields.title = title;
  if (content) blogFields.content = content;

  try {
    let blog = await Blog.findOne({ _id: req.params.id, user: req.user.id });
    if (!blog) {
      return res.status(403).json({
        msg: 'Permission Denied: You are not authorized to edit this post.',
      });
    }

    blog = await Blog.findOneAndUpdate(
      { _id: req.params.id },
      { $set: blogFields },
      { new: true }
    ).populate('user', ['name', '_id']);

    return res.json(blog);
  } catch (err) {
    console.error('Update error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found.' });
    }
    return res
      .status(500)
      .send('Server Error: Failed to update blog.');
  }
});

/**
 * DELETE /api/blogs/:id
 * Delete blog
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!blog) {
      return res.status(403).json({
        msg: 'Permission Denied: You are not authorized to delete this post.',
      });
    }

    await blog.deleteOne();
    return res.json({ msg: 'Blog removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found.' });
    }
    return res
      .status(500)
      .send('Server Error: Failed to process deletion.');
  }
});

module.exports = router;
