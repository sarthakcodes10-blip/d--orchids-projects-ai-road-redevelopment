"use client"

import { useCallback, useState } from "react"
import { Upload, X, Image as ImageIcon, Video, FileWarning } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  accept: string
  maxSize?: number
  onFileSelect: (file: File) => void
  onClear?: () => void
  preview?: string | null
  className?: string
  label?: string
  description?: string
  isVideo?: boolean
}

export function FileUpload({
  accept,
  maxSize = 50,
  onFileSelect,
  onClear,
  preview,
  className,
  label = "Upload File",
  description = "Drag and drop or click to browse",
  isVideo = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): boolean => {
    setError(null)
    
    const acceptedTypes = accept.split(",").map(t => t.trim())
    const fileType = file.type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
    
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith(".")) {
        return fileExtension === type.toLowerCase()
      }
      if (type.endsWith("/*")) {
        return fileType.startsWith(type.replace("/*", "/"))
      }
      return fileType === type
    })
    
    if (!isValidType) {
      setError("Invalid file type. Please upload an image or video file.")
      return false
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit.`)
      return false
    }
    
    return true
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
    e.target.value = ""
  }, [onFileSelect])

  const handleClear = useCallback(() => {
    setError(null)
    onClear?.()
  }, [onClear])

  if (preview) {
    return (
      <div className={cn("relative rounded-xl overflow-hidden border border-border bg-card", className)}>
        {isVideo ? (
          <video 
            src={preview} 
            controls 
            className="w-full aspect-video object-contain bg-black"
          />
        ) : (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full aspect-video object-contain bg-black/50"
          />
        )}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3"
          onClick={handleClear}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          error && "border-destructive bg-destructive/5"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
            isDragging ? "bg-primary/20" : "bg-muted"
          )}>
            {error ? (
              <FileWarning className="w-8 h-8 text-destructive" />
            ) : isVideo ? (
              <Video className={cn("w-8 h-8", isDragging ? "text-primary" : "text-muted-foreground")} />
            ) : (
              <ImageIcon className={cn("w-8 h-8", isDragging ? "text-primary" : "text-muted-foreground")} />
            )}
          </div>
          
          <div>
            <p className="font-semibold text-lg mb-1">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">Max file size: {maxSize}MB</p>
          </div>
          
          <Button variant="outline" size="lg" className="gap-2 pointer-events-none">
            <Upload className="w-4 h-4" />
            Choose File
          </Button>
        </div>
      </label>
      
      {error && (
        <p className="text-sm text-destructive mt-2 flex items-center gap-2">
          <FileWarning className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
