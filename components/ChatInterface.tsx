import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Sparkles, Brain } from 'lucide-react';
import { useChat } from '../hooks/useChat';


export const ChatInterface = () => {
  const { messages, isTyping, extractedPreferences, sendMessage, completeOnboarding } = useChat();
  const [input, setInput] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsCompleting(true);
    try {
      await completeOnboarding();
      // onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-teal-50 via-amber-50 to-slate-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-amber-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-slate-900">
              AI Cultural Conversation
            </h2>
            <div className="flex items-center space-x-1 bg-white/60 px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Powered by OpenAI & Qloo</span>
            </div>
          </div>
          <p className="text-slate-600 mb-4">
            I&apos;m using advanced AI to understand your cultural preferences and create your unique taste profile. Share what you love, and I&apos;ll map the connections across music, film, cuisine, and fashion.
          </p>
          
          {extractedPreferences && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 mb-4 border border-amber-50"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">AI Insights Detected</span>
              </div>
              <p className="text-sm text-slate-600">
                I&apos;ve identified patterns in your preferences across {Object.keys(extractedPreferences).length} cultural domains. 
                Ready to see your complete cultural profile?
              </p>
            </motion.div>
          )}
          
          {(messages.length > 6 || extractedPreferences) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleCompleteOnboarding}
              disabled={isCompleting}
              className="bg-gradient-to-r from-teal-600 to-amber-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center space-x-2"
            >
              {isCompleting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Analyzing Cultural Profile...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>Complete AI Analysis</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-teal-600 to-amber-600 text-white'
                      : 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 border border-slate-200/50'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 rounded-2xl max-w-xs border border-slate-200/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-sm text-slate-600">AI is analyzing your cultural preferences...</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-teal-50/30">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your cultural preferences..."
              className="flex-1 px-4 py-3 rounded-full border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white/80 backdrop-blur-sm"
              disabled={isTyping || isCompleting}
            />
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || isCompleting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-600 to-amber-600 text-white p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
          
          <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full" />
              <span>OpenAI GPT-4</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span>Qloo Taste AI</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-slate-500 rounded-full" />
              <span>Cultural Intelligence</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};