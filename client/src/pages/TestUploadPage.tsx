// File: src/pages/TestUploadPage.tsx

import React, { useState, useEffect } from 'react';
import type { MediaResponse } from '../api/media/types';
import { getUploads } from '../api/media';
import { uploadGridFsFile } from '../api/files';


interface ExtendedCSSProperties extends React.CSSProperties {
  [key: string]: string | number | undefined;
}

function parseStyles(styles: string): ExtendedCSSProperties {
  const obj: ExtendedCSSProperties = {};
  styles.split(';').forEach((rule) => {
    const [prop, val] = rule.split(':').map((s) => s.trim());
    if (prop && val) {
      const camel = prop.replace(/-([a-z])/g, (_, c) =>
        c.toUpperCase()
      );
      obj[camel] = val;
    }
  });
  return obj;
}

const TestUploadPage: React.FC = () => {
  const [tab, setTab] = useState<'image' | 'video' | 'file'>(
    'image'
  );
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [styles, setStyles] = useState('');
  const [uploads, setUploads] = useState<MediaResponse[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    const data = await getUploads();
    setUploads(data);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await uploadGridFsFile(file, tab, alt, styles);
      setFile(null);
      setAlt('');
      setStyles('');
      fetchAll();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.title || 'Upload mislukt');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Upload-form */}
      <div className="w-1/2 p-6 border-r">
        <div className="flex space-x-3 mb-6">
          {['image', 'video', 'file'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 rounded ${
                tab === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Selecteer {tab}</label>
            <input
              type="file"
              accept={
                tab === 'image'
                  ? 'image/*'
                  : tab === 'video'
                  ? 'video/*'
                  : '*/*'
              }
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
            />
          </div>
          <div>
            <label className="block mb-1">Alt-tekst</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">
              Styles (bv. "width:100px;")
            </label>
            <input
              type="text"
              value={styles}
              onChange={(e) => setStyles(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Upload
          </button>
        </form>
      </div>

      {/* Weergave */}
      <div className="w-1/2 p-6 overflow-auto">
        <h2 className="text-2xl mb-4">Geüploade bestanden</h2>
        <div className="grid grid-cols-2 gap-4">
          {uploads.map((u) => (
            <div key={u.id} className="border p-3 rounded">
              {u.contentType.startsWith('image/') && (
                <img
                  src={u.url}
                  alt={u.alt}
                  style={parseStyles(u.styles)}
                />
              )}
              {u.contentType.startsWith('video/') && (
                <video
                  controls
                  src={u.url}
                  style={parseStyles(u.styles)}
                />
              )}
              {!u.contentType.startsWith('image/') &&
                !u.contentType.startsWith('video/') && (
                  <a
                    href={u.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={parseStyles(u.styles)}
                    className="text-blue-600 underline"
                  >
                    {u.filename}
                  </a>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestUploadPage;
