import axios from "axios";

export default axios.create ({
    baseURL: "https://localhost:7151/api/",
    headers: { 
         "Content-Type" : "application/json", 
        // "Authorization" : 'Bearer'
    }

})