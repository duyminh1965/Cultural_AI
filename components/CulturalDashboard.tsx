"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Film, Utensils, Shirt, MapPin, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { mockCulturalProfile } from '../data/mockData';
import { CulturalProfile } from '@/types';
import { useUser } from '@clerk/nextjs';
import { CulturalProfileOne } from '@/database/action/culturalProfile.action';

export const CulturalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CulturalProfile >(mockCulturalProfile);
  const { user } = useUser();
  const userId = user?.id as string;

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const profileData = await CulturalProfileOne(userId) as CulturalProfile;
      if (profileData?.id) {
        setProfile(profileData);
        setLoading(false);
      }
    };
    fetchProfile(userId);
  }, [loading, userId])
    

  const preferenceIcons = {
    music: Music,
    film: Film,
    cuisine: Utensils,
    fashion: Shirt,
    travel: MapPin,
  };

  const tasteData = profile?.tasteData;  

  const tasteMap = profile?.tasteMap || [];

  const connectionStrengths = tasteMap.map(connection => ({
    name: connection.domain.split(' → ')[1],
    strength: Math.round(connection.strength * 100),
  }));

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
          Your Cultural Profile
          {loading && " Demo Mode"}
        </h1>
        <p className="text-lg text-slate-600">
          Deep insights into your cultural DNA and taste connections
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-teal-600" />
              Cultural Preferences
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(profile.preferences).map(([domain, items]) => {
                const Icon = preferenceIcons[domain as keyof typeof preferenceIcons];
                return (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/50"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-teal-100 mr-3">
                        <Icon className="h-5 w-5 text-teal-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 capitalize">
                        {domain}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="bg-white/60 px-3 py-2 rounded-lg text-sm text-slate-700 border border-white/50"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Cultural Affinities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Taste Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Cultural Affinities</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {tasteData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Strengths */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Taste Connections</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={connectionStrengths} layout="horizontal">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="strength" fill="#0ea5e9" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Personality Traits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Personality Traits</h3>
            <div className="space-y-3">
              {profile.personalityTraits.map((trait, index) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gradient-to-r from-amber-100 to-slate-100 px-4 py-2 rounded-full text-sm text-slate-800 border border-amber-200/50"
                >
                  {trait}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};