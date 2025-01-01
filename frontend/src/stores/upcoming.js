import { defineStore } from 'pinia';
import request from '@/http/request';

const state = () => ({
  UPCOMING_LINKS: [],
  UPCOMING: [],
  loadingUpcoming: false,
});

const actions = {
  async getUpcomingLinksAction() {
    try {
      const response = await request.get(`/flixUpcomingLinks`);
      this.setUpcomingLinksAction(response.data);
      return true
    } catch {
      return false
    }
  },
  async getUpcomingFilmDetailsAction(payload) {
    try {
      const response = await request.post(`/flixUpcomingFilmDetails`, { url: payload });
      this.setUpcomingAction(response.data);
      return true;
    }
    catch {
      return false;
    }
  },
  //generic action to fill the upcoming state
  async getAllUpcomingFilmDetailsAction() {
    this.resetUpcomingStore()
    try {
      this.setLoadingUpcomingAction(true)
      await this.getUpcomingLinksAction();
      const requests = [];
      this.UPCOMING_LINKS.forEach((link) => {
        requests.push(this.getUpcomingFilmDetailsAction(link));
      });
      await Promise.allSettled(requests);
      return true;
    }
    catch {
      return false;
    } finally {
      this.setLoadingUpcomingAction(false)
    }
  },
  setUpcomingAction(payload) {
    this.UPCOMING.push(payload);
  },
  setUpcomingLinksAction(payload) {
    this.UPCOMING_LINKS = [...payload];
  },
  setLoadingUpcomingAction(value) {
    this.loadingUpcoming = value;
  },
  resetUpcomingStore() {
    this.$reset()
  }
};

const getters = {};

export const useUpcomingStore = defineStore('upcoming', {
  state,
  actions,
  getters
});
