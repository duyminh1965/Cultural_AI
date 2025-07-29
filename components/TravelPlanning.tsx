"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Sparkles, Brain } from 'lucide-react';
import { mockDestinations } from '../data/mockData';
import { useAI } from '../hooks/useAI';

export const TravelPlanning = () => {
  const { getDestinationSuggestions } = useAI();
  const [aiDestinations, setAiDestinations] = React.useState<any[]>([]);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  React.useEffect(() => {
    const loadAIDestinations = async () => {
      setIsLoadingAI(true);
      try {
        const result = await getDestinationSuggestions();
        setAiDestinations(result.destinations);
      } catch (error) {
        console.error('Failed to load AI destinations:', error);
      } finally {
        setIsLoadingAI(false);
      }
    };

    loadAIDestinations();
  }, [getDestinationSuggestions]);

  const destinations = aiDestinations.length > 0 ? aiDestinations : mockDestinations;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-amber-500 rounded-2xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">
            AI-Curated Cultural Destinations
          </h1>
          <div className="flex items-center space-x-1 bg-white/60 px-3 py-1 rounded-full">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Powered by Qloo</span>
          </div>
        </div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Based on your unique cultural DNA analyzed by AI, here are destinations that will resonate with your authentic self
        </p>
        
        {isLoadingAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-center space-x-2 text-teal-600"
          >
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <span>AI is analyzing your cultural preferences...</span>
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-8">
        {destinations.map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="lg:flex">
              <div className="lg:w-1/2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-sm font-semibold text-slate-800">
                        {Math.round((destination.cultural_match || destination.culturalMatch) * 100)}% AI Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-medium text-teal-700 bg-teal-100 px-2 py-1 rounded-full">
                        AI Recommended
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                      {destination.name}
                    </h2>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 mb-6 leading-relaxed">
                  {destination.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Cultural Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(destination.highlights || destination.cultural_highlights || []).map((highlight: boolean | React.Key | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                      <div
                        key={index}
                        className="bg-teal-50 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium border border-teal-200/50"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Top Recommendations</h3>
                  <div className="space-y-3">
                    {(destination.recommendations || destination.local_recommendations || []).slice(0, 2).map((rec: { id: React.Key | null | undefined; imageUrl: any; title: any; name: any; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; cultural_match: any; culturalMatch: any; }, recIndex: number) => (
                      <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-200/50">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                          <img 
                            src={rec.imageUrl || `https://images.pexels.com/photos/${1000000 + recIndex}/pexels-photo-${1000000 + recIndex}.jpeg`} 
                            alt={rec.title || rec.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm">{rec.title || rec.name}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{rec.description}</p>
                          <div className="flex items-center mt-2">
                            <Star className="h-3 w-3 text-amber-500 fill-current mr-1" />
                            <span className="text-xs text-slate-600">
                              {Math.round((rec.cultural_match || rec.culturalMatch || 0.8) * 100)}% AI match
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  // onClick={() => onSelectDestination(destination.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-teal-600 to-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
                >
                  <span>Explore {destination.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};