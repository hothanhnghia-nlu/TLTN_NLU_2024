import axios from "./customizeAxios";

const fetchAllSubject = () => {
    return axios.get("subjects");
}

const createSubject = (id, name, credit, imageFile, imageFileName) => {
    return axios.post("subjects", {id, name, credit, imageFile, imageFileName});
}

const updateSubject = (id, name, credit) => {
    return axios.put(`subjects/${id}`, {id, name, credit});
}

const deleteSubject = (id) => {
    return axios.delete(`subjects/${id}`);
}

export {fetchAllSubject, createSubject, updateSubject, deleteSubject};