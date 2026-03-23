"use client"

import { useState, useCallback, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FileUpload } from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Wand2, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Lamp,
  TrafficCone,
  Footprints,
  Trash2,
  Droplets,
  PaintBucket,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Video,
  ArrowLeftRight,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const improvements = [
  { icon: PaintBucket, label: "Road Surface", description: "Smooth asphalt repair" },
  { icon: Lamp, label: "Street Lamps", description: "Modern LED lighting" },
  { icon: Footprints, label: "Footpaths", description: "Pedestrian walkways" },
  { icon: Trash2, label: "Dustbins", description: "Waste management" },
  { icon: TrafficCone, label: "Road Markings", description: "Lane dividers & signs" },
  { icon: Droplets, label: "Drainage", description: "Proper water flow" },
]

export default function RedevelopPage() {
  const [activeTab, setActiveTab] = useState("image")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>(
    improvements.map(i => i.label)
  )

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    setError(null)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }, [])

  const handleClear = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setFile(null)
    setPreview(null)
    setResult(null)
    setProgress(0)
    setError(null)
  }, [preview])

  const toggleImprovement = (label: string) => {
    setSelectedImprovements(prev => 
      prev.includes(label) 
        ? prev.filter(i => i !== label)
        : [...prev, label]
    )
  }

  const handleProcess = async () => {
    if (!file) return
    
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    
    const steps = [
      { progress: 10, message: "Analyzing road conditions..." },
      { progress: 25, message: "Detecting infrastructure elements..." },
      { progress: 40, message: "Preparing AI generation..." },
      { progress: 60, message: "Generating redeveloped road visualization..." },
      { progress: 80, message: "Applying improvements..." },
      { progress: 95, message: "Finalizing image..." }
    ]
    
    let stepIndex = 0
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProgress(steps[stepIndex].progress)
        setProgressMessage(steps[stepIndex].message)
        stepIndex++
      }
    }, 2000)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("improvements", JSON.stringify(selectedImprovements))

      const response = await fetch("/api/generate-road", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        let message = "Failed to generate image"
        try {
          const err = await response.json()
          if (typeof err?.error === "string" && err.error.trim()) {
            message = err.error
          }
        } catch {
          // ignore
        }
        throw new Error(message)
      }

      const data = await response.json()

      if (data.success && data.imageUrl) {
        setProgress(100)
        setProgressMessage("Complete!")
        setResult(data.imageUrl)
      } else {
        throw new Error(data.error || "Failed to generate image")
      }
    } catch (err) {
      clearInterval(progressInterval)
      const message = err instanceof Error && err.message ? err.message : "Failed to generate image. Please try again."
      setError(message)
      console.error("Generation error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const link = document.createElement("a")
    link.href = result
    link.download = "redeveloped-road.jpg"
    link.click()
  }

  const isVideo = file?.type.startsWith("video/")

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Wand2 className="w-4 h-4" />
              AI Road Redevelopment
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Transform Any Road with <span className="text-primary">AI Vision</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload a road image or video and watch our AI visualize complete infrastructure redevelopment 
              with modern amenities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Upload Your Road
                  </CardTitle>
                  <CardDescription>
                    Upload an image or video of a road that needs redevelopment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="image" className="gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Image
                      </TabsTrigger>
                      <TabsTrigger value="video" className="gap-2">
                        <Video className="w-4 h-4" />
                        Video
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="image">
                      <FileUpload
                        accept="image/*,.jpg,.jpeg,.png,.webp"
                        maxSize={20}
                        onFileSelect={handleFileSelect}
                        onClear={handleClear}
                        preview={!isVideo ? preview : null}
                        label="Upload Road Image"
                        description="JPG, PNG, or WebP up to 20MB"
                        isVideo={false}
                      />
                    </TabsContent>
                    
                    <TabsContent value="video">
                      <FileUpload
                        accept="video/*,.mp4,.mov,.webm"
                        maxSize={100}
                        onFileSelect={handleFileSelect}
                        onClear={handleClear}
                        preview={isVideo ? preview : null}
                        label="Upload Road Video"
                        description="MP4, MOV, or WebM up to 100MB"
                        isVideo={true}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="bg-destructive/10 border-destructive/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          <p className="text-destructive">{error}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="bg-card border-border">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Generating AI Visualization...</p>
                            <p className="text-sm text-muted-foreground">
                              {progressMessage || "AI is creating your redeveloped road"}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-primary">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {result && !isProcessing && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="bg-card border-border overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          Redevelopment Complete
                        </CardTitle>
                        <CardDescription>
                          AI has generated a visualization of your redeveloped road
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="relative rounded-xl overflow-hidden">
                            <img 
                              src={preview || ""} 
                              alt="Before" 
                              className="w-full aspect-video object-cover"
                            />
                            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-destructive/90 rounded-md text-white text-sm font-medium">
                              Before
                            </div>
                          </div>
                          <div className="relative rounded-xl overflow-hidden">
                            <img 
                              src={result} 
                              alt="After" 
                              className="w-full aspect-video object-cover"
                            />
                            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-primary/90 rounded-md text-primary-foreground text-sm font-medium">
                              AI Generated
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 py-2">
                          <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Before & AI Generated Comparison</span>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleDownload}
                            size="lg"
                            className="flex-1 gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Result
                          </Button>
                          <Button 
                            onClick={handleClear}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            New Upload
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Improvements to Apply</CardTitle>
                  <CardDescription>
                    Select which infrastructure upgrades to visualize
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {improvements.map((item) => {
                      const Icon = item.icon
                      const isSelected = selectedImprovements.includes(item.label)
                      return (
                        <button
                          key={item.label}
                          onClick={() => toggleImprovement(item.label)}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            isSelected 
                              ? "border-primary bg-primary/10" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <p className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleProcess}
                disabled={!file || isProcessing || selectedImprovements.length === 0}
                size="lg"
                className="w-full h-14 text-base gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Redevelopment
                  </>
                )}
              </Button>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">AI-Powered Generation</p>
                      <p className="text-xs text-muted-foreground">
                        Our AI generates unique road visualizations each time based on your selected improvements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}