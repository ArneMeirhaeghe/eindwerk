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

// type & styles optioneel, alt verplicht
export const uploadFile = async (
  file: File,
  alt: string,
  type = "",
  styles = ""
): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt', alt);
  formData.append('styles', styles);
  // indien je type nog wilt meesturen:
  // formData.append('type', type);

  const res = await API.post<MediaResponse>('/media/upload', formData);
  return res.data;
};

export const getUploads = async (): Promise<MediaResponse[]> => {
  const res = await API.get<MediaResponse[]>('/media');
  return res.data;
};

export const deleteUpload = async (id: string): Promise<void> => {
  await API.delete(`/media/${id}`);
};
