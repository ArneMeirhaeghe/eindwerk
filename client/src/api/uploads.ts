import API from './axios';

export interface MediaResponse {
  id: string;
  filename: string;
  contentType: string;
  alt: string;
  styles: string;
  timestamp: string;
  url: string;
}

// ┌───────────────────────────────────────────────────────────┐
// │ 1) ‘type’ bepaalt virtuele subfolder: img | video | files │
// └───────────────────────────────────────────────────────────┘
export const uploadFile = async (
  file: File,
  alt: string,
  type: 'img' | 'video' | 'files' = 'files',
  styles = ''
): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt', alt);
  formData.append('type', type);
  formData.append('styles', styles);

  const res = await API.post<MediaResponse>(
    '/media/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return res.data;
};

// ┌───────────────────┐
// │ 2) lijst alle items │
// └───────────────────┘
export const getUploads = async (): Promise<MediaResponse[]> => {
  const res = await API.get<MediaResponse[]>('/media');
  return res.data;
};

// ┌──────────────────────────────────┐
// │ 3) verwijder één item op id      │
// └──────────────────────────────────┘
export const deleteUpload = async (id: string): Promise<void> => {
  await API.delete(`/media/${id}`);
};
