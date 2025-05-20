import StoryIdb from '../data/story-idb';

class BookmarkButton extends HTMLElement {
    constructor() {
        super();
        this._story = null;
        this._isBookmarked = false;
    }

    set story(story) {
        this._story = story;
        this._render();
    }

    async connectedCallback() {
        if (!this._story) return;

        const bookmarked = await StoryIdb.getStory(this._story.id);
        this._isBookmarked = !!bookmarked;
        this._updateButton();

        this.querySelector('button').addEventListener('click', async () => {
            if (this._isBookmarked) {
                await this._removeBookmark();
            } else {
                await this._addBookmark();
            }
        });
    }

    async _addBookmark() {
        try {
            await StoryIdb.putStory(this._story);
            this._isBookmarked = true;
            this._updateButton();
        } catch (err) {
            console.error('Failed to bookmark story:', err);
        }
    }

    async _removeBookmark() {
        try {
            await StoryIdb.deleteStory(this._story.id);
            this._isBookmarked = false;
            this._updateButton();
            this.dispatchEvent(new CustomEvent('bookmark-removed', { bubbles: true, detail: { id: this._story.id } }));
        } catch (err) {
            console.error('Failed to remove bookmark:', err);
        }
    }

    _updateButton() {
        const button = this.querySelector('button');
        button.innerHTML = this._isBookmarked ?
            '<i class="fas fa-bookmark"></i>' :
            '<i class="far fa-bookmark"></i>';
        button.title = this._isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
        button.classList.toggle('bookmarked', this._isBookmarked);
    }

    _render() {
        this.innerHTML = `
            <button class="bookmark-button" aria-label="bookmark story">
                <i class="far fa-bookmark"></i>
            </button>
        `;
    }
}

customElements.define('bookmark-button', BookmarkButton); 