import axios from "axios";

export const useApi = () => {
  return axios.create({
    baseURL: 'http://localhost/api',
    withCredentials: true,
    withXSRFToken: true
  });
}