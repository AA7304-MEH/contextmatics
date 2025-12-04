import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NewLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const location = useLocation();

  useEffect(() => {
    // Handle hash-style routing for sections (e.g. /#cta -> /cta path)
    if (location.pathname !== '/') {
      const sectionId = location.pathname.replace('/', '');
      const element = document.getElementById(sectionId);
      if (element) {
        // Small delay to ensure DOM is ready and layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50">
      {/* Header */}
      <header>
        <div className="container nav-container">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Context<span>Matics</span></a>
          <nav>
            <ul className="nav-links" style={{ display: isMenuOpen ? 'flex' : undefined }}>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How It Works</a></li>
              <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }}>Testimonials</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}>Pricing</a></li>
            </ul>
          </nav>
          <div className="nav-actions hidden md:flex gap-4">
            <button onClick={() => navigate('/auth')} className="btn btn-secondary">Sign In</button>
            <a href="#cta" className="btn btn-primary">Get Started</a>
          </div>
          <button className="mobile-menu-btn" onClick={toggleMenu}>☰</button>
        </div>
        {/* Mobile Menu Dropdown (Simple implementation for React) */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg flex flex-col gap-4">
            <a href="#features" className="text-gray-700 font-medium" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
            <a href="#how-it-works" className="text-gray-700 font-medium" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How It Works</a>
            <a href="#testimonials" className="text-gray-700 font-medium" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }}>Testimonials</a>
            <a href="#pricing" className="text-gray-700 font-medium" onClick={() => { setIsMenuOpen(false); navigate('/pricing'); }}>Pricing</a>
            <div className="flex flex-col gap-2 mt-2">
              <button onClick={() => navigate('/auth')} className="btn btn-secondary justify-center">Sign In</button>
              <a href="#cta" className="btn btn-primary justify-center" onClick={() => setIsMenuOpen(false)}>Get Started</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1>From Ideas to Impact. Instantly.</h1>
            <p className="hero-subtitle">ContextMatics uses advanced AI to transform your raw ideas into engaging multi-platform content and viral video shorts that drive growth.</p>
            <div className="hero-buttons">
              <a href="#cta" className="btn btn-primary">Start Free Trial</a>
              <a href="#features" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>See How It Works</a>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="dashboard-mockup flex items-center justify-center bg-gray-50">
              {/* Dashboard visualization placeholder */}
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500">Real-time insights visualization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <p>Trusted by data-driven teams at</p>
          <div className="trust-logos">
            <div className="trust-logo">TechCorp</div>
            <div className="trust-logo">InnovateInc</div>
            <div className="trust-logo">DataStream</div>
            <div className="trust-logo">GrowthLab</div>
            <div className="trust-logo">NextGen</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section" id="problem">
        <div className="container">
          <div className="section-header">
            <h2>Drowning in Data, Thirsty for Insight?</h2>
            <p>You have countless charts and reports, but still don't know why users churn or what truly drives engagement.</p>
          </div>
          <div className="problem-grid stagger-animation">
            <div className="problem-card">
              <h3><span className="problem-icon">📝</span>Writer's Block</h3>
              <p>Staring at a blank cursor, struggling to turn your thoughts into engaging posts for multiple platforms.</p>
            </div>
            <div className="problem-card">
              <h3><span className="problem-icon">🎬</span>Editing Fatigue</h3>
              <p>Spending hours manually cropping and captioning long videos to create shorts for TikTok and Reels.</p>
            </div>
            <div className="problem-card">
              <h3><span className="problem-icon">🗣️</span>Inconsistent Voice</h3>
              <p>AI tools that sound robotic and generic, failing to capture your unique brand voice and context.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Intelligent Features, <span className="text-gradient">Transformative Results</span></h2>
            <p>Our AI-powered platform goes beyond traditional analytics to deliver contextual intelligence.</p>
          </div>
          <div className="features-grid stagger-animation">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Multi-Format Content AI</h3>
              <p>Instantly transform your ideas into Blog Posts, Twitter Threads, Newsletters, and LinkedIn updates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>Viral Video Repurposing</h3>
              <p>Turn long-form videos into engaging Shorts, Reels, and TikToks with AI-detected viral moments.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart Context Engine</h3>
              <p>Our AI understands your unique voice and context to generate content that sounds exactly like you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How ContextMatics Works</h2>
            <p>Transform your data into actionable insights in three simple steps</p>
          </div>
          <div className="steps stagger-animation">
            <div className="step">
              <h3>Connect Your Data</h3>
              <p>Integrate with your data sources in minutes. We support Google Analytics, SQL databases, CRMs, and more.</p>
            </div>
            <div className="step">
              <h3>AI Analysis & Context</h3>
              <p>Our engine processes and contextualizes your data, identifying patterns, correlations, and hidden insights.</p>
            </div>
            <div className="step">
              <h3>Act on Intelligence</h3>
              <p>Receive clear, actionable recommendations and insights directly in your dashboard or inbox.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by <span className="text-gradient">Innovative Teams</span></h2>
            <p>See what our customers say about transforming their data into decisions</p>
          </div>
          <div className="testimonial-grid stagger-animation">
            <div className="testimonial-card">
              <div className="testimonial-content">
                ContextMatics identified a churn trigger we had missed for months. It's like having a senior data scientist on the team 24/7.
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SD</div>
                <div className="author-info">
                  <h4>Sarah Chen</h4>
                  <p>Head of Product, TechStart</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                The predictive analytics helped us allocate our marketing budget 30% more effectively. ROI was immediate.
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MJ</div>
                <div className="author-info">
                  <h4>Marcus Johnson</h4>
                  <p>Marketing Director, GrowthLab</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                Finally, an analytics platform that speaks business language instead of data jargon. Game changer for our exec team.
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">EP</div>
                <div className="author-info">
                  <h4>Elena Petrova</h4>
                  <p>CEO, DataFirst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-content fade-in">
            <h2>Ready to Stop Guessing and Start Knowing?</h2>
            <p>Join hundreds of teams who are already making smarter, faster decisions with contextual intelligence.</p>
            <div className="cta-buttons">
              <button onClick={() => navigate('/auth')} className="btn btn-cta">Start Your Free Trial</button>
              <button onClick={() => navigate('/auth')} className="btn btn-cta-outline">Schedule a Demo</button>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>No credit card required • 14-day free trial • Setup in minutes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h4>ContextMatics</h4>
              <p>Transforming data into contextual intelligence for forward-thinking businesses.</p>
              <div className="contact-info" style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <p style={{ marginBottom: '0.25rem' }}><strong>Founder:</strong> Aditya Mehra</p>
                <p><strong>Email:</strong> <a href="mailto:contextmatics11@zohomail.in" style={{ color: 'inherit', textDecoration: 'none' }}>contextmatics11@zohomail.in</a></p>
              </div>
              <div className="social-links">
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
              </div>
            </div>
            <div className="footer-column">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a></li>
                <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How It Works</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Case Studies</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ContextMatics. All rights reserved.</p>
            <p>Made with ❤️ for data-driven teams</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
