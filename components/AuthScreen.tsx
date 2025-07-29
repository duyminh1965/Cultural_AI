import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-cultural-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="p-3 bg-gradient-to-br from-primary-500 to-cultural-500 rounded-2xl"
            >
              <Compass className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-cultural-600 bg-clip-text text-transparent">
              Cultural Concierge
            </h1>
          </div>

          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-primary-600 to-cultural-600 bg-clip-text text-transparent">
              Cultural Journey
            </span>
          </h2>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Join thousands of cultural explorers who use AI-powered insights to discover 
            authentic travel experiences that resonate with their unique taste profile.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <div className="text-2xl font-bold text-primary-600 mb-1">2,847</div>
              <div className="text-sm text-slate-600">Cultural Profiles</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <div className="text-2xl font-bold text-cultural-600 mb-1">94%</div>
              <div className="text-sm text-slate-600">Match Accuracy</div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </div>
  );
};