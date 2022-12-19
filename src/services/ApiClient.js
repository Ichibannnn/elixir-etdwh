import axios from "axios";
import { decodeUser } from "./decode-user";

const user = decodeUser()

// Set config defaults when creating the instance
const request = axios.create({
    baseURL: 'https://localhost:7151/api/',
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer '+user?.token
  }
  });
  
export default request


// import axios from "axios";

// export default axios.create ({
//     baseURL: "https://localhost:7151/api/",
//     // headers: { 
//     //      "Content-Type" : "application/json", 
//     //     // "Authorization" : 'Bearer'
//     // }

// })