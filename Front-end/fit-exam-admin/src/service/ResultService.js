import axios from "./customizeAxios";

const fetchAllResult = () => {
    return axios.get("results");
}

export {fetchAllResult};