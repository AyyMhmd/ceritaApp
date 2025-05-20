class BookmarkPresenter {
    #view = null;
    #model = null;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async getBookmarkedStories() {
        try {
            this.#view.showLoading();
            this.#view.showMapLoading();

            const stories = await this.#model.getAllStories();
            this.#view.displayBookmarkedStories(stories);
        } catch (error) {
            this.#view.displayError('Failed to load bookmarked stories');
            console.error('Error loading bookmarked stories:', error);
        } finally {
            this.#view.hideLoading();
            this.#view.hideMapLoading();
        }
    }
}

export default BookmarkPresenter; 