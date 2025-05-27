import React, { useState, useEffect, useRef } from 'react';
import { uploadFile, getUploads, deleteUpload, type MediaResponse } from '../api/uploads';

type StyleOptions = {
  width: number
  height: number
  rounded: boolean
  shadow: boolean
  objectFit: 'cover'|'contain'
}
const defaultStyles: StyleOptions = {
  width: 200, height: 200,
  rounded: false, shadow: false,
  objectFit: 'cover'
}

const styleOptsToString = (o: StyleOptions) => [
  `width:${o.width}px`,
  `height:${o.height}px`,
  `object-fit:${o.objectFit}`,
  o.rounded ? 'border-radius:8px' : '',
  o.shadow  ? 'box-shadow:0 2px 6px rgba(0,0,0,0.2)' : ''
].filter(Boolean).join(';')

const styleOptsToInline = (o: StyleOptions): React.CSSProperties => ({
  width: `${o.width}px`,
  height: `${o.height}px`,
  objectFit: o.objectFit,
  borderRadius: o.rounded ? '8px' : undefined,
  boxShadow:  o.shadow  ? '0 2px 6px rgba(0,0,0,0.2)' : undefined
})

const UploadZone: React.FC = () => {
  const [tab, setTab] = useState<'upload'|'camera'>('upload')
  const [file, setFile]       = useState<File|null>(null)
  const [alt, setAlt]         = useState('')
  const [styleOpts, setStyle] = useState<StyleOptions>(defaultStyles)
  const [uploads, setUploads] = useState<MediaResponse[]>([])
  const [search, setSearch]   = useState('')
  const [error, setError]     = useState('')

  // camera
  const [capturing, setCap] = useState(false)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { fetchAll() }, [])
  const fetchAll = async () => setUploads(await getUploads())
  const filtered = uploads.filter(u => u.filename.toLowerCase().includes(search.toLowerCase()))

  // ---- camera handlers ----
  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.current!.srcObject = stream
    setCap(true)
  }
  const stopCamera = () => {
    const s = videoRef.current?.srcObject as MediaStream
    s?.getTracks().forEach(t => t.stop())
    videoRef.current!.srcObject = null
    setCap(false)
  }
  const capturePhoto = () => {
    const v = videoRef.current!, c = canvasRef.current!
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')!.drawImage(v,0,0)
    c.toBlob(b => {
      if (b) setFile(new File([b], `photo_${Date.now()}.png`, { type: 'image/png' }))
    }, 'image/png')
    stopCamera()
  }

  // ---- form submit ----
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !alt.trim()) {
      setError('Bestand + alt-tekst verplicht')
      return
    }
    try {
      await uploadFile(file, '', alt.trim(), styleOptsToString(styleOpts))
      resetForm()
      fetchAll()
    } catch {
      setError('Upload mislukt')
    }
  }
  const resetForm = () => {
    setFile(null); setAlt(''); setStyle(defaultStyles); setError('')
    if (capturing) stopCamera()
  }

  const onDelete = async (id: string) => {
    if (!confirm('Weet je het zeker?')) return
    await deleteUpload(id)
    fetchAll()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Tabs */}
      <div className="flex space-x-2">
        {(['upload','camera'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); resetForm() }}
            className={`px-4 py-2 font-medium rounded-t-lg
              ${tab===t ? 'bg-white border-t border-x border-gray-300':'bg-gray-200'}`}
          >
            {t === 'upload' ? 'Upload' : 'Camera'}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white border border-t-0 shadow rounded-b-lg p-6 space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* File input always shown */}
          <input
            type="file" accept="image/*"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-gray-700 border rounded px-3 py-2"
          />

          {/* Camera tab */}
          {tab==='camera' && (
            <div className="space-y-2">
              {!capturing ? (
                <button type="button"
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Open camera
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button type="button"
                    onClick={capturePhoto}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    📸 Maak foto
                  </button>
                  <button type="button"
                    onClick={stopCamera}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Annuleer
                  </button>
                </div>
              )}
              {capturing && (
                <video ref={videoRef} autoPlay className="w-full h-48 bg-black rounded object-cover" />
              )}
              {!capturing && file && file.type.startsWith('image/') && (
                <canvas ref={canvasRef} className="w-full h-48 rounded border object-cover" />
              )}
            </div>
          )}

          {/* Alt-tekst */}
          <input
            type="text" placeholder="Alt-tekst (verplicht)"
            value={alt} onChange={e => setAlt(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          {/* Style editor */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              Width ({styleOpts.width}px)
              <input type="range" min={50} max={500}
                value={styleOpts.width}
                onChange={e => setStyle(o => ({...o, width:+e.target.value}))}
                className="mt-1"
              />
            </label>
            <label className="flex flex-col">
              Height ({styleOpts.height}px)
              <input type="range" min={50} max={500}
                value={styleOpts.height}
                onChange={e => setStyle(o => ({...o, height:+e.target.value}))}
                className="mt-1"
              />
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={styleOpts.rounded}
                onChange={e => setStyle(o => ({...o, rounded:e.target.checked}))}
              /> Rounded
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={styleOpts.shadow}
                onChange={e => setStyle(o => ({...o, shadow:e.target.checked}))}
              /> Shadow
            </label>
            <label className="flex flex-col col-span-2">
              Object-fit
              <select value={styleOpts.objectFit}
                onChange={e => setStyle(o => ({...o, objectFit: e.target.value as any}))}
                className="mt-1 border rounded px-2 py-1"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
              </select>
            </label>
          </div>

          {/* Live preview */}
          {file && (
            <div className="mt-4">
              <p className="font-medium mb-2">Preview:</p>
              <img
                src={URL.createObjectURL(file)}
                alt={alt}
                style={styleOptsToInline(styleOpts)}
                className="border"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
            disabled={!file || !alt.trim()}
          >
            Upload
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>

      {/* Search & Grid */}
      <div>
        <input
          type="text" placeholder="Zoek op bestand..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 border rounded px-3 py-2"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(u => (
            <div key={u.id} className="bg-white shadow rounded-lg overflow-hidden">
              <img
                src={u.url}
                alt={u.alt}
                className="w-full h-48 object-cover"
                style={styleOptsToInline(styleOpts)}
              />
              <div className="p-3 flex justify-between items-center">
                <span className="font-medium truncate">{u.filename}</span>
                <div className="flex space-x-2">
                  <button onClick={() => onDelete(u.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                  <a href={u.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">📥</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UploadZone
