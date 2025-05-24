import API from './axios';

export const loginUser = async (email: string, password: string) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data.token;
};

export const registerUser = async (email: string, password: string) => {
  const res = await API.post('/auth/register', { email, password });
  return res.data;
};
