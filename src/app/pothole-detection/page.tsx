"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FileUpload } from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ScanSearch, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Video,
  Target,
  BarChart3,
  MapPin,
  AlertCircle,
  Info,
  FileText
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { jsPDF } from "jspdf"

interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  xPercent: number
  yPercent: number
  widthPercent: number
  heightPercent: number
}

interface DetectedPothole {
  id: number
  severity: "low" | "medium" | "high" | "critical"
  size: string
  location: string
  confidence: number
  bbox?: BoundingBox
}

const severityColors = {
  low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  critical: "bg-red-700/20 text-red-300 border-red-700/30"
}

const severityBorderColors = {
  low: "#eab308",
  medium: "#f97316",
  high: "#ef4444",
  critical: "#dc2626"
}

const severityLabels = {
  low: "Minor",
  medium: "Moderate",
  high: "Severe",
  critical: "Critical"
}

export default function PotholeDetectionPage() {
  const [activeTab, setActiveTab] = useState("image")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")
  const [detectionComplete, setDetectionComplete] = useState(false)
  const [detectedPotholes, setDetectedPotholes] = useState<DetectedPothole[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    setDetectionComplete(false)
    setDetectedPotholes([])
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
    setDetectionComplete(false)
    setDetectedPotholes([])
    setProgress(0)
    setError(null)
  }, [preview])

  const handleProcess = async () => {
    if (!file) return
    
    setIsProcessing(true)
    setProgress(0)
    setError(null)
    
    const steps = [
      { progress: 15, message: "Uploading image..." },
      { progress: 35, message: "Running AI detection model..." },
      { progress: 60, message: "Analyzing pothole features..." },
      { progress: 85, message: "Calculating severity levels..." },
      { progress: 95, message: "Generating report..." }
    ]
    
    let stepIndex = 0
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProgress(steps[stepIndex].progress)
        setProgressMessage(steps[stepIndex].message)
        stepIndex++
      }
    }, 800)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/detect-potholes", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (data.success) {
        setProgress(100)
        setProgressMessage("Detection complete!")
        setDetectedPotholes(data.potholes)
        setDetectionComplete(true)
      } else if (data.fallback) {
        setError("AI detection service unavailable. Please configure ROBOFLOW_API_KEY in environment variables.")
      } else {
        setError(data.error || "Detection failed. Please try again.")
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError("Failed to process image. Please try again.")
      console.error("Detection error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadReport = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    doc.setFillColor(16, 185, 129)
    doc.rect(0, 0, pageWidth, 45, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("Pothole Detection Report", margin, 28)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 38)

    yPos = 60

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Detection Summary", margin, yPos)
    yPos += 10

    doc.setFillColor(249, 250, 251)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F')

    const boxWidth = (pageWidth - 2 * margin) / 4
    const summaryData = [
      { label: "Total", value: detectedPotholes.length.toString(), color: [16, 185, 129] },
      { label: "Critical", value: criticalCount.toString(), color: [185, 28, 28] },
      { label: "Severe", value: highCount.toString(), color: [239, 68, 68] },
      { label: "Moderate", value: mediumCount.toString(), color: [249, 115, 22] },
    ]

    summaryData.forEach((item, index) => {
      const xPos = margin + (index * boxWidth) + boxWidth / 2
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(item.color[0], item.color[1], item.color[2])
      doc.text(item.value, xPos, yPos + 18, { align: "center" })
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(107, 114, 128)
      doc.text(item.label, xPos, yPos + 28, { align: "center" })
    })

    yPos += 50

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Detected Potholes", margin, yPos)
    yPos += 8

    if (detectedPotholes.length === 0) {
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(107, 114, 128)
      doc.text("No potholes detected in this image.", margin, yPos + 10)
    } else {
      doc.setFillColor(243, 244, 246)
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F')
      
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(55, 65, 81)
      doc.text("ID", margin + 5, yPos + 7)
      doc.text("Severity", margin + 30, yPos + 7)
      doc.text("Size", margin + 70, yPos + 7)
      doc.text("Location", margin + 110, yPos + 7)
      doc.text("Confidence", pageWidth - margin - 25, yPos + 7)
      
      yPos += 12

      detectedPotholes.forEach((pothole, index) => {
        if (yPos > pageHeight - 40) {
          doc.addPage()
          yPos = margin
        }

        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251)
          doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 12, 'F')
        }

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)
        doc.text(`#${pothole.id}`, margin + 5, yPos + 4)

        const severityColors: Record<string, number[]> = {
          critical: [185, 28, 28],
          high: [239, 68, 68],
          medium: [249, 115, 22],
          low: [234, 179, 8]
        }
        const color = severityColors[pothole.severity] || [0, 0, 0]
        doc.setTextColor(color[0], color[1], color[2])
        doc.setFont("helvetica", "bold")
        doc.text(severityLabels[pothole.severity], margin + 30, yPos + 4)

        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.text(pothole.size, margin + 70, yPos + 4)
        doc.text(pothole.location, margin + 110, yPos + 4)

        doc.setTextColor(16, 185, 129)
        doc.setFont("helvetica", "bold")
        doc.text(`${pothole.confidence}%`, pageWidth - margin - 25, yPos + 4)

        yPos += 12
      })
    }

    yPos += 15

    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = margin
    }

    doc.setFillColor(240, 253, 244)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, 'F')
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, 'S')

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(16, 185, 129)
    doc.text("Recommendations", margin + 8, yPos + 12)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(55, 65, 81)

    let recommendation = "No immediate action required. Continue routine monitoring."
    if (criticalCount > 0) {
      recommendation = "URGENT: Critical potholes detected. Immediate repair required to prevent accidents."
    } else if (highCount > 0) {
      recommendation = "High priority repairs needed. Schedule maintenance within the next week."
    } else if (mediumCount > 0) {
      recommendation = "Moderate damage detected. Plan repairs within the next month."
    } else if (lowCount > 0) {
      recommendation = "Minor damage detected. Include in next scheduled maintenance cycle."
    }

    const splitRecommendation = doc.splitTextToSize(recommendation, pageWidth - 2 * margin - 16)
    doc.text(splitRecommendation, margin + 8, yPos + 24)

    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text("RoadVision AI - Powered by Advanced Computer Vision", pageWidth / 2, pageHeight - 10, { align: "center" })

    doc.save(`pothole-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const isVideo = file?.type.startsWith("video/")
  
  const criticalCount = detectedPotholes.filter(p => p.severity === "critical").length
  const highCount = detectedPotholes.filter(p => p.severity === "high").length
  const mediumCount = detectedPotholes.filter(p => p.severity === "medium").length
  const lowCount = detectedPotholes.filter(p => p.severity === "low").length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <ScanSearch className="w-4 h-4" />
              AI Pothole Detection
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Detect Road Damage with <span className="text-accent">Precision AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload road images or videos and let our AI identify potholes, cracks, and surface damage 
              with detailed severity analysis.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Upload Road for Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload an image or video of a road to detect potholes and damage
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

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="bg-card border-border">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-accent animate-spin" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Scanning for potholes...</p>
                            <p className="text-sm text-muted-foreground">
                              {progressMessage || "AI is analyzing road surface conditions"}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-accent">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {detectionComplete && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <Card className="bg-card border-border overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                          Detection Complete
                        </CardTitle>
                        <CardDescription>
                          {detectedPotholes.length > 0 
                            ? `Found ${detectedPotholes.length} pothole${detectedPotholes.length !== 1 ? 's' : ''} in the uploaded road`
                            : "No potholes detected in this image"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden">
                          <img 
                            src={preview || ""} 
                            alt="Analyzed road" 
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute inset-0 pointer-events-none">
                            {detectedPotholes.map((pothole) => (
                              pothole.bbox && (
                                <div
                                  key={pothole.id}
                                  className="absolute border-2 rounded"
                                  style={{
                                    left: `${pothole.bbox.xPercent}%`,
                                    top: `${pothole.bbox.yPercent}%`,
                                    width: `${pothole.bbox.widthPercent}%`,
                                    height: `${pothole.bbox.heightPercent}%`,
                                    borderColor: severityBorderColors[pothole.severity],
                                    boxShadow: `0 0 8px ${severityBorderColors[pothole.severity]}40`,
                                  }}
                                >
                                  <span 
                                    className="absolute -top-5 left-0 text-xs px-1.5 py-0.5 rounded font-medium"
                                    style={{ 
                                      backgroundColor: severityBorderColors[pothole.severity],
                                      color: 'white'
                                    }}
                                  >
                                    #{pothole.id} {pothole.confidence}%
                                  </span>
                                </div>
                              )
                            ))}
                          </div>
                          <div className="absolute top-3 right-3 px-3 py-1.5 bg-accent/90 rounded-md text-white text-sm font-medium">
                            {detectedPotholes.length} Detected
                          </div>
                        </div>

                        {detectedPotholes.length > 0 && (
                          <div className="grid grid-cols-4 gap-3">
                            <div className="text-center p-3 rounded-xl bg-red-700/10 border border-red-700/20">
                              <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
                              <p className="text-xs text-muted-foreground">Critical</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                              <p className="text-2xl font-bold text-red-400">{highCount}</p>
                              <p className="text-xs text-muted-foreground">Severe</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                              <p className="text-2xl font-bold text-orange-400">{mediumCount}</p>
                              <p className="text-xs text-muted-foreground">Moderate</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                              <p className="text-2xl font-bold text-yellow-400">{lowCount}</p>
                              <p className="text-xs text-muted-foreground">Minor</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleDownloadReport}
                            size="lg"
                            className="flex-1 gap-2 bg-accent hover:bg-accent/90"
                            disabled={detectedPotholes.length === 0}
                          >
                            <FileText className="w-4 h-4" />
                            Download PDF Report
                          </Button>
                          <Button 
                            onClick={handleClear}
                            variant="outline"
                            size="lg"
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            New Scan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {detectedPotholes.length > 0 && (
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            Detected Potholes Detail
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {detectedPotholes.map((pothole) => (
                              <div 
                                key={pothole.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border"
                              >
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                  <AlertCircle className={`w-5 h-5 ${
                                    pothole.severity === "critical" ? "text-red-400" :
                                    pothole.severity === "high" ? "text-red-400" :
                                    pothole.severity === "medium" ? "text-orange-400" :
                                    "text-yellow-400"
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">Pothole #{pothole.id}</span>
                                    <Badge variant="outline" className={severityColors[pothole.severity]}>
                                      {severityLabels[pothole.severity]}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Target className="w-3 h-3" />
                                      {pothole.size}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {pothole.location}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-accent">{pothole.confidence}%</p>
                                  <p className="text-xs text-muted-foreground">Confidence</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <Button 
                onClick={handleProcess}
                disabled={!file || isProcessing}
                size="lg"
                className="w-full h-14 text-base gap-2 bg-accent hover:bg-accent/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ScanSearch className="w-5 h-5" />
                    Start Detection
                  </>
                )}
              </Button>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-accent" />
                    Detection Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Potholes", desc: "Surface depressions & holes" },
                    { label: "Cracks", desc: "Linear & alligator patterns" },
                    { label: "Rutting", desc: "Wheel path deformations" },
                    { label: "Patches", desc: "Previous repair areas" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Severity Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { level: "Critical", color: "bg-red-700", desc: "Immediate repair needed" },
                    { level: "Severe", color: "bg-red-500", desc: "High priority repair" },
                    { level: "Moderate", color: "bg-orange-500", desc: "Schedule for repair" },
                    { level: "Minor", color: "bg-yellow-500", desc: "Monitor condition" },
                  ].map((item) => (
                    <div key={item.level} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.level}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">AI-Powered Detection</p>
                      <p className="text-xs text-muted-foreground">
                        Powered by Roboflow computer vision model trained specifically for pothole detection.
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