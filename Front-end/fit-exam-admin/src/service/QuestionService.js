import axios from "./customizeAxios";

const fetchAllQuestionByUserId = ({id}) => {
    return axios.get(`questions/user?id=${id}`);
}

const fetchQuestionById = ({id}) => {
    return axios.get(`questions/${id}`);
}

const fetchShuffleQuestions = ({id}) => {
    return axios.get(`questions/shuffle/user?id=${id}`);
}

const createQuestion = async (content, difficultyLevel, options, imageFile, examName) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('difficultyLevel', difficultyLevel);
    formData.append('imageFile', imageFile);
    formData.append('examName', examName);

    options.forEach((option, index) => {
        formData.append(`options[${index}].content`, option.content);
        formData.append(`options[${index}].isCorrect`, option.isCorrect);
    });

    return await axios.post("questions", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const updateQuestion = async (id, content, difficultyLevel, options, imageFile, examName) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('content', content);
    formData.append('difficultyLevel', difficultyLevel);
    formData.append('imageFile', imageFile);
    formData.append('examName', examName);

    options.forEach((option, index) => {
        formData.append(`options[${index}].content`, option.content);
        formData.append(`options[${index}].isCorrect`, option.isCorrect);
    });

    return await axios.put(`questions/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteQuestion = (id) => {
    return axios.delete(`questions/${id}`);
}

export {fetchAllQuestionByUserId, fetchQuestionById, fetchShuffleQuestions, createQuestion, updateQuestion, deleteQuestion};