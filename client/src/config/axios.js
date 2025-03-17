import axios from 'axios';

const  axiosinstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('Token'))}`,
  },
});


export default axiosinstance;