import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_view', 'interaction', 'conversion', 'engagement'],
    required: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ sessionId: 1, createdAt: -1 });
analyticsEventSchema.index({ userId: 1, createdAt: -1 });
analyticsEventSchema.index({ action: 1 });

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);