import mongoose from 'mongoose';

const tasteConnectionSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  strength: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  domain: {
    type: String,
    required: true
  }
});

const culturalProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    music: [String],
    film: [String],
    cuisine: [String],
    fashion: [String],
    travel: [String]
  },
  tasteMap: [tasteConnectionSchema],
  personalityTraits: [String],
  culturalAffinities: [String],
  completedOnboarding: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for performance
culturalProfileSchema.index({ userId: 1 });

export default mongoose.model('CulturalProfile', culturalProfileSchema);