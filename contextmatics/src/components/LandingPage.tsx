import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/pricing')
  }

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleStartFreeTrial = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              ContextMatics
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-white/80 hover:text-white transition-colors font-medium text-lg">
                Features
              </a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors font-medium text-lg">
                Pricing
              </a>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/80 hover:text-white transition-colors font-medium text-lg"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-cyan-400/50"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Much more spacious */}
      <section className="pt-40 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-12">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
              <span className="text-base text-white/90 font-medium">Trusted by 10,000+ creators worldwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-12 leading-tight">
              Create
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-4">
                Amazing Content
              </span>
              <span className="text-4xl md:text-6xl font-bold text-white/90 block mt-6">
                with AI Power
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Transform your ideas into viral content in seconds. Generate blog posts, social media content,
              and marketing copy that drives real results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-400/50"
              >
                Start Creating Free →
              </button>
              <button
                onClick={handleLearnMore}
                className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
              >
                Watch Demo
              </button>
            </div>

            {/* Social Proof - More spaced out */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
              <div className="text-center p-8">
                <div className="text-5xl font-black text-cyan-400 mb-4">50K+</div>
                <div className="text-white/70 text-lg font-medium">Content Pieces Created</div>
              </div>
              <div className="text-center p-8">
                <div className="text-5xl font-black text-purple-400 mb-4">2M+</div>
                <div className="text-white/70 text-lg font-medium">Words Generated</div>
              </div>
              <div className="text-center p-8">
                <div className="text-5xl font-black text-pink-400 mb-4">99.9%</div>
                <div className="text-white/70 text-lg font-medium">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Much more spacious */}
      <section id="features" className="py-40 px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Why Choose ContextMatics?
            </h2>
            <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Everything you need to create, optimize, and scale your content strategy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Lightning Fast</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Generate high-quality content in seconds, not hours. Scale your content production
                without compromising quality.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">SEO Optimized</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Built-in SEO optimization ensures your content ranks higher on Google.
                Drive more organic traffic to your website.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">AI-Powered</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Advanced machine learning algorithms understand context and tone.
                Create content that sounds authentically like you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Much more spacious */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              How It Works
            </h2>
            <p className="text-2xl text-white/70">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="relative p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl font-black text-white shadow-2xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Input Your Content</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Simply paste your text, upload files, or connect your content sources.
              </p>
            </div>

            <div className="relative p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl font-black text-white shadow-2xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">AI Processing</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Our advanced AI analyzes and transforms your content instantly.
              </p>
            </div>

            <div className="relative p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl font-black text-white shadow-2xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Publish Everywhere</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Export to social media, blogs, emails, and more platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Much more spacious */}
      <section className="py-40 px-8 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-12">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block mt-4">
              Content Creation?
            </span>
          </h2>
          <p className="text-2xl text-white/80 mb-16 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators who have revolutionized their workflow with ContextMatics.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
              onClick={handleStartFreeTrial}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-400/50"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="border-2 border-white/30 text-white px-12 py-6 rounded-xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Much more spacious */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div className="md:col-span-2">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
                ContextMatics
              </div>
              <p className="text-white/70 mb-10 max-w-lg text-lg leading-relaxed">
                Empowering creators with AI-driven content transformation.
                The future of content creation is here.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-white/60 hover:text-white transition-colors text-lg font-medium">Twitter</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-lg font-medium">LinkedIn</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-lg font-medium">GitHub</a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 text-xl">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">Features</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">Pricing</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">API</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 text-xl">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">About</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">Blog</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">Careers</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-lg">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-lg">
              © 2024 ContextMatics. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="text-white/50 hover:text-white text-lg transition-colors">Privacy</a>
              <a href="#" className="text-white/50 hover:text-white text-lg transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage