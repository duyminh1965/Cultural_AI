import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['restaurant', 'activity', 'event', 'accommodation', 'shopping'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  culturalMatch: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  tags: [String],
  reasoning: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  }
});

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  highlights: [String],
  recommendations: [recommendationSchema],
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  culturalTags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
destinationSchema.index({ name: 1 });
destinationSchema.index({ country: 1 });
destinationSchema.index({ culturalTags: 1 });
destinationSchema.index({ isActive: 1 });

export default mongoose.model('Destination', destinationSchema);