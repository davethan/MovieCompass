import { defineStore } from 'pinia';
import axios from 'axios';
const { VITE_BACKEND_URL } = import.meta.env;

const state = () => ({
  SPECIALS: [],
  loadingSpecials: false,
});

const actions = {
  async getSpecialsAthinoramaAction() {
    try {
      this.setLoadingSpecialsAction(true)
      const response = await axios.get(`${VITE_BACKEND_URL}/athinoramaSpecials`);
      this.setSpecialsAction(response.data);
      return true
    } catch {
      return false
    } finally {
      this.setLoadingSpecialsAction(false)
    }
  },
  setSpecialsAction(payload) {
    this.SPECIALS = [...payload];
  },
  setLoadingSpecialsAction(value) {
    this.loadingSpecials = value;
  },
};

const getters = {};

export const useSpecialsStore = defineStore('specials', {
  state,
  actions,
  getters
});
