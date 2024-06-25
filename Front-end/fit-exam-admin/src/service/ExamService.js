import axios from "./customizeAxios";

const fetchAllExamByCreatorId = ({id}) => {
    return axios.get(`exams/creator?id=${id}`);
}

const createExam = (name, subjectId, creatorId, examTime, numberOfQuestions, startDate, endDate) => {
    return axios.post("exams", {name, subjectId, creatorId, examTime, numberOfQuestions, startDate, endDate});
}

const updateExam = (id, name, subjectId, examTime, numberOfQuestions, startDate, endDate) => {
    return axios.put(`exams/${id}`, {id, name, subjectId, examTime, numberOfQuestions, startDate, endDate});
}

const deleteExam = (id) => {
    return axios.delete(`exams/${id}`);
}

export {fetchAllExamByCreatorId, createExam, updateExam, deleteExam};