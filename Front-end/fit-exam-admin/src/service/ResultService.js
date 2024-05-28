import axios from "./customizeAxios";

const fetchAllResult = () => {
    return axios.get("results");
}

const fetchResultDetailByQuestionId = ({id}) => {
    return axios.get(`resultDetails/result?id=${id}`);
}

export {fetchAllResult, fetchResultDetailByQuestionId};