import axios from "./customizeAxios";

const fetchAllExam = () => {
    return axios.get("exams");
}

export {fetchAllExam};