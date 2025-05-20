// src/scripts/pages/add-story/add-story-presenter.js
class AddStoryPresenter {
    constructor({ view, storyAPI }) {
      this._view = view;
      this._storyAPI = storyAPI;
    }
  
    async addStory(formData) {
      try {
        this._view.showLoading();
        
        const token = localStorage.getItem('token');
        let response;
        
        if (token) {
          response = await this._storyAPI.addStory({ token, formData });
        } else {
          response = await this._storyAPI.addStoryGuest({ formData });
        }
        
        if (!response.error) {
          this._view.showSuccess('Story added successfully!');
          return true;
        } else {
          this._view.showError(response.message);
          return false;
        }
      } catch (error) {
        this._view.showError(error.message);
        return false;
      } finally {
        this._view.hideLoading();
      }
    }
  }
  
  export default AddStoryPresenter;