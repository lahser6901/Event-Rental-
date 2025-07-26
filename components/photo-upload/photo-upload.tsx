"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Camera, MapPin, Clock, FileImage, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface PhotoData {
  file: File
  preview: string
  gps?: { lat: number; lng: number }
  timestamp?: string
  id: string
  size: number
  type: string
  exifData?: any
}

interface PhotoUploadProps {
  onPhotosProcessed: (photos: PhotoData[]) => void
  maxFiles?: number
  maxSize?: number
}

export function PhotoUpload({ onPhotosProcessed, maxFiles = 10, maxSize = 10 * 1024 * 1024 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const processExifData = async (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // Simulate EXIF processing
          const mockExif = {
            gps:
              Math.random() > 0.5
                ? {
                    lat: 40.7128 + (Math.random() - 0.5) * 0.1,
                    lng: -74.006 + (Math.random() - 0.5) * 0.1,
                  }
                : null,
            timestamp: new Date().toISOString(),
            camera: "iPhone 14 Pro",
            focalLength: "24mm",
            aperture: "f/1.78",
            iso: "100",
            dimensions: {
              width: 4032,
              height: 3024,
            },
          }
          resolve(mockExif)
        } catch (error) {
          resolve(null)
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (photos.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} photos allowed`)
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        const processedPhotos: PhotoData[] = []

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i]
          setUploadProgress(((i + 1) / acceptedFiles.length) * 100)

          if (file.size > maxSize) {
            toast.error(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
            continue
          }

          const preview = URL.createObjectURL(file)
          const exifData = await processExifData(file)

          const photoData: PhotoData = {
            file,
            preview,
            id: `photo-${Date.now()}-${i}`,
            size: file.size,
            type: file.type,
            exifData,
            gps: exifData?.gps,
            timestamp: exifData?.timestamp,
          }

          processedPhotos.push(photoData)
        }

        const updatedPhotos = [...photos, ...processedPhotos]
        setPhotos(updatedPhotos)
        onPhotosProcessed(updatedPhotos)

        toast.success(`${processedPhotos.length} photos uploaded successfully`)
      } catch (error) {
        toast.error("Error processing photos")
        console.error(error)
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [photos, maxFiles, maxSize, onPhotosProcessed],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
    },
    maxFiles: maxFiles - photos.length,
    disabled: uploading,
  })

  const removePhoto = (id: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== id)
    setPhotos(updatedPhotos)
    onPhotosProcessed(updatedPhotos)

    // Clean up object URL
    const photoToRemove = photos.find((p) => p.id === id)
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Photo Upload
          </CardTitle>
          <CardDescription>Upload 3+ photos of your event space from different angles for AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            } ${uploading ? "pointer-events-none opacity-50" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>

              {uploading ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing photos...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {isDragActive ? "Drop photos here" : "Drag & drop photos here, or click to select"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, WebP, HEIC • Max {maxFiles} files • {maxSize / (1024 * 1024)}MB per file
                  </p>
                </div>
              )}

              <Button variant="outline" disabled={uploading}>
                <FileImage className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Uploaded Photos ({photos.length})</h4>
                <Badge variant="secondary">
                  {photos.length}/{maxFiles}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={photo.preview || "/placeholder.svg"}
                        alt="Uploaded photo"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>

                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex gap-1">
                        {photo.gps && (
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            GPS
                          </Badge>
                        )}
                        {photo.timestamp && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Time
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium truncate">{photo.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(photo.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photos.length > 0 && photos.length < 3 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">More photos recommended</p>
                <p className="text-yellow-700">
                  Upload at least 3 photos from different angles for better AI analysis accuracy.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
