import { defineStore } from 'pinia';
import request from '@/http/request';

const state = () => ({
  SPECIALS: [],
  loadingSpecials: false,
});

const actions = {
  async getSpecialsAthinoramaAction() {
    try {
      this.setLoadingSpecialsAction(true)
      const response = await request.get(`/athinoramaSpecials`);
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
