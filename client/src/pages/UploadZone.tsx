// File: client/src/components/UploadZone.tsx
import React, { useState, useEffect, useRef } from "react"
import {
  uploadFile,
  getUploads,
  deleteUpload,
} from "../api/media"
import type { MediaResponse } from "../api/media/types"

export default function UploadZone() {
  const [activeTab, setActiveTab] = useState<"img" | "video" | "files">("img")
  const [uploads, setUploads] = useState<Record<string, MediaResponse[]>>({ img: [], video: [], files: [] })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [alt, setAlt] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Camera / video capture state
  const [showCamera, setShowCamera] = useState(false)
  const [recording, setRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  // refs for gallery input
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Initial data fetch
  useEffect(() => { fetchUploads() }, [])
  useEffect(() => {
    if (success) {
      const id = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(id)
    }
  }, [success])

  // Start camera when requested
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
      .catch(err => setError(`Kon camera niet openen: ${err.message}`))

    return () => {
      mediaStreamRef.current?.getTracks().forEach(t => t.stop())
      mediaStreamRef.current = null
    }
  }, [showCamera, activeTab])

  // Fetch existing uploads
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

  // File selection helper
  const onFileSelect = (file: File) => {
    setSelectedFile(file)
    setAlt(file.name)
  }

  // Gallery input change handler
  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  // Upload handler
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

  // Cancel camera view
  const cancelCamera = () => {
    setShowCamera(false)
    mediaStreamRef.current?.getTracks().forEach(t => t.stop())
    mediaStreamRef.current = null
    setRecording(false)
  }

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
        onFileSelect(file)
        cancelCamera()
      }
    }, 'image/jpeg')
  }

  // Start video recording
  const startRecording = () => {
    if (!mediaStreamRef.current) return
    recordedChunksRef.current = []
    const recorder = new MediaRecorder(mediaStreamRef.current)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
      const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' })
      onFileSelect(file)
      cancelCamera()
    }
    recorder.start()
    setRecording(true)
  }

  // Stop video recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
  }

  // Styled upload zone UI
  const renderUploadZone = () => (
    <div className="mt-6 bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[220px] hover:from-gray-50 hover:to-white transition">
      <p className="mb-4 text-gray-600 font-medium">Sleep hier of kies een bestand:</p>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Camera / video button */}
        {(activeTab === 'img' || activeTab === 'video') && (
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-2xl shadow-md transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-200 transition"
          >
            {activeTab === 'img' ? '📷 Maak Foto' : '📹 Maak Video'}
          </button>
        )}
        {/* Gallery button */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-5 py-2 rounded-2xl shadow-sm transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-200 transition"
        >
          {activeTab === 'files'
            ? '📁 Kies Bestand'
            : activeTab === 'img'
              ? '🖼️ Kies Foto'
              : '🎥 Kies Video'}
        </button>
      </div>
      {/* Hidden gallery input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept={activeTab === 'files' ? '*/*' : activeTab === 'img' ? 'image/*' : 'video/*'}
        onChange={onGalleryChange}
        className="hidden"
      />
      {/* Selected file preview */}
      {selectedFile && (
        <div className="mt-4 flex items-center space-x-3">
          <span className="text-gray-800 truncate max-w-xs font-medium">{selectedFile.name}</span>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="text-red-500 hover:text-red-700"
          >✕</button>
        </div>
      )}
      {/* ALT text input */}
      <input
        type="text"
        placeholder="Alternatieve tekst (bijv. Vrolijke teamfoto)"
        value={alt}
        onChange={e => setAlt(e.target.value)}
        disabled={isUploading}
        className="mt-4 w-full max-w-md border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />
      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`mt-4 w-full max-w-md inline-flex justify-center items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition \${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-md transform hover:-translate-y-1"
        }`}
      >
        {isUploading
          ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          : "Uploaden"}
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-medium">Upload succesvol!</p>}

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-lg ring-1 ring-gray-200 p-2 flex space-x-2 mb-4">
        {(['img','video','files'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedFile(null) }}
            className={`flex-1 text-center py-2 rounded-2xl font-medium transition \${
              activeTab === tab
                ? "bg-blue-500 text-white ring-2 ring-blue-300 shadow-md transform"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.toUpperCase()} <span className="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full ml-2">{uploads[tab].length}</span>
          </button>
        ))}
      </div>

      {/* Camera / video overlay */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-6 z-50">
          <video ref={videoRef} className="w-full max-w-xl rounded-2xl mb-6 shadow-lg" autoPlay muted />
          <div className="flex space-x-6">
            {activeTab === 'img' ? (
              <button onClick={capturePhoto} className="px-6 py-3 bg-white rounded-2xl font-semibold shadow transition transform hover:-translate-y-1">
                📸 Capture
              </button>
            ) : (
              recording ? (
                <button onClick={stopRecording} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-semibold shadow transition transform hover:-translate-y-1">
                  ⏹️ Stop
                </button>
              ) : (
                <button onClick={startRecording} className="px-6 py-3 bg-white rounded-2xl font-semibold shadow transition transform hover:-translate-y-1">
                  🔴 Record
                </button>
              )
            )}
            <button onClick={cancelCamera} className="px-6 py-3 bg-gray-200 rounded-2xl font-semibold shadow transition transform hover:-translate-y-1">
              ✕ Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Main upload zone */}
      {!showCamera && renderUploadZone()}

      {/* Preview grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads[activeTab].length === 0 && (
          <p className="col-span-full text-center text-gray-500 italic">Geen bestanden geüpload</p>
        )}
        {uploads[activeTab].map(item => (
          <div key={item.id} className="relative bg-white rounded-3xl shadow-lg ring-1 ring-gray-200 p-4 hover:shadow-2xl transition transform hover:-translate-y-1"> 
            <button
              onClick={() => deleteUpload(item.id).then(fetchUploads)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-700 transition"
            >×</button>
            {activeTab === "img" && (
              <img src={item.url} alt={item.alt} className="mx-auto max-h-40 rounded-2xl shadow-inner transition" />
            )}
            {activeTab === "video" && (
              <video src={item.url} controls className="w-full max-h-48 rounded-2xl transition" />
            )}
            {activeTab === "files" && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-center text-blue-500 hover:underline mt-4 font-medium">
                {item.filename}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
