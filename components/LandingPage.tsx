import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SEO } from './shared/SEO'

const LandingPage: React.FC = () => {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO title="ContextMatic - AI Content Creation & Video Repurposing" description="Transform your long-form content into viral social media videos with AI." />
      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white z-50 md:hidden flex flex-col transform transition-transform duration-300 ease-out shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ContextMatics</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-lg transition-colors">
            Features
          </a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-lg transition-colors">
            How it Works
          </a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-lg transition-colors">
            Pricing
          </a>
          <button
            onClick={() => { router.push('/sign-in'); setMobileMenuOpen(false); }}
            className="w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-lg transition-colors text-left"
          >
            Sign In
          </button>
        </nav>
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => { router.push('/sign-in'); setMobileMenuOpen(false); }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Elegant Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 sm:w-11 h-10 sm:h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">C</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">ContextMatics</span>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg">
                Pricing
              </a>
              <button
                onClick={() => router.push('/sign-in')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/sign-in')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section - Redesigned for Conversion */}
      <section className="pt-40 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">The Future of Content Creation</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              Create Viral <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Videos in Minutes
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              ContextMatic turns your snippets, blogs, and ideas into high-quality social media videos instantly.
              The all-in-one AI engine for content creators.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => router.push('/sign-in')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Create My First Video
              </button>
              <button
                onClick={() => router.push('/video-templates')}
                className="bg-white border-2 border-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-200 transition-all"
              >
                Browse Templates
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <p>Join <span className="font-bold text-gray-900">2,000+</span> creators today</p>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative glass-effect rounded-3xl border border-white/40 shadow-2xl p-4 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gray-900 rounded-2xl aspect-video relative overflow-hidden">
                {/* Mock Video UI */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.5 3.5l11 6.5-11 6.5V3.5z" />
                    </svg>
                  </div>
                </div>
                {/* Visual Timeline Overlay */}
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-white/10 backdrop-blur-md rounded-lg flex items-center gap-2 px-3">
                  <div className="h-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded" />
                  <div className="h-4 w-1/2 bg-purple-500 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean and Spacious */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { value: '10,000+', label: 'Active Users' },
              { value: '50,000+', label: 'Content Created' },
              { value: '2M+', label: 'Words Generated' },
              { value: '99.9%', label: 'Uptime SLA' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Spacious Grid */}
      <section id="features" className="py-40 px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with lots of space */}
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to help you create, repurpose, and scale your content effortlessly
            </p>
          </div>

          {/* Feature Grid - lots of space between cards */}
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Lightning Fast',
                description: 'Generate high-quality content in seconds with our advanced AI engine. No more waiting hours for results.'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: 'Multiple Formats',
                description: 'Transform your content into blog posts, social media threads, newsletters, and more with just one click.'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'SEO Optimized',
                description: 'Built-in SEO optimization ensures your content ranks higher on search engines and drives organic traffic.'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
                title: 'Customizable Output',
                description: 'Adjust tone, style, and length to perfectly match your brand voice and audience preferences.'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Team Collaboration',
                description: 'Work seamlessly with your team, share templates, and maintain consistent quality across all content.'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Advanced Analytics',
                description: 'Track performance metrics, measure engagement, and optimize your content strategy with detailed insights.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-5">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* How It Works - Clean and Spacious */}
      < section id="how-it-works" className="py-40 px-8 bg-white" >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
              How It Works
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                step: '01',
                title: 'Input Your Content',
                description: 'Simply paste your text, upload files, or connect your content sources. We support multiple formats and platforms.'
              },
              {
                step: '02',
                title: 'Choose Output Format',
                description: 'Select from blog posts, social media threads, newsletters, or any other format you need for your audience.'
              },
              {
                step: '03',
                title: 'Generate & Publish',
                description: 'Our AI processes your content instantly. Review, edit if needed, and publish directly to your platforms.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl text-white text-3xl font-bold mb-8 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* CTA Section - Spacious */}
      < section className="py-40 px-8 bg-gradient-to-br from-indigo-50 to-purple-50" >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-10 tracking-tight">
            Ready to Transform
            <span className="block mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Content Strategy?
            </span>
          </h2>
          <p className="text-2xl text-gray-600 mb-16 leading-relaxed max-w-3xl mx-auto">
            Join thousands of creators and marketers who are scaling their content with ContextMatics
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => router.push('/auth')}
              className="bg-white border-2 border-gray-300 text-gray-700 px-12 py-6 rounded-2xl font-bold text-xl hover:border-gray-400 hover:shadow-xl transition-all duration-300"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section >

      {/* Footer - Clean and Organized */}
      < footer className="bg-gray-900 text-white py-20 px-8" >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold">ContextMatics</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-8">
                Empowering creators with AI-driven content transformation. Scale your content strategy effortlessly.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl">Product</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl">Company</h4>
              <ul className="space-y-4 text-gray-400 text-lg">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-lg">
              © 2024 ContextMatics. All rights reserved.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-lg transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-lg transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-lg transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer >
    </div >
  )
}

export default LandingPage