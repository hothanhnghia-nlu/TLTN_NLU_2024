import axios from "./customizeAxios";

const fetchAllUser = ({role}) => {
    return axios.get(`users/list?role=${role}`);
}

const fetchUserById = ({id}) => {
    return axios.get(`users/${id}`);
}

const fetchUserIdByEmail = ({email}) => {
    return axios.get(`users/id?email=${email}`);
}

const updateUser = async (id, name, email, phone, dob, gender, role, status, avatar = null) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('role', role);
    formData.append('status', status);

    if (avatar) {
        formData.append('avatar', avatar);
    }

    return await axios.put(`users/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const changePassword = async (id, password) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('password', password);

    return await axios.put(`users/change-password/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const sendEmail = async (email) => {
    const formData = new FormData();
    formData.append('email', email);

    return await axios.post("users/send-mail", formData, {
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

export {fetchAllUser, fetchUserById, fetchUserIdByEmail, updateUser, sendEmail,
    changePassword, deleteUser, registerApi, loginApi};