import axios from "./customizeAxios";

const fetchAllLog = () => {
    return axios.get("logs");
}

export {fetchAllLog};