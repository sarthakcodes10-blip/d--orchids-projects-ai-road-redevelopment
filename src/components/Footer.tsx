import { Route, Mail, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Route className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">RoadVision<span className="text-primary">AI</span></span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Transforming urban infrastructure with AI-powered visualization. See the future of your streets before construction begins.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Features</h4>
            <ul className="space-y-2">
              <li><Link href="/redevelop" className="text-foreground/80 hover:text-primary transition-colors">Road Redevelopment</Link></li>
              <li><Link href="/pothole-detection" className="text-foreground/80 hover:text-primary transition-colors">Pothole Detection</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Support & Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:workwithsarthaksrivastava@gmail.com" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/Sarthak_srivastava10" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/sarthak-srivastava-66249229a" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RoadVision AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}