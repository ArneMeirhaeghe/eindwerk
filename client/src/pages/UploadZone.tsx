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

  // Status camera/opname
  const [showCamera, setShowCamera] = useState(false)
  const [recording, setRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Haal uploads op bij mount
  useEffect(() => { fetchUploads() }, [])
  useEffect(() => {
    if (success) {
      const id = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(id)
    }
  }, [success])

  // Open camera of audio/video
  useEffect(() => {
    if (!showCamera) return
    const opts: MediaStreamConstraints =
      activeTab === "img"
        ? { video: { facingMode: "environment" } }
        : { video: { facingMode: "environment" }, audio: true }

    navigator.mediaDevices.getUserMedia(opts)
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

  // Fetch uploads
  const fetchUploads = async () => {
    try {
      const all = await getUploads()
      const grouped: Record<string, MediaResponse[]> = { img: [], video: [], files: [] }
      all.forEach(item => {
        const typeKey = item.contentType.startsWith("image/")
          ? "img"
          : item.contentType.startsWith("video/")
            ? "video"
            : "files"
        grouped[typeKey].push(item)
      })
      setUploads(grouped)
    } catch (err: any) {
      setError(err.response?.data || "Fout bij laden van media")
    }
  }

  // Kies bestand
  const onFileSelect = (file: File) => {
    setSelectedFile(file)
    setAlt(file.name)
  }
  const onGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  // Upload verwerking
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

  // Annuleren camera/opname
  const cancelCamera = () => {
    setShowCamera(false)
    mediaStreamRef.current?.getTracks().forEach(t => t.stop())
    mediaStreamRef.current = null
    setRecording(false)
  }

  // Foto maken
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
        const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' })
        onFileSelect(file)
        cancelCamera()
      }
    }, 'image/jpeg')
  }

  // Start opname
  const startRecording = () => {
    if (!mediaStreamRef.current) return
    recordedChunksRef.current = []
    const recorder = new MediaRecorder(mediaStreamRef.current)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = e => e.data.size > 0 && recordedChunksRef.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
      const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' })
      onFileSelect(file)
      cancelCamera()
    }
    recorder.start()
    setRecording(true)
  }
  const stopRecording = () => { mediaRecorderRef.current?.stop() }

  // Upload zone renderen
  const renderUploadZone = () => (
    <div className="mt-6 bg-white border-2 border-dashed border-gray-300 rounded-3xl shadow-md p-6 flex flex-col items-center justify-center min-h-[220px] hover:bg-gray-50 transition">
      <p className="mb-4 text-gray-700 font-medium">Sleep hier of kies een bestand:</p>
      <div className="flex flex-col sm:flex-row gap-4">
        {(activeTab !== 'files') && (
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-2xl shadow transition transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-200"
          >
            {activeTab === 'img' ? '📷 Maak foto' : '📹 Maak video'}
          </button>
        )}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-2xl shadow-sm transition transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-200"
        >
          {activeTab === 'files' ? '📁 Kies bestanden' : activeTab === 'img' ? '🖼️ Kies foto' : '🎥 Kies video'}
        </button>
      </div>
      <input
        ref={galleryInputRef}
        type="file"
        accept={activeTab === 'files' ? '*/*' : activeTab === 'img' ? 'image/*' : 'video/*'}
        onChange={onGalleryChange}
        className="hidden"
      />
      {selectedFile && (
        <div className="mt-4 flex items-center space-x-3">
          <span className="text-gray-800 truncate max-w-xs font-medium">{selectedFile.name}</span>
          <button type="button" onClick={() => setSelectedFile(null)} className="text-red-600 hover:text-red-800">✕</button>
        </div>
      )}
      <input
        type="text"
        placeholder="Beschrijf kort de inhoud"
        value={alt}
        onChange={e => setAlt(e.target.value)}
        disabled={isUploading}
        className="mt-4 w-full max-w-md border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className={`mt-4 w-full max-w-md inline-flex justify-center items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition \${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 shadow transform hover:-translate-y-1"
        }`}
      >
        {isUploading
          ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          : "Uploaden"}
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-medium">Upload is gelukt!</p>}

      <div className="bg-white rounded-3xl shadow ring-1 ring-gray-200 p-2 flex space-x-2 mb-6">
        {(['img','video','files'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedFile(null) }}
            className={`flex-1 text-center py-2 rounded-2xl font-medium transition \${
              activeTab === tab
                ? "bg-indigo-600 text-white ring-2 ring-indigo-300 shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab === 'img' ? 'FOTO' : tab === 'video' ? 'VIDEO' : 'BESTANDEN'}
            <span className="ml-2 inline-block bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{uploads[tab].length}</span>
          </button>
        ))}
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-6 z-50">
          <video ref={videoRef} className="w-full max-w-xl rounded-2xl shadow-lg mb-6" autoPlay muted />
          <div className="flex space-x-6">
            {activeTab === 'img' ? (
              <button onClick={capturePhoto} className="px-6 py-3 bg-white rounded-2xl font-semibold shadow transform hover:-translate-y-1">📸 Vastleggen</button>
            ) : recording ? (
              <button onClick={stopRecording} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-semibold shadow transform hover:-translate-y-1">⏹️ Stoppen</button>
            ) : (
              <button onClick={startRecording} className="px-6 py-3 bg-white rounded-2xl font-semibold shadow transform hover:-translate-y-1">🔴 Opnemen</button>
            )}
            <button onClick={cancelCamera} className="px-6 py-3 bg-gray-200 rounded-2xl font-semibold shadow transform hover:-translate-y-1">✕ Annuleren</button>
          </div>
        </div>
      )}

      {!showCamera && renderUploadZone()}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads[activeTab].length === 0 && (
          <p className="col-span-full text-center text-gray-500 italic">Nog geen uploads</p>
        )}
        {uploads[activeTab].map(item => (
          <div key={item.id} className="relative bg-white rounded-3xl shadow p-4 hover:shadow-lg transition">
            <button
              onClick={() => deleteUpload(item.id).then(fetchUploads)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800"
            >✕</button>
            {activeTab === "img" && (
              <img src={item.url} alt={item.alt} className="mx-auto max-h-40 rounded-2xl" />
            )}
            {activeTab === "video" && (
              <video src={item.url} controls className="w-full max-h-48 rounded-2xl" />
            )}
            {activeTab === "files" && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-center text-indigo-600 hover:underline mt-4 font-medium">{item.filename}</a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
