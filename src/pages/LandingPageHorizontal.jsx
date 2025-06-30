import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ArrowRight, Star, CheckCircle, Users, Award, Truck, Menu, X, ShoppingCart, Sun, Moon, Globe } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import CartSidebar from '../components/cart/CartSidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown'
import { cn } from '../lib/utils'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export function LandingPageHorizontal() {
  const { addToCart, cart } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { currentLanguage, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      if (!container) return

      // Enhanced horizontal scroll with 3D transforms and parallax
      const sections = gsap.utils.toArray('.horizontal-section')
      const totalSections = sections.length
      
      if (sections.length > 0) {
        // Main horizontal scroll with perspective
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            snap: {
              snapTo: 1 / (sections.length - 1),
              duration: 0.8,
              delay: 0.2,
              ease: 'power2.inOut'
            },
            end: () => "+=" + (sections.length * window.innerWidth),
            onUpdate: (self) => {
              // Dynamic section transformations during scroll
              sections.forEach((section, index) => {
                const progress = self.progress * (sections.length - 1) - index
                const absProgress = Math.abs(progress)
                
                // 3D rotation and scale effects
                gsap.set(section, {
                  rotationY: progress * 15,
                  rotationX: progress * 5,
                  scale: 1 - absProgress * 0.1,
                  z: -absProgress * 100,
                  filter: `blur(${absProgress * 2}px) brightness(${1 - absProgress * 0.3})`
                })
                
                // Parallax for section content
                const content = section.querySelector('.section-content')
                if (content) {
                  gsap.set(content, {
                    y: progress * 50,
                    rotationX: -progress * 10
                  })
                }
                
                // Dynamic particle movement
                const particles = section.querySelectorAll('.dynamic-particle')
                particles.forEach((particle, pIndex) => {
                  gsap.set(particle, {
                    x: Math.sin(self.progress * Math.PI * 2 + pIndex) * 100,
                    y: Math.cos(self.progress * Math.PI * 2 + pIndex) * 50,
                    rotation: self.progress * 360 + pIndex * 45,
                    scale: 0.5 + Math.sin(self.progress * Math.PI * 4 + pIndex) * 0.5
                  })
                })
              })
            }
          }
        })
        
        // Advanced parallax backgrounds
        sections.forEach((section, index) => {
          const bg = section.querySelector('.parallax-bg')
          if (bg) {
            gsap.to(bg, {
              xPercent: -50 * (index + 1),
              yPercent: -20,
              scale: 1.2,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
              }
            })
          }
        })
      }

      // Spectacular navbar entrance with morphing effect
      gsap.timeline()
        .from('.navbar-container', {
          duration: 1.5,
          y: -200,
          opacity: 0,
          scale: 0.8,
          rotationX: -90,
          transformOrigin: 'top center',
          ease: 'elastic.out(1, 0.5)'
        })
        .from('.nav-item', {
          duration: 0.8,
          x: -100,
          opacity: 0,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }, '-=1')

      // Epic hero section with cinematic entrance
      const heroTl = gsap.timeline()
      
      heroTl
        .from('.hero-title', { 
          duration: 2.5, 
          y: 200, 
          opacity: 0, 
          scale: 0.5,
          rotationX: 90,
          rotationY: 45,
          transformOrigin: 'center bottom',
          ease: 'elastic.out(1, 0.3)' 
        })
        .from('.hero-subtitle', { 
          duration: 2, 
          y: 150, 
          opacity: 0, 
          scale: 0.7,
          rotationX: 45,
          ease: 'power4.out',
          stagger: {
            amount: 0.5,
            from: 'start'
          }
        }, '-=1.5')
        .from('.hero-buttons', { 
          duration: 1.5, 
          y: 100, 
          opacity: 0, 
          scale: 0.3,
          rotation: 180,
          stagger: 0.3,
          ease: 'elastic.out(1.2, 0.4)' 
        }, '-=1')
        .from('.hero-image', { 
          duration: 3, 
          scale: 0.3, 
          opacity: 0, 
          rotation: 360,
          x: 300,
          ease: 'power3.out',
          transformOrigin: 'center center'
        }, '-=2')
        
      // Continuous floating and rotation for hero image
      gsap.to('.hero-image img', {
        duration: 4,
        y: -30,
        rotation: 5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      })

      // Advanced particle system with physics
      gsap.set('.dynamic-particle', {
        opacity: 0,
        scale: 0,
        x: 'random(-300, 300)',
        y: 'random(-300, 300)',
        rotation: 'random(0, 360)'
      })
      
      // Orbital particle movement
      gsap.to('.dynamic-particle', {
        duration: 'random(5, 10)',
        opacity: 'random(0.4, 1)',
        scale: 'random(0.3, 2)',
        rotation: '+=360',
        ease: 'none',
        repeat: -1,
        stagger: {
          amount: 5,
          from: 'random',
          repeat: -1
        },
        motionPath: {
          path: 'M0,0 Q100,-100 200,0 T400,0',
          autoRotate: true
        }
      })

      // Magical sparkles with morphing
      gsap.set('.magic-sparkle', {
        scale: 0,
        opacity: 0,
        rotation: 'random(0, 360)'
      })

      gsap.to('.magic-sparkle', {
        scale: 'random(0.5, 3)',
        opacity: 'random(0.5, 1)',
        rotation: '+=720',
        duration: 'random(2, 5)',
        ease: 'elastic.inOut(1, 0.3)',
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 4,
          repeat: -1,
          from: 'random'
        },
        transformOrigin: 'center center'
      })
      
      // Interactive cursor following particles
      document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.cursor-particle')
        particles.forEach((particle, index) => {
          gsap.to(particle, {
            duration: 0.5 + index * 0.1,
            x: e.clientX + Math.sin(index) * 50,
            y: e.clientY + Math.cos(index) * 50,
            ease: 'power2.out'
          })
        })
      })

      // Morphing background gradients
      gsap.to('.gradient-morph', {
        duration: 8,
        backgroundPosition: '200% 200%',
        ease: 'none',
        repeat: -1,
        yoyo: true
      })
      
      // Section-specific animations
      sections.forEach((section, index) => {
        // Staggered content entrance per section
        const sectionContent = section.querySelectorAll('.animate-on-view')
        gsap.set(sectionContent, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotation: 15
        })
        
        ScrollTrigger.create({
          trigger: section,
          start: 'left center',
          end: 'right center',
          onEnter: () => {
            gsap.to(sectionContent, {
              duration: 1.5,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              stagger: 0.2,
              ease: 'elastic.out(1, 0.5)'
            })
          }
        })
      })
      
      // Immersive scroll progress indicator
      const progressBar = document.querySelector('.scroll-progress')
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
          }
        })
      }

    }, containerRef)

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

  const languages = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
  ]

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* Section Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
        {[...Array(6)].map((_, i) => (
          <button
            key={i}
            className="w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 hover:bg-blue-500 transition-all duration-300 hover:scale-125"
            onClick={() => {
              const section = document.querySelector(`.horizontal-section:nth-child(${i + 1})`)
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', inline: 'start' })
              }
            }}
          />
        ))}
      </div>

      {/* Immersive Scroll Progress */}
      <div className="fixed top-20 left-0 w-full h-1 bg-surface/30 backdrop-blur-sm z-40">
        <div className="scroll-progress h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left scale-x-0 rounded-full shadow-lg"></div>
      </div>
      
      {/* Cursor Following Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="cursor-particle fixed w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full pointer-events-none z-30 mix-blend-screen"
          style={{
            left: '-10px',
            top: '-10px',
            filter: `blur(${i * 0.5}px)`,
            opacity: 1 - i * 0.1
          }}
        />
      ))}
      
      {/* Horizontal Scroll Container with 3D Perspective */}
      <div ref={containerRef} className="h-screen overflow-hidden perspective-1000" style={{ perspective: '1000px' }}>
        <div className="flex h-full w-[600vw] preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Section 1: Hero */}
          <section className="horizontal-section w-screen h-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Dynamic Theme-Aware Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-100/80 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 transition-colors duration-700"></div>
            {/* Advanced Particle System */}
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="dynamic-particle absolute w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(45deg, hsl(${i * 15}, 70%, 60%), hsl(${(i * 15) + 60}, 70%, 60%))`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  filter: `blur(${Math.random() * 2}px)`
                }}
              />
            ))}
            
            {/* Magic Sparkles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="magic-sparkle absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {['✨', '🌟', '💫', '⭐', '🔥'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
            
            {/* Gradient Morphing Background */}
            <div className="gradient-morph absolute inset-0 opacity-30"
                 style={{
                   background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
                   backgroundSize: '400% 400%',
                 }}>
            </div>
            
            <div className="section-content container mx-auto px-4 relative z-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left animate-on-view">
                  <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6">
                    <span className="text-foreground">
                      {t("hero.perfectChairsFor")}
                    </span>
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                      {t("hero.perfectMoments")} ✨
                    </span>
                  </h1>
                  <p className="hero-subtitle text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed px-4 lg:px-0 font-medium">
                    Discover our premium collection of ergonomic, stylish, and comfortable chairs 
                    designed to elevate your space and enhance your comfort.
                  </p>
                  <div className="hero-buttons flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                    <Link to="/products" className="w-full sm:w-auto group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                          <span>🛒 {t("common.shopNow")}</span>
                          <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </Link>
                    <div className="relative group">
                      <button className="bg-background/80 backdrop-blur-sm border-2 border-border text-foreground text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto group-hover:border-purple-400">
                        <span>👀 {t("common.viewCollection")}</span>
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

          {/* Section 2: Stats */}
          <section className="horizontal-section w-screen h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-slate-900 text-white relative overflow-hidden">
            {/* Theme transition overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-blue-800/90 dark:from-blue-800/90 dark:via-blue-900/90 dark:to-slate-900/90 transition-all duration-700"></div>
            <div className="container mx-auto px-4 text-center relative z-20">
              <h2 className="animate-in text-4xl font-bold mb-12 text-white">{t("stats.trustedByThousands")}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="animate-in text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">10K+</div>
                  <p className="text-gray-300">Happy Customers</p>
                </div>
                <div className="animate-in text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">500+</div>
                  <p className="text-gray-300">Chair Models</p>
                </div>
                <div className="animate-in text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">15+</div>
                  <p className="text-gray-300">Years Experience</p>
                </div>
                <div className="animate-in text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-2">99%</div>
                  <p className="text-gray-300">Satisfaction</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Featured Products */}
          <section className="horizontal-section w-screen h-full flex items-center justify-center bg-surface relative overflow-hidden">
            {/* Theme-aware background layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-950/30 transition-colors duration-700"></div>
            <div className="container mx-auto px-4 relative z-20">
              <div className="text-center mb-12">
                <h2 className="animate-in text-4xl font-bold text-foreground mb-4">Featured Chairs</h2>
                <p className="animate-in text-xl text-muted-foreground">Discover our most popular chairs</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {featuredChairs.map((chair, index) => (
                  <Card key={chair.id} className="animate-in overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={chair.image}
                        alt={chair.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{chair.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-card-foreground mb-2">{chair.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{chair.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">${chair.price}</span>
                        <span className="text-sm text-muted-foreground">({chair.reviews} {t("common.reviews")})</span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleAddToCart(chair)}
                      >
                        {t("common.addToCart")}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Features */}
          <section className="horizontal-section w-screen h-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Dynamic feature section background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-purple-50/80 dark:from-gray-900/90 dark:via-blue-950/30 dark:to-purple-950/30 transition-colors duration-700"></div>
            <div className="container mx-auto px-4 text-center relative z-20">
              <h2 className="animate-in text-4xl font-bold text-foreground mb-12">Why Choose ChairGo? ✨</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="animate-in text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">🏆 Premium Quality</h3>
                  <p className="text-muted-foreground">Every chair is crafted with the finest materials</p>
                </div>
                <div className="animate-in text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">🚚 Free Delivery</h3>
                  <p className="text-muted-foreground">Complimentary delivery and setup service</p>
                </div>
                <div className="animate-in text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">🛡️ 5-Year Warranty</h3>
                  <p className="text-muted-foreground">Comprehensive warranty coverage</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Testimonials */}
          <section className="horizontal-section w-screen h-full flex items-center justify-center bg-surface relative overflow-hidden">
            {/* Testimonials theme background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-indigo-950/30 transition-colors duration-700"></div>
            <div className="container mx-auto px-4 text-center relative z-20">
              <h2 className="animate-in text-4xl font-bold text-foreground mb-12">{t("testimonials.title")}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sarah Chen",
                    role: "Interior Designer", 
                    content: "ChairGo has the most comfortable and stylish chairs I've ever used!",
                    rating: 5,
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b302?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  },
                  {
                    name: "Mike Johnson",
                    role: "Office Manager",
                    content: "We furnished our entire office with ChairGo chairs. Outstanding quality!",
                    rating: 5,
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  },
                  {
                    name: "Lisa Wang",
                    role: "Home Owner",
                    content: "The dining chairs transformed our dining room. Excellent craftsmanship!",
                    rating: 5,
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="animate-in p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                        <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6: Call to Action */}
          <section className="horizontal-section w-screen h-full flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-700 dark:via-purple-700 dark:to-blue-700 text-white relative overflow-hidden">
            {/* CTA theme overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-blue-600/95 dark:from-blue-700/95 dark:via-purple-700/95 dark:to-blue-700/95 transition-all duration-700"></div>
            <div className="container mx-auto px-4 text-center relative z-20">
              <h2 className="animate-in text-5xl font-bold mb-6">{t("cta.title")} 🚀</h2>
              <p className="animate-in text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and transform your space today
              </p>
              <div className="animate-in flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                    {t("common.browseCollection")} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                  {t("common.contactUs")}
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  )
}