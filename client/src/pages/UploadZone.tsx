import React, { useState, useEffect } from 'react';
import { uploadFile, getUploads, deleteUpload, type MediaResponse } from '../api/uploads';

const UploadZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'img' | 'video' | 'files'>('img');
  const [uploads, setUploads] = useState<Record<string, MediaResponse[]>>({ img: [], video: [], files: [] });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [styles, setStyles] = useState('');

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    const all = await getUploads();
    const grouped: Record<string, MediaResponse[]> = { img: [], video: [], files: [] };
    all.forEach(item => {
      const key = item.contentType.startsWith('image/')
        ? 'img'
        : item.contentType.startsWith('video/')
        ? 'video'
        : 'files';
      grouped[key].push(item);
    });
    setUploads(grouped);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const type = activeTab;
    await uploadFile(selectedFile, alt || selectedFile.name, type, styles);
    setSelectedFile(null);
    setAlt('');
    setStyles('');
    fetchUploads();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAlt(e.target.files[0].name);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUpload(id);
    fetchUploads();
  };

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-2">
        {(['img', 'video', 'files'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="mt-6 border-2 border-dashed border-gray-400 p-4 rounded">
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
        />
        <div className="mt-3 flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Alt text"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            className="border p-1 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Styles"
            value={styles}
            onChange={e => setStyles(e.target.value)}
            className="border p-1 rounded flex-1"
          />
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Preview Zone */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {uploads[activeTab].map(item => (
          <div key={item.id} className="border p-2 rounded relative">
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-1 right-1 text-red-500"
            >
              &times;
            </button>
            {activeTab === 'img' && (
              <img src={item.url} alt={item.alt} className="max-h-32 mx-auto" />
            )}
            {activeTab === 'video' && (
              <video
                src={item.url}
                controls
                className="max-h-48 w-full"
              />
            )}
            {activeTab === 'files' && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
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