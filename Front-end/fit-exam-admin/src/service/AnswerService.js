import axios from "./customizeAxios";

const fetchAllAnswer = () => {
    return axios.get("answers");
}

const fetchAllAnswerByQuestionId = ({id}) => {
    return axios.get(`answers/question?id=${id}`);
}


export {fetchAllAnswer, fetchAllAnswerByQuestionId};