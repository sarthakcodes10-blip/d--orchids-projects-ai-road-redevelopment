"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { 
  Route, 
  ScanSearch, 
  Sparkles, 
  Upload, 
  Wand2, 
  Download,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Route,
    title: "Smart Road Redesign",
    description: "Upload any road image and watch AI transform it with modern infrastructure including proper drainage, street lamps, and road markings.",
    color: "from-primary to-emerald-400"
  },
  {
    icon: ScanSearch,
    title: "Pothole Detection",
    description: "Advanced AI analyzes road surfaces to detect and highlight potholes, cracks, and surface damage with precision accuracy.",
    color: "from-accent to-blue-400"
  },
  {
    icon: Sparkles,
    title: "Instant Visualization",
    description: "See the future of your streets in seconds. Our AI generates photorealistic renders of redeveloped infrastructure.",
    color: "from-violet-500 to-purple-400"
  }
]

const stats = [
  { value: "10K+", label: "Roads Analyzed" },
  { value: "98%", label: "Detection Accuracy" },
  { value: "50+", label: "Cities Using" },
  { value: "24/7", label: "AI Processing" }
]

const steps = [
  { icon: Upload, title: "Upload", description: "Drop your road image or video" },
  { icon: Wand2, title: "Process", description: "AI analyzes and transforms" },
  { icon: Download, title: "Download", description: "Get your enhanced result" }
]

const benefits = [
  { icon: Zap, title: "Lightning Fast", description: "Results in under 30 seconds" },
  { icon: Shield, title: "Privacy First", description: "Your data is never stored" },
  { icon: Globe, title: "Works Globally", description: "Any road, any country" }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Infrastructure Planning
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Transform Your Roads with
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Intelligent AI Vision
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Visualize road redevelopment before breaking ground. Detect potholes instantly. 
                Plan smarter infrastructure with cutting-edge AI technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/redevelop">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base gap-2 bg-primary hover:bg-primary/90">
                    <Route className="w-5 h-5" />
                    Start Redevelopment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pothole-detection">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base gap-2">
                    <ScanSearch className="w-5 h-5" />
                    Detect Potholes
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-16 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary via-card to-secondary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-4xl">
                      <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
                        <img 
                          src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80" 
                          alt="Before - Damaged road"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-destructive/90 rounded-md text-white text-sm font-medium">
                          Before
                        </div>
                      </div>
                      <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
                        <img 
                          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80" 
                          alt="After - Modern road"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-primary/90 rounded-md text-primary-foreground text-sm font-medium">
                          After AI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>

        <section className="py-16 border-y border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful AI Features</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Advanced machine learning algorithms designed specifically for urban infrastructure analysis
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full bg-card hover:bg-card/80 transition-colors border-border group">
                      <CardContent className="pt-6">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-card/50 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Three simple steps to transform your road infrastructure visualization
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Built for Urban Planners & 
                  <span className="text-primary"> City Officials</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Whether you're planning city-wide infrastructure upgrades or identifying maintenance priorities, 
                  RoadVision AI provides the visual insights you need to make informed decisions.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Generate photorealistic before/after comparisons",
                    "Identify all road defects in a single scan",
                    "Export high-resolution renders for presentations",
                    "Process multiple roads in batch mode"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Link href="/redevelop">
                    <Button size="lg" className="h-12 px-8 gap-2">
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon
                    return (
                      <Card key={benefit.title} className={`bg-card border-border ${index === 2 ? 'col-span-2' : ''}`}>
                        <CardContent className="pt-6">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <h4 className="font-semibold mb-1">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Transform Your Infrastructure?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of urban planners and city officials who are already using RoadVision AI 
                to visualize the future of their roads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/redevelop">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-base gap-2">
                    <Wand2 className="w-5 h-5" />
                    Start AI Redevelopment
                  </Button>
                </Link>
                <Link href="/pothole-detection">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-base gap-2">
                    <ScanSearch className="w-5 h-5" />
                    Try Pothole Detection
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}