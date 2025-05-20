import BookmarkPresenter from './bookmark-presenter';
import StoryIdb from '../../data/story-idb';
import mapboxgl from 'mapbox-gl';
import CONFIG from '../../config';
import { showFormattedDate } from '../../utils/formatter';

export default class BookmarkPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      
      <section>
        <div class="map-container">
          <div id="map" class="bookmark-map"></div>
          <div id="map-loading" class="loading-indicator"></div>
        </div>
      </section>

      <section id="content" class="container">
        <h1 class="page-title">Bookmarked Stories</h1>

        <div class="bookmarked-stories">
          <div id="stories-container" class="stories-container"></div>
          <div id="loading" class="loading-indicator"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: StoryIdb,
    });

    await this.#initializeMap();
    await this.#presenter.getBookmarkedStories();

    // Listen for bookmark removal and refresh the list
    const storiesContainer = document.getElementById('stories-container');
    if (storiesContainer) {
      storiesContainer.addEventListener('bookmark-removed', async () => {
        await this.#presenter.getBookmarkedStories();
      });
    }
  }

  async #initializeMap() {
    mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;

    this.#map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [119.2, -0.8], // Indonesia center
      zoom: 4,
    });

    this.#map.addControl(new mapboxgl.NavigationControl());

    // Add layer control
    const layerControl = document.createElement('div');
    layerControl.className = 'layer-control';
    layerControl.innerHTML = `
      <select id="map-style">
        <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
        <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
        <option value="mapbox://styles/mapbox/light-v10">Light</option>
        <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
      </select>
    `;

    document.getElementById('map').appendChild(layerControl);
    document.getElementById('map-style').addEventListener('change', (e) => {
      this.#map.setStyle(e.target.value);
    });
  }

  displayBookmarkedStories(stories) {
    if (stories.length <= 0) {
      this.displayEmptyBookmarks();
      return;
    }

    let storiesHTML = '';
    stories.forEach((story) => {
      // Add marker to map if location exists
      if (story.lat && story.lon) {
        this.#addMarkerToMap(story);
      }

      storiesHTML += `
        <article class="story-item">
          <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image">
          <div class="story-content">
            <h2 class="story-title">${story.name}</h2>
            <p class="story-date">${showFormattedDate(story.createdAt)}</p>
            <p class="story-description">${story.description}</p>
            <div class="story-actions">
              <a href="#/detail/${story.id}" class="story-link">View Details</a>
              <bookmark-button class="bookmark-btn"></bookmark-button>
            </div>
          </div>
        </article>
      `;
    });

    document.getElementById('stories-container').innerHTML = storiesHTML;

    // Initialize bookmark buttons
    const bookmarkButtons = document.querySelectorAll('bookmark-button');
    bookmarkButtons.forEach((button, index) => {
      button.story = stories[index];
    });
  }

  #addMarkerToMap(story) {
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="popup-content">
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="Story image" width="100">
          <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
          <a href="#/detail/${story.id}">View Details</a>
        </div>
      `);

    new mapboxgl.Marker({ color: '#FF4500' })
      .setLngLat([story.lon, story.lat])
      .setPopup(popup)
      .addTo(this.#map);
  }

  displayEmptyBookmarks() {
    document.getElementById('stories-container').innerHTML = `
      <div class="empty-message">
        <i class="fas fa-bookmark"></i>
        <p>No bookmarked stories yet</p>
      </div>
    `;
  }

  displayError(message) {
    document.getElementById('stories-container').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
      </div>
    `;
  }

  showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  showMapLoading() {
    document.getElementById('map-loading').style.display = 'block';
  }

  hideMapLoading() {
    document.getElementById('map-loading').style.display = 'none';
  }
} 