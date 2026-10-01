import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null
    const improvementsRaw = formData.get("improvements") as string | null
    
    const improvements = improvementsRaw ? JSON.parse(improvementsRaw) : []
    const improvementsList = improvements.join(", ")

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
    const base64InputImage = imageBuffer.toString("base64")

    const apiKey = process.env.STABILITY_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY

    // 1. Try Stability AI if key is present
    if (apiKey) {
      try {
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

        if (response.ok) {
          const imageArrayBuffer = await response.arrayBuffer()
          const base64Image = Buffer.from(imageArrayBuffer).toString("base64")
          const dataUrl = `data:image/jpeg;base64,${base64Image}`

          return NextResponse.json({
            success: true,
            imageUrl: dataUrl,
            source: "stability"
          })
        } else {
          const errorText = await response.text()
          console.warn("Stability AI returned error status:", response.status, errorText)
        }
      } catch (err) {
        console.warn("Stability AI API call failed:", err)
      }
    }

    // 2. Try Gemini Imagen model if Gemini key is present
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey })
        const imagenPrompt = `A high quality, photorealistic architectural render of a modern, newly redeveloped city road with fresh smooth asphalt pavement, clear lane markings, modern street lamps, clean sidewalks, and drainage. Selected features: ${improvementsList}`
        
        const response = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: imagenPrompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
          },
        })

        if (response?.generatedImages?.[0]?.image?.imageBytes) {
          const base64Image = response.generatedImages[0].image.imageBytes
          return NextResponse.json({
            success: true,
            imageUrl: `data:image/jpeg;base64,${base64Image}`,
            source: "gemini-imagen"
          })
        }
      } catch (err) {
        console.warn("Gemini Imagen image generation failed:", err)
      }
    }

    // 3. Fallback high-res sample redeveloped road image so user can test UI flow
    const sampleImage = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&auto=format&fit=crop&q=80"
    
    return NextResponse.json({
      success: true,
      imageUrl: sampleImage,
      simulated: true,
      notice: "Showing sample redeveloped road render. Add STABILITY_API_KEY or GEMINI_API_KEY for live generative model processing.",
      source: "demo-sample"
    })

  } catch (error) {
    console.error("Error generating road image:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate road redevelopment visualization" },
      { status: 500 }
    )
  }
}
