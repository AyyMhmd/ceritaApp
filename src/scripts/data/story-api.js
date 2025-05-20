// src/scripts/data/story-api.js
import CONFIG from '../config';

const API_ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

class StoryAPI {
  static async register({ name, email, password }) {
    const response = await fetch(API_ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return await response.json();
  }

  static async login({ email, password }) {
    const response = await fetch(API_ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  }

  static async getAllStories({ token, page = 1, size = 10, location = 0 }) {
    const response = await fetch(
      `${API_ENDPOINT.GET_ALL_STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  }

  static async getStoryDetail({ token, id }) {
    const response = await fetch(API_ENDPOINT.GET_STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }

  static async addStory({ token, formData }) {
    const response = await fetch(API_ENDPOINT.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await response.json();
  }

  static async addStoryGuest({ formData }) {
    const response = await fetch(API_ENDPOINT.ADD_STORY_GUEST, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  }

  static async subscribe({ token, subscription }) {
    const response = await fetch(API_ENDPOINT.SUBSCRIBE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });
    return await response.json();
  }

  static async unsubscribe({ token, endpoint }) {
    const response = await fetch(API_ENDPOINT.UNSUBSCRIBE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });
    return await response.json();
  }
}

export default StoryAPI;