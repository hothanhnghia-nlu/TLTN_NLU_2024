import axios from "./customizeAxios";

const fetchAllResult = () => {
    return axios.get("results");
}

const fetchAllResultByTeacherId = ({id}) => {
    return axios.get(`results/teacher?id=${id}`);
}

const fetchResultDetailByQuestionId = ({id}) => {
    return axios.get(`resultDetails/result?id=${id}`);
}

export {fetchAllResult, fetchAllResultByTeacherId, fetchResultDetailByQuestionId};