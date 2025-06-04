// File: client/src/pages/UploadZone.tsx
import React, { useState, useEffect } from 'react';
import {
  uploadFile,
  getUploads,
  deleteUpload,
  type MediaResponse,
} from '../api/uploads';

const UploadZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'img' | 'video' | 'files'>('img');
  const [uploads, setUploads] = useState<Record<string, MediaResponse[]>>({
    img: [],
    video: [],
    files: [],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [styles, setStyles] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Loader-state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const all = await getUploads();
      const grouped: Record<string, MediaResponse[]> = {
        img: [],
        video: [],
        files: [],
      };
      all.forEach((item) => {
        const key = item.contentType.startsWith('image/')
          ? 'img'
          : item.contentType.startsWith('video/')
          ? 'video'
          : 'files';
        grouped[key].push(item);
      });
      setUploads(grouped);
    } catch (err: any) {
      setError(err.response?.data || 'Fout bij laden van media');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);
    const type = activeTab;
    try {
      await uploadFile(selectedFile, alt || selectedFile.name, type, styles);
      setSelectedFile(null);
      setAlt('');
      setStyles('');
      await fetchUploads();
    } catch (err: any) {
      setError(err.response?.data || 'Upload mislukt');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAlt(e.target.files[0].name);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) return;
    try {
      await deleteUpload(id);
      await fetchUploads();
    } catch (err: any) {
      setError(err.response?.data || 'Kon bestand niet verwijderen');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Foutmelding bovenaan */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {(['img', 'video', 'files'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="mt-2 border-2 border-dashed border-gray-400 p-4 rounded">
        <input
          type="file"
          accept={
            activeTab === 'img'
              ? 'image/*'
              : activeTab === 'video'
              ? 'video/*'
              : '*/*'
          }
          onChange={handleFileChange}
          disabled={isUploading}
          className="mb-3"
        />
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Alt text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="border p-1 rounded flex-1"
            disabled={isUploading}
          />
          <input
            type="text"
            placeholder="Styles"
            value={styles}
            onChange={(e) => setStyles(e.target.value)}
            className="border p-1 rounded flex-1"
            disabled={isUploading}
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className={`px-4 py-2 rounded text-white transition ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                {/* Spinner */}
                <div className="w-5 h-5 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <span>Uploaden...</span>
              </div>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>

      {/* Preview Zone */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {uploads[activeTab].map((item) => (
          <div key={item.id} className="border p-2 rounded relative bg-white">
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-1 right-1 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            {activeTab === 'img' && (
              <img
                src={item.url}
                alt={item.alt}
                className="max-h-32 mx-auto rounded"
              />
            )}
            {activeTab === 'video' && (
              <video src={item.url} controls className="max-h-48 w-full rounded" />
            )}
            {activeTab === 'files' && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {item.filename}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadZone;
