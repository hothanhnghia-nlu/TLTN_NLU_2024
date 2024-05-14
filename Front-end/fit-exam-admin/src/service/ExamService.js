import axios from "./customizeAxios";

const fetchAllExam = () => {
    return axios.get("exams");
}

const createExam = (name, subjectId, creatorId, examTime, numberOfQuestions, startDate, endDate) => {
    return axios.post("exams", {name, subjectId, creatorId, examTime, numberOfQuestions, startDate, endDate});
}

const updateExam = (id, name) => {
    return axios.put(`exams/${id}`, {id, name});
}

const deleteExam = (id) => {
    return axios.delete(`exams/${id}`);
}

export {fetchAllExam, createExam, updateExam, deleteExam};