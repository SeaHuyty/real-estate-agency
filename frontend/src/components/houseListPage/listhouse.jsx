import { create } from "zustand";
import axios from "axios";

const BASE_URL = 'http://localhost:3000';

export const usePropertyStore = create((set, get) => ({
    properties: [],
    loading:false,
    error:null,

    fetchProperties: async (province) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/properties/${province}`);
            set({ properties:response.data.data,error:null });
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    }
}));