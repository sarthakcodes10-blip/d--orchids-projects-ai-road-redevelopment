"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail, Code2, Lightbulb, Target } from "lucide-react"
import { motion } from "framer-motion"

const developers = [
  {
    name: "Sarthak Srivastava",
    role: "Developer",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Website-1-1765460238919.png?width=8000&height=8000&resize=contain",
    bio: "Sarthak is a third-year engineering student with a strong interest in technology, problem-solving, and practical application of concepts. He has built a solid grasp of core engineering subjects while actively exploring new tools, projects, and technical domains to strengthen his skills. Known for his curiosity and consistent work ethic, he approaches challenges with clarity and a forward-focused mindset. Sarthak is committed to expanding his technical proficiency and gaining meaningful hands-on experience. He aims to build a career that allows him to contribute to impactful technological solutions while continually learning and improving in a rapidly evolving field.",
    traits: [
      { icon: Code2, label: "Problem Solver" },
      { icon: Lightbulb, label: "Curious Learner" },
      { icon: Target, label: "Goal Oriented" }
    ]
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Meet the <span className="text-primary">Developer</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate minds behind RoadVision AI, working to transform urban infrastructure through technology.
            </p>
          </motion.div>

          <div className="space-y-8">
            {developers.map((developer, index) => (
              <motion.div
                key={developer.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden bg-card border-border">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white/10 shadow-xl mb-4">
                          <img
                            src={developer.image}
                            alt={developer.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h2 className="text-2xl font-bold text-center">{developer.name}</h2>
                        <p className="text-primary font-medium">{developer.role}</p>
                        
                        <div className="flex gap-3 mt-4">
                          {developer.traits.map((trait) => {
                            const Icon = trait.icon
                            return (
                              <div
                                key={trait.label}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 text-xs font-medium"
                              >
                                <Icon className="w-3.5 h-3.5 text-primary" />
                                {trait.label}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                        <h3 className="text-lg font-semibold mb-3 text-primary">About</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {developer.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}