import axios from "axios";
import Toast from "react-native-toast-message";

const refreshToken = async () => {
  return "new_access_token";
};
// console.log(process.env.REACT_NATIVE_APP_API_URL)
const axiosInstance = axios.create({
  baseURL: "https://truck.truckmessage.com",
  headers: {
    'Content-Type': 'application/json',
  }  
});

axiosInstance.interceptors.response.use(
  (response) => {       
    if (response.data.error_code === 0) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.data.message
      });
      // toast.success(response.data.message);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.data.message
      });
    }    
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      refreshToken()
      console.log("call the refresh token api here");
      // Handle 401 error, e.g., redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.request.use((config) => {

//   let token = localStorage.getItem("Token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } 

//   return config;
// });

export default axiosInstance;