import axios from "axios";
import { HOST } from "@/utils/constants";

const apiClient = axios.create({
    baseURL: HOST,  // Sets the base URL for all API requests
    withCredentials: true, // Ensures cookies (such as authentication tokens) are sent with requests
  });
  
export default apiClient;
