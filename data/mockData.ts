import { CulturalProfile, Destination, Recommendation } from '../types';


export const mockCulturalProfile: CulturalProfile = {
  id: '1',
  preferences: {
    music: ['Indie Folk', 'Bon Iver', 'Fleet Foxes', 'Iron & Wine', 'The National'],
    film: ['Independent Cinema', 'Wes Anderson', 'Scandinavian Films', 'Nature Documentaries'],
    cuisine: ['Farm-to-table', 'Nordic', 'Craft Beer', 'Artisanal Coffee', 'Sustainable Dining'],
    fashion: ['Sustainable Brands', 'Minimalist', 'Earth Tones', 'Artisanal Crafts'],
    travel: ['Cultural Immersion', 'Off the Beaten Path', 'Local Experiences', 'Nature Integration'],
  },
  tasteMap: [
    { from: 'Indie Folk', to: 'Nordic Cuisine', strength: 0.85, domain: 'Music → Cuisine' },
    { from: 'Scandinavian Films', to: 'Copenhagen', strength: 0.92, domain: 'Film → Travel' },
    { from: 'Sustainable Fashion', to: 'Artisanal Markets', strength: 0.78, domain: 'Fashion → Shopping' },
    { from: 'Nature Documentaries', to: 'Scottish Highlands', strength: 0.88, domain: 'Film → Travel' },
  ],
  tasteData:
  [
    { name: 'Nordic Culture', value: 35, color: '#0ea5e9' },
    { name: 'Indie Arts', value: 28, color: '#e8b932' },
    { name: 'Sustainable Living', value: 22, color: '#7f8859' },
    { name: 'Artisan Crafts', value: 15, color: '#b07c17' },
  ],
  personalityTraits: ['Authentic', 'Contemplative', 'Nature-loving', 'Quality-focused'],
  culturalAffinities: ['Nordic Culture', 'Celtic Heritage', 'Artisan Communities', 'Sustainable Living'],
};

export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Copenhagen',
    country: 'Denmark',
    culturalMatch: 0.94,
    description: 'A harmonious blend of hygge culture, innovative Nordic cuisine, and thriving indie music scene that perfectly aligns with your contemplative and authentic sensibilities.',
    imageUrl: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg',
    highlights: ['Hygge Culture', 'Nordic Cuisine', 'Design Excellence', 'Sustainable Living'],
    recommendations: [
      {
        id: 'r1',
        type: 'restaurant',
        title: 'Noma',
        description: 'Revolutionary Nordic cuisine that transforms local ingredients into poetic expressions',
        location: 'Refshalevej 96, Copenhagen',
        culturalMatch: 0.96,
        imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
        tags: ['Nordic', 'Michelin Star', 'Farm-to-table', 'Innovative'],
        reasoning: 'Your appreciation for authentic, craft-focused experiences aligns perfectly with Noma\'s philosophy of transforming simple, local ingredients into extraordinary culinary art.',
      },
      {
        id: 'r2',
        type: 'activity',
        title: 'Jazzhouse Copenhagen',
        description: 'Intimate venue showcasing Nordic indie folk and experimental music',
        location: 'Niels Hemmingsens Gade 10, Copenhagen',
        culturalMatch: 0.91,
        imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
        tags: ['Live Music', 'Indie', 'Intimate', 'Cultural'],
        reasoning: 'This venue regularly features artists similar to Bon Iver and Fleet Foxes, offering the contemplative musical experiences you cherish.',
      },
    ],
  },
  {
    id: '2',
    name: 'Scottish Highlands',
    country: 'Scotland',
    culturalMatch: 0.89,
    description: 'Raw natural beauty and Celtic heritage that resonates with your love for contemplative landscapes and authentic cultural experiences.',
    imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg',
    highlights: ['Celtic Heritage', 'Natural Beauty', 'Traditional Crafts', 'Whisky Culture'],
    recommendations: [
      {
        id: 'r3',
        type: 'accommodation',
        title: 'The Fife Arms',
        description: 'Art-filled highland retreat celebrating Scottish culture and craftsmanship',
        location: 'Mar Rd, Braemar, Scotland',
        culturalMatch: 0.87,
        imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
        tags: ['Boutique', 'Art', 'Highland', 'Cultural'],
        reasoning: 'This unique hotel combines your love for authentic cultural experiences with artistic expression and sustainable Highland living.',
      },
    ],
  },
  {
    id: '3',
    name: 'Portland',
    country: 'United States',
    culturalMatch: 0.86,
    description: 'A haven for indie culture, sustainable living, and artisanal everything - from coffee to craft beer to local music.',
    imageUrl: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg',
    highlights: ['Indie Music Scene', 'Craft Culture', 'Sustainability', 'Food Trucks'],
    recommendations: [
      {
        id: 'r4',
        type: 'activity',
        title: 'McMenamins Crystal Ballroom',
        description: 'Historic venue featuring indie folk and alternative acts',
        location: '1332 W Burnside St, Portland, OR',
        culturalMatch: 0.88,
        imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
        tags: ['Live Music', 'Historic', 'Indie', 'Alternative'],
        reasoning: 'This iconic venue regularly hosts artists that align with your indie folk preferences, in a setting that values both history and authentic musical expression.',
      },
    ],
  },
];

export const liveRecommendations: Recommendation[] = [
  {
    id: 'live1',
    type: 'shopping',
    title: 'Accord Records',
    description: 'Specialized Nordic folk and indie record shop in Jægersborggade',
    location: 'Just 200m away',
    culturalMatch: 0.93,
    imageUrl: 'https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg',
    tags: ['Vinyl', 'Nordic Folk', 'Independent', 'Local'],
    reasoning: 'Perfect match for your Bon Iver and Fleet Foxes preferences - they have rare Nordic pressings you\'ll love.',
  },
  {
    id: 'live2',
    type: 'restaurant',
    title: 'Mirabelle',
    description: 'Natural wine bar with foraged ingredients and intimate atmosphere',
    location: '5 min walk',
    culturalMatch: 0.89,
    imageUrl: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    tags: ['Natural Wine', 'Foraged', 'Intimate', 'Sustainable'],
    reasoning: 'Their philosophy of working with nature aligns perfectly with your sustainable and authentic preferences.',
  },
];