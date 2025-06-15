import React, { useState, useEffect, useRef } from "react"
import {
  uploadFile,
  getUploads,
  deleteUpload,
} from "../api/media"
import type { MediaResponse } from "../api/media/types"

export default function UploadZone() {
  const [activeTab, setActiveTab] = useState<"img" | "video" | "files">("img")
  const [uploads, setUploads] = useState<Record<string, MediaResponse[]>>({
    img: [], video: [], files: []
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [alt, setAlt] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [recording, setRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchUploads() }, [])
  useEffect(() => {
    if (success) {
      const id = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(id)
    }
  }, [success])

  useEffect(() => {
    if (!showCamera) return
    const constraints: MediaStreamConstraints =
      activeTab === "img"
        ? { video: { facingMode: "environment" } }
        : { video: { facingMode: "environment" }, audio: true }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        mediaStreamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      })
      .catch(err => setError(`Kan camera niet openen: ${err.message}`))
    return () => {
      mediaStreamRef.current?.getTracks().forEach(t => t.stop())
      mediaStreamRef.current = null
    }
  }, [showCamera, activeTab])

  const fetchUploads = async () => {
    try {
      const all = await getUploads()
      const grouped: Record<string, MediaResponse[]> = { img: [], video: [], files: [] }
      all.forEach(item => {
        const key = item.contentType.startsWith("image/")
          ? "img"
          : item.contentType.startsWith("video/")
          ? "video"
          : "files"
        grouped[key].push(item)
      })
      setUploads(grouped)
    } catch (err: any) {
      setError(err.response?.data || "Fout bij laden van media")
    }
  }

  const onFileSelect = (file: File) => {
    setSelectedFile(file)
    setAlt(file.name)
  }
  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setError(null)
    try {
      await uploadFile(selectedFile, alt || selectedFile.name, activeTab)
      setSelectedFile(null)
      setAlt("")
      setSuccess(true)
      await fetchUploads()
    } catch (err: any) {
      setError(err.response?.data || "Upload mislukt")
    } finally {
      setIsUploading(false)
    }
  }

  const cancelCamera = () => {
    setShowCamera(false)
    mediaStreamRef.current?.getTracks().forEach(t => t.stop())
    mediaStreamRef.current = null
    setRecording(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    ctx?.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `foto_${Date.now()}.jpg`, { type: "image/jpeg" })
        onFileSelect(file)
        cancelCamera()
      }
    }, "image/jpeg")
  }

  const startRecording = () => {
    if (!mediaStreamRef.current) return
    recordedChunksRef.current = []
    const recorder = new MediaRecorder(mediaStreamRef.current)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = e => e.data.size > 0 && recordedChunksRef.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const file = new File([blob], `video_${Date.now()}.webm`, { type: "video/webm" })
      onFileSelect(file)
      cancelCamera()
    }
    recorder.start()
    setRecording(true)
  }
  const stopRecording = () => mediaRecorderRef.current?.stop()

  return (
    <div className="container mx-auto px-4 py-6">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">Upload succesvol!</p>}

      <div className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 p-4 flex space-x-2 overflow-auto mb-6">
        {(["img","video","files"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedFile(null) }}
            className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white ring-2 ring-blue-300 shadow-md"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab === "img" ? "FOTO" : tab === "video" ? "VIDEO" : "BESTANDEN"}
            <span className="ml-2 inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {uploads[tab].length}
            </span>
          </button>
        ))}
      </div>

      {showCamera ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-6 z-50">
          <video ref={videoRef} className="w-full max-w-md rounded-xl shadow-lg mb-6" autoPlay muted />
          <div className="flex flex-col sm:flex-row gap-4">
            {activeTab === "img" ? (
              <button
                onClick={capturePhoto}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                📸 Vastleggen
              </button>
            ) : recording ? (
              <button
                onClick={stopRecording}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg shadow hover:bg-red-700 transition"
              >
                ⏹️ Stoppen
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                🔴 Opnemen
              </button>
            )}
            <button
              onClick={cancelCamera}
              className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              ✕ Annuleren
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 p-6 flex flex-col items-center">
          <p className="mb-4 text-gray-600">Sleep hier of kies een bestand:</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {activeTab !== "files" && (
              <button
                onClick={() => setShowCamera(true)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                {activeTab === "img" ? "📸 Foto maken" : "📹 Video maken"}
              </button>
            )}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              {activeTab === "files" ? "📁 Bestand kiezen" : activeTab === "img" ? "🖼️ Foto kiezen" : "🎥 Video kiezen"}
            </button>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept={activeTab === "files" ? "*/*" : activeTab === "img" ? "image/*" : "video/*"}
            onChange={onGalleryChange}
            className="hidden"
          />
          {selectedFile && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-gray-800 truncate">{selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)} className="text-red-600">✕</button>
            </div>
          )}
          <input
            type="text"
            placeholder="Korte beschrijving"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            disabled={isUploading}
            className="mt-4 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50`}
          >
            {isUploading ? "Bezig..." : "Uploaden"}
          </button>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads[activeTab].length === 0 && (
          <p className="col-span-full text-center text-gray-600 italic">Nog geen uploads</p>
        )}
        {uploads[activeTab].map(item => (
          <div key={item.id} className="relative bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
            <button
              onClick={() => deleteUpload(item.id).then(fetchUploads)}
              className="absolute top-2 right-2 text-red-600"
            >
              ✕
            </button>
            {activeTab === "img" && (
              <img src={item.url} alt={item.alt} className="mx-auto max-h-40 rounded-lg" />
            )}
            {activeTab === "video" && (
              <video src={item.url} controls className="w-full max-h-48 rounded-lg" />
            )}
            {activeTab === "files" && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block mt-2">
                {item.filename}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
)
}
