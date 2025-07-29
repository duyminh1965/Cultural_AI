import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin/moderator only)
router.get('/', authenticate, checkPermission('manage_users'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.isActive = status === 'active';
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const users = await User.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Users can only view their own profile unless they have manage_users permission
    if (req.user._id.toString() !== req.params.id && !req.user.role.includes('admin') && !req.user.role.includes('moderator')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (admin only)
router.put('/:id', authenticate, checkPermission('manage_users'), async (req, res) => {
  try {
    const { firstName, lastName, email, role, isActive, preferences } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user statistics (admin/moderator only)
router.get('/stats/overview', authenticate, checkPermission('view_analytics'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'moderator'] } });
    
    // Users active in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await User.countDocuments({ 
      lastLoginAt: { $gte: yesterday },
      isActive: true 
    });

    // New users this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newThisMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      activeToday,
      newThisMonth,
      inactiveUsers: totalUsers - activeUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;