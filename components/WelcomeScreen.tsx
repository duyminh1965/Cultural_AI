import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Map, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

export const WelcomeScreen = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Conversational Discovery",
      description:
        "Share your cultural preferences through natural conversation",
    },
    {
      icon: Brain,
      title: "Cultural Intelligence",
      description:
        "AI maps your tastes across music, film, cuisine, and fashion",
    },
    {
      icon: Map,
      title: "Personalized Travel",
      description:
        "Get destinations and experiences that match your cultural DNA",
    },
    {
      icon: Sparkles,
      title: "Live Recommendations",
      description: "Real-time cultural suggestions wherever you are",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-amber-100 blur-3xl rounded-full" />
          <div className="relative bg-white backdrop-blur-sm rounded-3xl p-12 border border-white shadow-xl">
            <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">
              Your Personal
              <span className="block bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">
                Cultural Concierge
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover travel experiences that resonate with your unique
              cultural taste profile. Our AI combines your preferences across
              music, film, cuisine, and fashion to create personalized journeys
              that feel authentically you.
            </p>
            <Link
              href={"/chat"}
              className="bg-gradient-to-r from-teal-600 to-amber-600 text-white px-8 py-5 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow "
            >
              Start Your Cultural Journey
            </Link>
            
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-amber-100 rounded-2xl mb-4">
                <Icon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-earth-50 to-cultural-50 rounded-3xl p-8 border border-earth-200/50">
          <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Share Your Tastes
                </h3>
                <p className="text-sm text-slate-600">
                  Tell us about your favorite music, films, and experiences
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  AI Analysis
                </h3>
                <p className="text-sm text-slate-600">
                  Our cultural AI maps connections across different domains
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Personalized Journeys
                </h3>
                <p className="text-sm text-slate-600">
                  Get destinations and experiences tailored to your cultural DNA
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
