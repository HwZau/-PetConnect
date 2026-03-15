const express = require('express');
const Post = require('../models/Post');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ isActive: true })
      .populate('authorId', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({ isActive: true });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/posts', auth, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      authorId: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatarUrl
    });

    await post.save();
    await post.populate('authorId', 'name email avatarUrl');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post by ID
router.get('/posts/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name email avatarUrl')
      .populate('comments.authorId', 'name avatarUrl');

    if (!post || !post.isActive) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('authorId', 'name email avatarUrl');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes -= 1;
    } else {
      // Like
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to post
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      authorId: req.user._id,
      authorName: req.user.name,
      authorAvatar: req.user.avatarUrl,
      content,
      createdAt: new Date(),
      likes: 0
    };

    post.comments.push(comment);
    post.commentsCount += 1;

    await post.save();
    await post.populate('comments.authorId', 'name avatarUrl');

    res.status(201).json({ comment: post.comments[post.comments.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trending posts
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const posts = await Post.find({ isActive: true })
      .populate('authorId', 'name email avatarUrl')
      .sort({ likes: -1, commentsCount: -1, createdAt: -1 })
      .limit(10);

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;