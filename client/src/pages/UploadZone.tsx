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

  // refs voor camera vs. gallery
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchUploads() }, [])
  useEffect(() => {
    if (success) {
      const id = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(id)
    }
  }, [success])

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

  const onFileSelect = (file: File) => {
    setSelectedFile(file)
    setAlt(file.name)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit bestand wilt verwijderen?")) return
    try {
      await deleteUpload(id)
      await fetchUploads()
    } catch (err: any) {
      setError(err.response?.data || "Kon bestand niet verwijderen")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">Upload succesvol!</p>}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-100 p-2 flex space-x-2">
        {(["img","video","files"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedFile(null) }}
            className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white ring-2 ring-blue-300 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.toUpperCase()} ({uploads[tab].length})
          </button>
        ))}
      </div>

      {/* Upload zone */}
      <div className="mt-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl shadow-inner p-6 flex flex-col items-center justify-center min-h-[200px] hover:bg-gray-100 transition-colors">
        <p className="mb-4 text-gray-600">Sleep hier of kies:</p>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Camera-knop voor foto/video */}
          {(activeTab === "img" || activeTab === "video") && (
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              {activeTab === "img" ? "📷 Open camera" : "📹 Open camera"}
            </button>
          )}
          {/* Gallery-knop */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg shadow transition"
          >
            {activeTab === "files"
              ? "📁 Kies bestand"
              : activeTab === "img"
              ? "🖼️ Kies foto"
              : "🎥 Kies video"}
          </button>
        </div>

        {/* Hidden inputs */}
        {(activeTab === "img" || activeTab === "video") && (
          <input
            ref={cameraInputRef}
            type="file"
            accept={activeTab === "img" ? "image/*" : "video/*"}
            capture
            onChange={onInputChange}
            className="hidden"
          />
        )}
        <input
          ref={galleryInputRef}
          type="file"
          accept={activeTab === "files" ? "*/*" : activeTab === "img" ? "image/*" : "video/*"}
          onChange={onInputChange}
          className="hidden"
        />

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

        <input
          type="text"
          placeholder="Alternatieve tekst (bijv. 'Vrolijke teamfoto')"
          value={alt}
          onChange={e => setAlt(e.target.value)}
          disabled={isUploading}
          className="mt-4 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
        />

        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className={`mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition ${
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

      {/* Preview Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads[activeTab].length === 0 && (
          <p className="col-span-full text-center text-gray-500 italic">
            Geen bestanden geüpload
          </p>
        )}
        {uploads[activeTab].map(item => (
          <div key={item.id} className="relative bg-white rounded-xl shadow-md ring-1 ring-gray-100 p-4 hover:shadow-lg transition">
            <button
              onClick={() => handleDelete(item.id)}
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
