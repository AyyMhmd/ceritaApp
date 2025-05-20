import StoryAPI from '../../data/story-api';
import AuthModel from '../../data/auth-model';

class LoginPresenter {
    constructor({ view }) {
        this._view = view;
        this._storyAPI = StoryAPI;
    }

    async login(loginData) {
        try {
            this._view.showLoading();
            const response = await this._storyAPI.login(loginData);
            if (!response.error) {
                const { token, userId, name } = response.loginResult;
                AuthModel.setAuthData({ token, userId, name });
                this._view.showSuccess('Login successful!');
                this._view.goToHomePage();
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

export default LoginPresenter; 