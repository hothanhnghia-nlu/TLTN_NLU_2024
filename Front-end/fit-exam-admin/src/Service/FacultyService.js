import axios from "./customizeAxios";

const fetchAllFaculty = () => {
    return axios.get("faculties");
}

const createFaculty = (name) => {
    return axios.post("faculties", {name});
}

const updateFaculty = (id, name) => {
    return axios.put(`faculties/${id}`, {id, name});
}

const deleteFaculty = (id) => {
    return axios.delete(`faculties/${id}`);
}

export {fetchAllFaculty, createFaculty, updateFaculty, deleteFaculty};