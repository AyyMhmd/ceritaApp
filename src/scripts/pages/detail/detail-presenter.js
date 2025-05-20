import StoryAPI from '../../data/story-api';
import { parseActivePathname } from '../../routes/url-parser';

class DetailPresenter {
    constructor({ view }) {
        this._view = view;
        this._storyAPI = StoryAPI;
    }

    async fetchStoryDetail() {
        try {
            this._view.showLoading();
            const token = localStorage.getItem('token');
            if (!token) {
                this._view.showLoginRequired();
                return;
            }
            const { id } = parseActivePathname();
            if (!id) {
                this._view.showIdNotFound();
                return;
            }
            const response = await this._storyAPI.getStoryDetail({ token, id });
            if (!response.error) {
                this._view.showStoryDetail(response.story);
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

export default DetailPresenter; 