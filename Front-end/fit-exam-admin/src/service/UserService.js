import axios from "./customizeAxios";

const fetchAllUser = ({role}) => {
    return axios.get(`users/list?role=${role}`);
}

const fetchUserById = ({id}) => {
    return axios.get(`users/${id}`);
}

const updateUser = ({id}, name, email, phone, dob, gender, role, status) => {
    return axios.put(`users/${id}`, {name, email, phone, dob, gender, role, status});
}

const deleteUser = ({id}) => {
    return axios.delete(`users/${id}`);
}

const registerApi = (name, email, password, role) => {
    return axios.post("register", {name, email, password, role});
}

const loginApi = (email, password) => {
    return axios.post("login", {email, password});
}

export {fetchAllUser, fetchUserById, updateUser, deleteUser, registerApi, loginApi};