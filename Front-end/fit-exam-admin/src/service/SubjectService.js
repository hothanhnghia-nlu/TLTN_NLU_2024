import axios from "./customizeAxios";

const fetchAllSubject = () => {
    return axios.get("subjects");
}

const createSubject = async (id, name, credit, imageFile) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('credit', credit);
    formData.append('imageFile', imageFile);

    return await axios.post("subjects", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const updateSubject = async (id, name, credit, imageFile) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('credit', credit);
    formData.append('imageFile', imageFile);

    return await axios.put(`subjects/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteSubject = (id) => {
    return axios.delete(`subjects/${id}`);
}

export {fetchAllSubject, createSubject, updateSubject, deleteSubject};