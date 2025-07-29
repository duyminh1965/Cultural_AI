"use client"; // This file is a client component
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { liveRecommendations } from '../data/mockData';
import { useAI } from '../hooks/useAI';

export const LiveRecommendations = () => {
  const { getLiveRecommendations } = useAI();
  const [currentLocation] = useState('Copenhagen, Denmark');
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(liveRecommendations);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    const loadLiveRecommendations = async () => {
      setIsLoadingAI(true);
      try {
        const result = await getLiveRecommendations(currentLocation);
        setRecommendations(result.recommendations.length > 0 ? result.recommendations : liveRecommendations);
      } catch (error) {
        console.error('Failed to load live recommendations:', error);
        setRecommendations(liveRecommendations);
      } finally {
        setIsLoadingAI(false);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadLiveRecommendations, 1000);
    return () => clearTimeout(timer);
  }, [currentLocation, getLiveRecommendations]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-amber-500 rounded-2xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">
            AI Live Cultural Navigation
          </h1>
          <div className="flex items-center space-x-1 bg-white/60 px-2 py-1 rounded-full">
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Real-time AI</span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 text-slate-600 mb-6">
          <MapPin className="h-5 w-5" />
          <span className="text-lg">{currentLocation}</span>
        </div>
      </motion.div>

      {/* Location Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Cultural Radar Active</h2>
              <p className="text-sm text-slate-600">
                {isLoadingAI ? 'AI analyzing local cultural scene...' : 'AI-powered personalized experiences nearby'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-teal-600">{recommendations.length}</p>
            <p className="text-sm text-slate-600">AI matches</p>
          </div>
        </div>
      </motion.div>

      {/* Live Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-teal-600" />
          AI-Powered Cultural Matches
        </h2>

        <AnimatePresence>
          {isLoading || isLoadingAI ? (
            <motion.div className="text-center py-12">
              <div className="inline-flex items-center space-x-2 text-slate-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>AI scanning cultural landscape...</span>
              </div>
            </motion.div>
          ) : (
            recommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/50 hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="relative h-48 md:h-full">
                      <img
                        src={recommendation.imageUrl}
                        alt={recommendation.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-amber-500 fill-current" />
                          <Brain className="h-3 w-3 text-teal-500" />
                          <span className="text-xs font-semibold text-slate-800">
                            {Math.round((recommendation.cultural_match || recommendation.culturalMatch) * 100)}% AI
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-teal-600 text-white px-2 py-1 rounded-full">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-semibold">{recommendation.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">
                          {recommendation.title}
                        </h3>
                        <p className="text-sm text-slate-600 capitalize">{recommendation.type}</p>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4 leading-relaxed">
                      {recommendation.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm text-slate-600 font-medium mb-2">Why this matches your taste:</p>
                      <p className="text-sm text-slate-700 italic bg-slate-50/50 p-3 rounded-lg border border-slate-200/50">
                        {recommendation.reasoning}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {recommendation.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            tag.includes('AI') || tag.includes('Qloo') 
                              ? 'bg-amber-100 text-amber-800 border-amber-200/50'
                              : 'bg-teal-100 text-teal-800 border-teal-200/50'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{recommendation.location}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 hover:bg-teal-700 transition-colors"
                      >
                        <span>Get Directions</span>
                        <ArrowRight className="h-3 w-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Cultural Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-teal-50 via-amber-50 to-slate-50 rounded-3xl p-6 border border-teal-200/50"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="h-5 w-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-slate-900">AI Cultural Context</h3>
        </div>
        <p className="text-slate-700 leading-relaxed">
          Our AI has analyzed your cultural DNA and cross-referenced it with real-time local data to find experiences 
          that authentically match your taste profile. Using advanced cultural intelligence from Qloo and OpenAI, 
          these recommendations represent genuine local culture that resonates with your unique preferences across 
          music, film, cuisine, and fashion. Each suggestion is scored for cultural alignment and updated in real-time.
        </p>
      </motion.div>
    </div>
  );
};