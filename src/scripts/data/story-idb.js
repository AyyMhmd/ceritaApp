import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
        database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    },
});

const StoryIdb = {
    async getStory(id) {
        return (await dbPromise).get(OBJECT_STORE_NAME, id);
    },

    async getAllStories() {
        return (await dbPromise).getAll(OBJECT_STORE_NAME);
    },

    async putStory(story) {
        return (await dbPromise).put(OBJECT_STORE_NAME, story);
    },

    async deleteStory(id) {
        return (await dbPromise).delete(OBJECT_STORE_NAME, id);
    },

    async searchStories(query) {
        const stories = await this.getAllStories();
        return stories.filter((story) => {
            const loweredQuery = query.toLowerCase();
            const loweredDescription = story.description.toLowerCase();
            return loweredDescription.includes(loweredQuery);
        });
    },
};

export default StoryIdb; 