import axios from "./customizeAxios";

const fetchAllAnswerByQuestionId = ({id}) => {
    return axios.get(`answers/question?id=${id}`);
}


export {fetchAllAnswerByQuestionId};