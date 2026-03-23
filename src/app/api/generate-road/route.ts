import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null
    const improvementsRaw = formData.get("improvements") as string | null
    
    const improvements = improvementsRaw ? JSON.parse(improvementsRaw) : []
    const improvementsList = improvements.join(", ")

    const apiKey = process.env.STABILITY_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "STABILITY_API_KEY not configured" },
        { status: 500 }
      )
    }

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      )
    }

    if (imageFile.type?.startsWith("video/")) {
      return NextResponse.json(
        { success: false, error: "Video input is not supported yet. Please upload an image." },
        { status: 400 }
      )
    }

    const arrayBuffer = await imageFile.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    const prompt = `Ultra-realistic photograph of this exact same road location after professional redevelopment. 
Maintain the EXACT same camera angle, perspective, buildings, surroundings, sky, and environment.
Only improve the road infrastructure: ${improvementsList}.
Add fresh smooth black asphalt pavement, crisp white lane markings, modern LED street lamps, clean pedestrian sidewalks with proper curbs, efficient drainage systems, road signage.
Keep all existing buildings, trees, vehicles, and background elements exactly as they are.
Photorealistic, 8K quality, natural lighting matching the original photo, professional civil engineering visualization, hyperrealistic detail.`

    const negativePrompt = `cartoon, illustration, painting, artistic, blurry, low quality, different angle, different location, changed buildings, altered surroundings, fantasy, unrealistic, CGI look, artificial lighting`

    const stabilityFormData = new FormData()
    stabilityFormData.append("image", new Blob([imageBuffer], { type: imageFile.type || "image/jpeg" }), "image.jpg")
    stabilityFormData.append("prompt", prompt)
    stabilityFormData.append("negative_prompt", negativePrompt)
    stabilityFormData.append("control_strength", "0.85")
    stabilityFormData.append("output_format", "jpeg")

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/control/structure",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "image/*",
        },
        body: stabilityFormData,
      }
    )

      if (!response.ok) {
        const errorText = await response.text()
        // Stability often returns JSON even when Accept is image/*
        let message = errorText
        try {
          const parsed = JSON.parse(errorText)
          if (Array.isArray(parsed?.errors) && parsed.errors.length > 0) {
            message = parsed.errors.join(" ")
          } else if (typeof parsed?.message === "string") {
            message = parsed.message
          } else if (typeof parsed?.error === "string") {
            message = parsed.error
          }
        } catch {
          // keep raw text
        }

        // Make common billing failure explicit
        if (response.status === 402 && !message) {
          message = "You lack sufficient credits to make this request."
        }

        console.error("Stability AI error:", response.status, message)

        return NextResponse.json(
          {
            success: false,
            error:
              response.status === 402
                ? `Stability AI: insufficient credits. ${message}`
                : `Stability AI error (${response.status}): ${message}`,
          },
          { status: response.status }
        )
      }

    const imageArrayBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageArrayBuffer).toString("base64")
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
    })
  } catch (error) {
    console.error("Error generating road image:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate image" },
      { status: 500 }
    )
  }
}