import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ArrowRight, Star, CheckCircle, Users, Award, Truck, Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import CartSidebar from '../components/cart/CartSidebar'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
  const { addToCart, cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const heroRef = useRef(null)
  const featuredRef = useRef(null)
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar entrance animation
      gsap.from('.navbar-container', {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: 'power3.out'
      })

      // Hero section animation with more dramatic effects
      const heroTl = gsap.timeline()
        .from('.hero-title', { 
          duration: 1.5, 
          y: 120, 
          opacity: 0, 
          scale: 0.8,
          rotationX: 45,
          ease: 'power4.out' 
        })
        .from('.hero-subtitle', { 
          duration: 1.2, 
          y: 80, 
          opacity: 0, 
          scale: 0.9,
          ease: 'power3.out' 
        }, '-=0.8')
        .from('.hero-buttons', { 
          duration: 1, 
          y: 60, 
          opacity: 0, 
          scale: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)' 
        }, '-=0.6')
        .from('.hero-image', { 
          duration: 2, 
          scale: 0.6, 
          opacity: 0, 
          rotation: 10,
          ease: 'power3.out' 
        }, '-=1.5')

      // Floating particles animation
      gsap.set('.particle', {
        opacity: 0,
        scale: 0,
        x: 'random(-200, 200)',
        y: 'random(-200, 200)'
      })
      
      gsap.to('.particle', {
        duration: 'random(3, 6)',
        opacity: 'random(0.3, 0.8)',
        scale: 'random(0.5, 1.5)',
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        ease: 'none',
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 2,
          from: 'random'
        }
      })

      // Featured section title animation with dramatic entrance
      gsap.fromTo('.featured-title', 
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationX: 45
        },
        {
          duration: 1.5,
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Featured products with amazing staggered entrance
      gsap.fromTo('.featured-card', 
        {
          y: 150,
          opacity: 0,
          scale: 0.7,
          rotation: 5
        },
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          stagger: {
            amount: 0.8,
            from: 'start'
          },
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 60%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Stats section with morphing background
      gsap.fromTo('.stats-bg', 
        {
          scale: 0.8,
          opacity: 0,
          borderRadius: '50%'
        },
        {
          duration: 1.5,
          scale: 1,
          opacity: 1,
          borderRadius: '0%',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Explosive counter animation
      gsap.fromTo('.stat-number', 
        { 
          textContent: 0,
          scale: 0.5,
          opacity: 0
        },
        {
          duration: 2,
          textContent: (i, target) => target.getAttribute('data-count'),
          scale: 1,
          opacity: 1,
          ease: 'back.out(1.7)',
          snap: { textContent: 1 },
          stagger: 0.2,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Pulsing glow effect for stats
      gsap.to('.stat-number', {
        duration: 2,
        textShadow: '0 0 20px #3b82f6, 0 0 40px #3b82f6, 0 0 60px #3b82f6',
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.2
      })

      // Features with spinning entrance
      gsap.fromTo('.feature-item', 
        {
          y: 100,
          opacity: 0,
          scale: 0.5,
          rotation: 180
        },
        {
          duration: 1,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          stagger: 0.3,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Feature title animation
      gsap.fromTo('.features-title', 
        {
          y: 80,
          opacity: 0,
          scale: 0.9
        },
        {
          duration: 1.5,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Feature icons with bounce and glow
      gsap.fromTo('.feature-icon', 
        {
          scale: 0,
          opacity: 0,
          rotation: -180
        },
        {
          duration: 1.2,
          scale: 1,
          opacity: 1,
          rotation: 0,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Continuous glow effect for feature icons
      gsap.to('.feature-icon', {
        duration: 2,
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)',
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.3
      })

      // Testimonials with slide-in effect
      gsap.fromTo('.testimonials-title', 
        {
          x: -200,
          opacity: 0,
          rotationY: 45
        },
        {
          duration: 1.5,
          x: 0,
          opacity: 1,
          rotationY: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Testimonials cards with wave effect
      gsap.fromTo('.testimonial-card', 
        {
          x: 200,
          opacity: 0,
          scale: 0.8,
          rotation: 10
        },
        {
          duration: 1.2,
          x: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          stagger: {
            amount: 0.6,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // CTA with explosive entrance
      gsap.fromTo('.cta-content', 
        {
          y: 200,
          opacity: 0,
          scale: 0.3,
          rotation: 20
        },
        {
          duration: 1.8,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // CTA buttons with stagger and bounce
      gsap.fromTo('.cta-button', 
        {
          y: 100,
          opacity: 0,
          scale: 0.5
        },
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Text reveal animations for all sections
      gsap.fromTo('.text-reveal', 
        {
          y: 50,
          opacity: 0
        },
        {
          duration: 1,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.text-reveal',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Image hover effects with GSAP
      document.querySelectorAll('.hover-scale').forEach(img => {
        img.addEventListener('mouseenter', () => {
          gsap.to(img, { duration: 0.3, scale: 1.05, ease: 'power2.out' })
        })
        img.addEventListener('mouseleave', () => {
          gsap.to(img, { duration: 0.3, scale: 1, ease: 'power2.out' })
        })
      })

      // Price tag animations
      gsap.fromTo('.price-tag', 
        {
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        {
          duration: 1,
          scale: 1,
          rotation: 0,
          opacity: 1,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.featured-card',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Advanced parallax effects
      gsap.to('.hero-image', {
        yPercent: -30,
        rotation: 5,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      // Parallax background elements
      gsap.to('.parallax-bg', {
        yPercent: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      })

      // Continuous floating animation for featured cards
      gsap.to('.featured-card', {
        y: -10,
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 1,
          from: 'random'
        }
      })

      // Magical sparkle effect
      gsap.set('.sparkle', {
        scale: 0,
        opacity: 0
      })

      gsap.to('.sparkle', {
        scale: 'random(0.5, 2)',
        opacity: 'random(0.3, 1)',
        duration: 'random(1, 3)',
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 3,
          repeat: -1,
          from: 'random'
        }
      })

      // Floating animation for hero image
      gsap.to('.hero-image img', {
        duration: 3,
        y: -20,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      })

    }, [heroRef, featuredRef, statsRef, testimonialsRef, ctaRef])

    return () => ctx.revert()
  }, [])

  const featuredChairs = [
    {
      id: 1,
      name: "Executive Pro Chair",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviews: 156,
      description: "Premium ergonomic office chair with lumbar support"
    },
    {
      id: 2,
      name: "Modern Dining Chair",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.6,
      reviews: 89,
      description: "Stylish dining chair with comfortable cushioning"
    },
    {
      id: 3,
      name: "Luxury Recliner",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      reviews: 203,
      description: "Ultimate comfort luxury recliner for relaxation"
    }
  ]

  const handleAddToCart = (chair) => {
    addToCart(chair)
    toast.success(`${chair.name} added to cart!`, {
      duration: 3000,
      position: 'top-center',
    })
  }

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Interior Designer",
      content: "ChairGo has the most comfortable and stylish chairs I've ever used. Perfect for my design projects!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b302?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Mike Johnson",
      role: "Office Manager",
      content: "We furnished our entire office with ChairGo chairs. The quality and service are outstanding!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Lisa Wang",
      role: "Home Owner",
      content: "The dining chairs we bought transformed our dining room. Excellent craftsmanship and comfort!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500">
      {/* Modern Animated Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 navbar-container">
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Animated Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <img 
                    src="/image/brandLogo.svg" 
                    alt="ChairGo" 
                    className="h-8 w-8"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ChairGo
                </span>
                <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            {/* Desktop Floating Menu */}
            <div className="hidden lg:flex items-center">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-1 py-1 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  {[
                    { to: '/home', label: 'Home', icon: '🏠' },
                    { to: '/products', label: 'Products', icon: '🪑' },
                    { to: '/about', label: 'About', icon: '💫' }
                  ].map((item, index) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="nav-item relative px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              
              {/* Animated Cart */}
              <Link to="/cart" className="relative group">
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors" />
                  {cart.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                      {cart.length}
                    </div>
                  )}
                </div>
              </Link>

              {/* Glowing Admin Button */}
              <Link to="/admin" className="hidden md:block">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="relative z-10">Admin</span>
                  </button>
                </div>
              </Link>

              {/* Animated Mobile Menu */}
              <button
                className="lg:hidden relative p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
                  <span className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-2'}`}></span>
                  <span className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Animated Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl mt-4 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2 px-4">
                {[
                  { to: '/home', label: 'Home', icon: '🏠' },
                  { to: '/products', label: 'Products', icon: '🪑' },
                  { to: '/about', label: 'About', icon: '💫' },
                  { to: '/cart', label: `Cart (${cart.length})`, icon: '🛒' }
                ].map((item, index) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl text-center font-semibold shadow-lg">
                      ⚡ Admin Panel
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 pt-20 transition-all duration-500">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute inset-0 parallax-bg bg-gradient-to-r from-blue-400/10 to-purple-400/10"></div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Sparkles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="sparkle absolute text-yellow-300 text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </div>
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6">
                <span className="text-gray-900 dark:text-gray-100">
                  Perfect Chairs for
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  Perfect Moments ✨
                </span>
              </h1>
              <p className="hero-subtitle text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed px-4 lg:px-0 font-medium">
                Discover our premium collection of ergonomic, stylish, and comfortable chairs 
                designed to elevate your space and enhance your comfort.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Link to="/products" className="w-full sm:w-auto group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                      <span>🛒 Shop Now</span>
                      <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Link>
                <div className="relative group">
                  <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto group-hover:border-purple-400">
                    <span>👀 View Collection</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hero-image flex justify-center lg:justify-end mt-8 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Premium Office Chair"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 md:py-20 bg-gray-900 dark:bg-gray-800 text-white stats-bg transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="stat-number text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 mb-1 md:mb-2" data-count="10000">0</div>
              <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm md:text-base">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 mb-1 md:mb-2" data-count="500">0</div>
              <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm md:text-base">Chair Models</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 mb-1 md:mb-2" data-count="15">0</div>
              <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm md:text-base">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 mb-1 md:mb-2" data-count="99">0</div>
              <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm md:text-base">% Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={featuredRef} className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800 transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 featured-title">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              Featured Chairs
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Discover our most popular chairs, loved by thousands of customers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredChairs.map((chair, index) => (
              <Card key={chair.id} className="featured-card overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="relative overflow-hidden">
                  <img 
                    src={chair.image}
                    alt={chair.name}
                    className="hover-scale w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="price-tag absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{chair.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{chair.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{chair.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="price-tag text-xl md:text-2xl font-bold text-blue-600">${chair.price}</span>
                    <span className="text-reveal text-xs md:text-sm text-gray-500 dark:text-gray-400">({chair.reviews} reviews)</span>
                  </div>
                  
                  <Button 
                    className="w-full group bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base py-2 md:py-3"
                    onClick={() => handleAddToCart(chair)}
                  >
                    Add to Cart
                    <ArrowRight className="ml-2 h-3 md:h-4 w-3 md:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 features-section bg-gradient-to-b from-white to-blue-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="features-title text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Why Choose ChairGo? ✨
              </span>
            </h2>
            <p className="features-title text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the highest quality chairs with exceptional service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group feature-item">
              <div className="feature-icon w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🏆 Premium Quality</h3>
              <p className="text-gray-600">Every chair is crafted with the finest materials and attention to detail</p>
            </div>
            
            <div className="text-center group feature-item">
              <div className="feature-icon w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🚚 Free Delivery</h3>
              <p className="text-gray-600">Complimentary delivery and setup service for all orders</p>
            </div>
            
            <div className="text-center group feature-item">
              <div className="feature-icon w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🛡️ 5-Year Warranty</h3>
              <p className="text-gray-600">Comprehensive warranty coverage for peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 testimonials-title">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="cta-content max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Find Your Perfect Chair?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers and transform your space with our premium chairs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="cta-button text-lg px-8 py-4">
                  Browse Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="cta-button text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  )
}