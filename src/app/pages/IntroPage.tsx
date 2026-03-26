import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Sparkles, FileText, MessageSquare, Zap, BookOpen, Brain, Database, Users } from 'lucide-react';
import logo from '../../imports/logo_noname_(1).svg';

export function IntroPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Multiple LLM Support',
      description: 'Powered by OpenAI, DeepSeek, or local Ollama models',
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Advanced Knowledge Base',
      description: 'FAISS vector search over course materials and department resources',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Source Citations',
      description: 'Every answer backed by references from verified knowledge sources',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smart Follow-ups',
      description: 'AI-generated related questions to explore topics deeper',
    },
  ];

  const capabilities = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: 'Course Information & Prerequisites',
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'Inter-department Queries',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      text: 'Real-time Streaming Responses',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: 'Metadata-aware Reranking',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-6 mb-6"
          >
            <motion.img
              src={logo}
              alt="ECEasy Logo"
              className="w-24 h-24 md:w-32 md:h-32"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <h1 className="text-5xl md:text-7xl font-bold">
              <span style={{ color: '#1e3a8a' }}>EC</span>
              <span style={{ color: '#3b82f6' }}>Easy</span>
            </h1>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <motion.button
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              }}
            >
              Start Chatting
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto"
          >
            Your intelligent AI chatbot for ECE students
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Designed to accommodate inter-department queries with advanced vector search 
            over course materials, prerequisites, and program requirements
          </motion.p>

          {/* Key Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">What Can ECEasy Do?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-amber-200 hover:border-amber-300 transition-all"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="text-blue-600">{capability.icon}</div>
                    <p className="text-sm text-gray-700">{capability.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Powered By Advanced Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200 mb-12 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-gray-900">Ask Your Question</h3>
                <p className="text-sm text-gray-600">
                  Type your query about courses, departments, or requirements
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-gray-900">AI Retrieval</h3>
                <p className="text-sm text-gray-600">
                  Our system searches the knowledge base using advanced vector embeddings
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-gray-900">Get Cited Answers</h3>
                <p className="text-sm text-gray-600">
                  Receive accurate responses with source citations and follow-up suggestions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-8 text-sm text-gray-500"
          >
            Powered by FastAPI, React, and advanced vector search technology
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}