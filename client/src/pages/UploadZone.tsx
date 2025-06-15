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

  // haal uploads op mount
  useEffect(() => { fetchUploads() }, [])
  useEffect(() => {
    if (success) {
      const id = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(id)
    }
  }, [success])

  // start camera when gevraagd
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
      // stop alle camera tracks
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

  // selectie helper
  const onFileSelect = (file: File) => {
    setSelectedFile(file)
    setAlt(file.name)
  }

  // gallery input change
  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  // upload uitvoerende functie
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

  // camera capture annuleren
  const cancelCamera = () => {
    setShowCamera(false)
    // tracks stoppen
    mediaStreamRef.current?.getTracks().forEach(t => t.stop())
    mediaStreamRef.current = null
  }

  // foto nemen
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

  // opname starten
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
      setRecording(false)
    }
    recorder.start()
    setRecording(true)
  }

  // opname stoppen
  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
  }

  // upload zone UI
  const renderUploadZone = () => (
    <div className="mt-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl shadow-inner p-6 flex flex-col items-center justify-center min-h-[200px] hover:bg-gray-100 transition-colors">
      <p className="mb-4 text-gray-600">Sleep hier of kies:</p>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Camera / video knop */}
        {(activeTab === 'img' || activeTab === 'video') && (
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            {activeTab === 'img' ? '📷 Maak foto' : '📹 Maak video'}
          </button>
        )}
        {/* Gallery knop */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg shadow transition"
        >
          {activeTab === 'files'
            ? '📁 Kies bestand'
            : activeTab === 'img'
            ? '🖼️ Kies foto'
            : '🎥 Kies video'}
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
      {/* geselecteerde file */}
      {selectedFile && (
        <div className="mt-4 flex items-center space-x-3">
          <span className="text-gray-800 truncate max-w-xs">{selectedFile.name}</span>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="text-red-500 hover:text-red-700"
          >✕</button>
        </div>
      )}
      {/* alt tekst invoer */}
      <input
        type="text"
        placeholder="Alternatieve tekst (bijv. 'Vrolijke teamfoto')"
        value={alt}
        onChange={e => setAlt(e.target.value)}
        disabled={isUploading}
        className="mt-4 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
      />
      {/* upload knop */}
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition \${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
        }`}
      >
        {isUploading
          ? <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          : "Upload"}
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6 relative">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">Upload succesvol!</p>}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-100 p-2 flex space-x-2 z-10 relative">
        {(['img','video','files'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedFile(null) }}
            className={`flex-1 text-center py-2 rounded-lg font-medium transition \${
              activeTab === tab
                ? "bg-blue-600 text-white ring-2 ring-blue-300 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.toUpperCase()} ({uploads[tab].length})
          </button>
        ))}
      </div>

      {/* Camera / video capture overlay */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-4 z-50">
          <video ref={videoRef} className="w-full max-w-md rounded-lg mb-4" autoPlay muted />
          <div className="flex space-x-4">
            {activeTab === 'img' ? (
              <button onClick={capturePhoto} className="px-4 py-2 bg-white rounded-lg font-medium">
                📸 Capture
              </button>
            ) : (
              recording ? (
                <button onClick={stopRecording} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">
                  ⏹️ Stop
                </button>
              ) : (
                <button onClick={startRecording} className="px-4 py-2 bg-white rounded-lg font-medium">
                  🔴 Record
                </button>
              )
            )}
            <button onClick={cancelCamera} className="px-4 py-2 bg-gray-200 rounded-lg font-medium">
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* normale upload zone */}
      {!showCamera && renderUploadZone()}

      {/* Preview grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads[activeTab].length === 0 && (
          <p className="col-span-full text-center text-gray-500 italic">
            Geen bestanden geüpload
          </p>
        )}
        {uploads[activeTab].map(item => (
          <div key={item.id} className="relative bg-white rounded-xl shadow-md ring-1 ring-gray-100 p-4 hover:shadow-lg transition">
            <button
              onClick={() => deleteUpload(item.id).then(fetchUploads)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-700 transition"
            >×</button>
            {activeTab === "img" && (
              <img src={item.url} alt={item.alt} className="mx-auto max-h-32 rounded-md shadow-inner" />
            )}
            {activeTab === "video" && (
              <video src={item.url} controls className="w-full max-h-48 rounded-md" />
            )}
            {activeTab === "files" && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-center text-blue-600 hover:underline mt-4">
                {item.filename}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
