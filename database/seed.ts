import dotenv from 'dotenv';
import { db } from './drizzle.js';
import { culturalProfile, destination } from './schema';

dotenv.config();

const seedData = async () => {
  try {
    
    // Create cultural profile for regular user
    const culturalProfileData = {
      userId: "user_2y4ZLqXJJuN2SoTRyyojZGSjOR0",
      preferences: {
        music: ['Indie Folk', 'Bon Iver', 'Fleet Foxes', 'Iron & Wine', 'The National'],
        film: ['Independent Cinema', 'Wes Anderson', 'Scandinavian Films', 'Nature Documentaries'],
        cuisine: ['Farm-to-table', 'Nordic', 'Craft Beer', 'Artisanal Coffee', 'Sustainable Dining'],
        fashion: ['Sustainable Brands', 'Minimalist', 'Earth Tones', 'Artisanal Crafts'],
        travel: ['Cultural Immersion', 'Off the Beaten Path', 'Local Experiences', 'Nature Integration']
      },
      tasteMap: [
        { from: 'Indie Folk', to: 'Nordic Cuisine', strength: 0.85, domain: 'Music → Cuisine' },
        { from: 'Scandinavian Films', to: 'Copenhagen', strength: 0.92, domain: 'Film → Travel' },
        { from: 'Sustainable Fashion', to: 'Artisanal Markets', strength: 0.78, domain: 'Fashion → Shopping' },
        { from: 'Nature Documentaries', to: 'Scottish Highlands', strength: 0.88, domain: 'Film → Travel' }
      ],
      personalityTraits: ['Authentic', 'Contemplative', 'Nature-loving', 'Quality-focused'],
      culturalAffinities: ['Nordic Culture', 'Celtic Heritage', 'Artisan Communities', 'Sustainable Living'],
      completedOnboarding: true
    };

    await db.insert(culturalProfile).values({...culturalProfileData});

    // Create destinations
    const destinations = [
      {
        name: 'Copenhagen',
        country: 'Denmark',
        description: 'A harmonious blend of hygge culture, innovative Nordic cuisine, and thriving indie music scene that perfectly aligns with your contemplative and authentic sensibilities.',
        imageUrl: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg',
        highlights: ['Hygge Culture', 'Nordic Cuisine', 'Design Excellence', 'Sustainable Living'],
        coordinates: { lat: 55.6761, lng: 12.5683 },
        culturalTags: ['Nordic Culture', 'Sustainable Living', 'Design', 'Indie Music'],
        recommendations: [
          {
            type: 'restaurant',
            title: 'Noma',
            description: 'Revolutionary Nordic cuisine that transforms local ingredients into poetic expressions',
            location: 'Refshalevej 96, Copenhagen',
            culturalMatch: 0.96,
            imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
            tags: ['Nordic', 'Michelin Star', 'Farm-to-table', 'Innovative'],
            reasoning: 'Your appreciation for authentic, craft-focused experiences aligns perfectly with Noma\'s philosophy of transforming simple, local ingredients into extraordinary culinary art.',
            coordinates: { lat: 55.6961, lng: 12.6044 },
            priceRange: '$$$$',
            rating: 4.8
          },
          {
            type: 'activity',
            title: 'Jazzhouse Copenhagen',
            description: 'Intimate venue showcasing Nordic indie folk and experimental music',
            location: 'Niels Hemmingsens Gade 10, Copenhagen',
            culturalMatch: 0.91,
            imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            tags: ['Live Music', 'Indie', 'Intimate', 'Cultural'],
            reasoning: 'This venue regularly features artists similar to Bon Iver and Fleet Foxes, offering the contemplative musical experiences you cherish.',
            coordinates: { lat: 55.6794, lng: 12.5803 },
            priceRange: '$$',
            rating: 4.5
          }
        ]
      },
      {
        name: 'Scottish Highlands',
        country: 'Scotland',
        description: 'Raw natural beauty and Celtic heritage that resonates with your love for contemplative landscapes and authentic cultural experiences.',
        imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
        highlights: ['Celtic Heritage', 'Natural Beauty', 'Traditional Crafts', 'Whisky Culture'],
        coordinates: { lat: 57.0000, lng: -4.0000 },
        culturalTags: ['Celtic Heritage', 'Nature', 'Traditional Crafts', 'Authentic'],
        recommendations: [
          {
            type: 'accommodation',
            title: 'The Fife Arms',
            description: 'Art-filled highland retreat celebrating Scottish culture and craftsmanship',
            location: 'Mar Rd, Braemar, Scotland',
            culturalMatch: 0.87,
            imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
            tags: ['Boutique', 'Art', 'Highland', 'Cultural'],
            reasoning: 'This unique hotel combines your love for authentic cultural experiences with artistic expression and sustainable Highland living.',
            coordinates: { lat: 57.0042, lng: -3.3964 },
            priceRange: '$$$',
            rating: 4.7
          }
        ]
      },
      {
        name: 'Portland',
        country: 'United States',
        description: 'A haven for indie culture, sustainable living, and artisanal everything - from coffee to craft beer to local music.',
        imageUrl: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg',
        highlights: ['Indie Music Scene', 'Craft Culture', 'Sustainability', 'Food Trucks'],
        coordinates: { lat: 45.5152, lng: -122.6784 },
        culturalTags: ['Indie Culture', 'Sustainable Living', 'Artisan Communities', 'Craft Culture'],
        recommendations: [
          {
            type: 'activity',
            title: 'McMenamins Crystal Ballroom',
            description: 'Historic venue featuring indie folk and alternative acts',
            location: '1332 W Burnside St, Portland, OR',
            culturalMatch: 0.88,
            imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
            tags: ['Live Music', 'Historic', 'Indie', 'Alternative'],
            reasoning: 'This iconic venue regularly hosts artists that align with your indie folk preferences, in a setting that values both history and authentic musical expression.',
            coordinates: { lat: 45.5231, lng: -122.6765 },
            priceRange: '$$',
            rating: 4.4
          }
        ]
      }
    ];
    for (const dest of destinations) {
      await db.insert(destination).values({
        userId: "user_2y4ZLqXJJuN2SoTRyyojZGSjOR0",
        ...dest
      });
    }

    console.log('✅ Seed data created successfully');
    console.log('👤 Admin user: admin@culturalconcierge.com / admin123');
    console.log('👤 Regular user: user@example.com / user123');
    console.log('👤 Moderator user: moderator@culturalconcierge.com / mod123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();