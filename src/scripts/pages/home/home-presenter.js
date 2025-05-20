// src/scripts/pages/home/home-presenter.js
import StoryIdb from '../../data/story-idb';

class HomePresenter {
  constructor({ view, storyAPI }) {
    this._view = view;
    this._storyAPI = storyAPI;
    this._stories = [];
  }

  async getAllStories() {
    try {
      this._view.showLoading();
      const token = localStorage.getItem('token');

      if (!token) {
        this._view.showLoginRequired();
        return;
      }

      // Try to get stories from IndexedDB first
      const cachedStories = await StoryIdb.getAllStories();
      if (cachedStories.length > 0) {
        this._stories = cachedStories;
        this._view.showStories(this._stories);
      }

      // Then fetch from API
      const response = await this._storyAPI.getAllStories({
        token,
        location: 1 // Get stories with location
      });

      if (!response.error) {
        this._stories = response.listStory;
        // Update the view with fresh data
        this._view.showStories(this._stories);
        // Cache the stories in IndexedDB
        await Promise.all(this._stories.map(story => StoryIdb.putStory(story)));
      } else {
        // If API call fails and we don't have cached data, show error
        if (cachedStories.length === 0) {
          this._view.showError(response.message);
        }
      }
    } catch (error) {
      // If error occurs and we have cached data, keep showing it
      const cachedStories = await StoryIdb.getAllStories();
      if (cachedStories.length > 0) {
        this._stories = cachedStories;
        this._view.showStories(this._stories);
      } else {
        this._view.showError(error.message);
      }
    } finally {
      this._view.hideLoading();
    }
  }

  async searchStories(query) {
    try {
      this._view.showLoading();
      const stories = await StoryIdb.searchStories(query);
      this._view.showStories(stories);
    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default HomePresenter;