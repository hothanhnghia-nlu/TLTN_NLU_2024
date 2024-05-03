import axios from "./customizeAxios";

const fetchAllExam = () => {
    return axios.get("subjects");
}

export {fetchAllExam};