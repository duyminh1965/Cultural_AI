import express from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import User from '../models/User.js';
import { authenticate, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Track analytics event
router.post('/track', async (req, res) => {
  try {
    const { type, action, data, sessionId } = req.body;
    
    // Get user ID from token if available
    let userId = null;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Token invalid or expired, continue without user ID
      }
    }

    const event = new AnalyticsEvent({
      type,
      action,
      data,
      sessionId,
      userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await event.save();

    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get analytics metrics (admin/moderator only)
router.get('/metrics', authenticate, checkPermission('view_analytics'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if no date range provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Total visitors (unique sessions)
    const totalVisitors = await AnalyticsEvent.distinct('sessionId', {
      createdAt: { $gte: start, $lte: end }
    });

    // Active users (users with events in last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await AnalyticsEvent.distinct('userId', {
      createdAt: { $gte: yesterday },
      userId: { $ne: null }
    });

    // Average session duration
    const sessionDurations = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$sessionId',
          firstEvent: { $min: '$createdAt' },
          lastEvent: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          duration: { $subtract: ['$lastEvent', '$firstEvent'] }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    const avgSessionDuration = sessionDurations[0]?.avgDuration 
      ? Math.round(sessionDurations[0].avgDuration / (1000 * 60)) // Convert to minutes
      : 0;

    // Onboarding completion rate
    const onboardingStarted = await AnalyticsEvent.countDocuments({
      action: 'start_onboarding',
      createdAt: { $gte: start, $lte: end }
    });

    const onboardingCompleted = await AnalyticsEvent.countDocuments({
      action: 'onboarding_completed',
      createdAt: { $gte: start, $lte: end }
    });

    const onboardingCompletionRate = onboardingStarted > 0 
      ? onboardingCompleted / onboardingStarted 
      : 0;

    // Top cultural preferences
    const topCulturalPreferences = await AnalyticsEvent.aggregate([
      {
        $match: {
          action: 'onboarding_completed',
          'data.preferences': { $exists: true },
          createdAt: { $gte: start, $lte: end }
        }
      },
      { $unwind: '$data.preferences' },
      {
        $group: {
          _id: '$data.preferences',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          preference: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Popular destinations
    const popularDestinations = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: 'page_view',
          action: 'view_destination',
          'data.destinationName': { $exists: true },
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$data.destinationName',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $project: {
          destination: '$_id',
          views: 1,
          _id: 0
        }
      }
    ]);

    // Engagement metrics
    const chatMessages = await AnalyticsEvent.countDocuments({
      type: 'interaction',
      action: { $regex: 'chat|message' },
      createdAt: { $gte: start, $lte: end }
    });

    const profileViews = await AnalyticsEvent.countDocuments({
      action: 'view_dashboard',
      createdAt: { $gte: start, $lte: end }
    });

    const recommendationClicks = await AnalyticsEvent.countDocuments({
      type: 'interaction',
      action: { $regex: 'recommendation|select_destination' },
      createdAt: { $gte: start, $lte: end }
    });

    // Real-time users (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const realTimeUsers = await AnalyticsEvent.distinct('sessionId', {
      createdAt: { $gte: fiveMinutesAgo }
    });

    res.json({
      totalVisitors: totalVisitors.length,
      activeUsers: activeUsers.length,
      avgSessionDuration,
      onboardingCompletionRate,
      topCulturalPreferences,
      popularDestinations,
      engagementMetrics: {
        chatMessages,
        profileViews,
        recommendationClicks
      },
      realTimeUsers: realTimeUsers.length,
      dateRange: { start, end }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get real-time analytics
router.get('/realtime', authenticate, checkPermission('view_analytics'), async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Active sessions in last 5 minutes
    const activeSessions = await AnalyticsEvent.distinct('sessionId', {
      createdAt: { $gte: fiveMinutesAgo }
    });

    // Recent events
    const recentEvents = await AnalyticsEvent.find({
      createdAt: { $gte: oneHourAgo }
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('userId', 'firstName lastName email');

    // Page views in last hour
    const pageViews = await AnalyticsEvent.countDocuments({
      type: 'page_view',
      createdAt: { $gte: oneHourAgo }
    });

    res.json({
      activeSessions: activeSessions.length,
      recentEvents,
      pageViewsLastHour: pageViews,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;