import axios from "axios";

const instance = axios.create({
    baseURL: 'http://192.168.1.25/api/'
    // baseURL: 'https://localhost:44351/api/'
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    return response.data ? response.data : {statusText: response.statusText};
}, function (error) {
    let res = {};
    if (error.response) {
        res.data = error.response.data;
        res.status = error.response.status;
        res.headers = error.response.headers;
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
    return res;
});

export default instance;