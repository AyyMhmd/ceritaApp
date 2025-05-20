import StoryAPI from '../../data/story-api';

class RegisterPresenter {
    constructor({ view }) {
        this._view = view;
        this._storyAPI = StoryAPI;
    }

    async register(registerData) {
        try {
            this._view.showLoading();
            const response = await this._storyAPI.register(registerData);
            if (!response.error) {
                this._view.showSuccess('Registration successful! Please login.');
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 1500);
            } else {
                this._view.showError(response.message);
            }
        } catch (error) {
            this._view.showError(error.message);
        } finally {
            this._view.hideLoading();
        }
    }
}

export default RegisterPresenter; 