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

const updateUserWithAvatar = async (id, name, email, phone, dob, gender, avatar) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('avatar', avatar);

    return await axios.put(`users/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteUser = ({id}) => {
    return axios.delete(`users/${id}`);
}

const registerApi = async (name, email, password, role) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    return await axios.post("register", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const loginApi = async (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return await axios.post("login", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export {fetchAllUser, fetchUserById, updateUser, updateUserWithAvatar, deleteUser, registerApi, loginApi};