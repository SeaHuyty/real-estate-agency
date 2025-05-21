import { create } from "zustand";
import axios from "axios";

const BASE_URL = 'http://localhost:3000';

export const usePropertyStore = create((set, get) => ({
    properties: [],
    loading:false,
    error:null,

    fetchProperties: async (filters) => {
        set({ loading: true });

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        );

        const query = new URLSearchParams(cleanFilters).toString();

        try {
            const response = await axios.get(`${BASE_URL}/api/properties?${query}`);
            if (response.data.success && response.data.data) {
                set({ properties: response.data.data, error: null });
            } else {
                set({ properties: [], error: 'No data received from server' });
            }
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    }

}));