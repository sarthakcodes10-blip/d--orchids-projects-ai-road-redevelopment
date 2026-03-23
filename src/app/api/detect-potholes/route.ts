import { NextRequest, NextResponse } from "next/server"

interface RoboflowPrediction {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[]
  time: number
  image: {
    width: number
    height: number
  }
}

function getSeverity(width: number, height: number, imageWidth: number, imageHeight: number): "low" | "medium" | "high" | "critical" {
  const relativeSize = (width * height) / (imageWidth * imageHeight)
  
  if (relativeSize > 0.05) return "critical"
  if (relativeSize > 0.02) return "high"
  if (relativeSize > 0.008) return "medium"
  return "low"
}

function getLocation(x: number, y: number, imageWidth: number, imageHeight: number): string {
  const horizontalPos = x < imageWidth * 0.33 ? "Left" : x > imageWidth * 0.66 ? "Right" : "Center"
  const verticalPos = y < imageHeight * 0.33 ? "Top" : y > imageHeight * 0.66 ? "Bottom" : "Middle"
  return `${verticalPos}-${horizontalPos}`.toLowerCase()
}

function formatSize(width: number, height: number): string {
  return `${Math.round(width)}px x ${Math.round(height)}px`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      )
    }

    const arrayBuffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(arrayBuffer).toString("base64")

    const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY

    if (!ROBOFLOW_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Roboflow API key not configured",
          fallback: true
        },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://detect.roboflow.com/pothole-detection-i00zy/2?api_key=${ROBOFLOW_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: base64Image,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Roboflow API error:", errorText)
      return NextResponse.json(
        { success: false, error: "Detection API error", fallback: true },
        { status: 500 }
      )
    }

    const data: RoboflowResponse = await response.json()

    const potholes = data.predictions.map((pred, index) => ({
      id: index + 1,
      severity: getSeverity(pred.width, pred.height, data.image.width, data.image.height),
      size: formatSize(pred.width, pred.height),
      location: getLocation(pred.x, pred.y, data.image.width, data.image.height),
      confidence: Math.round(pred.confidence * 100),
      bbox: {
        x: pred.x - pred.width / 2,
        y: pred.y - pred.height / 2,
        width: pred.width,
        height: pred.height,
        xPercent: ((pred.x - pred.width / 2) / data.image.width) * 100,
        yPercent: ((pred.y - pred.height / 2) / data.image.height) * 100,
        widthPercent: (pred.width / data.image.width) * 100,
        heightPercent: (pred.height / data.image.height) * 100,
      },
    }))

    return NextResponse.json({
      success: true,
      potholes,
      imageSize: data.image,
      processingTime: data.time,
    })
  } catch (error) {
    console.error("Pothole detection error:", error)
    return NextResponse.json(
      { success: false, error: "Detection failed", fallback: true },
      { status: 500 }
    )
  }
}
