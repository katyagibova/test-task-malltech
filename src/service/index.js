import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: false,
    timeout: 10000,
});

export const api = {
    getAllPeople() {
        return apiClient.get(`/people`);
    },
    createNewItem(data) {
        return apiClient.post(`/people`, data);
    },
    editItem(data) {
        return apiClient.put(`/people/${data.id}`, data);
    },
    deleteItem(id) {
        return apiClient.delete(`/people/${id}`);
    },
}