// src/scripts/pages/home/home-page.js
import StoryAPI from '../../data/story-api';
import HomePresenter from './home-presenter';
import { showFormattedDate } from '../../utils/formatter';
import CONFIG from '../../config';
import mapboxgl from 'mapbox-gl';
import '../../components/notification-button';
import '../../components/bookmark-button';

class HomePage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Stories</h1>
        <div class="header-actions">
          <notification-button></notification-button>
          <a href="#/bookmarks" class="bookmarks-link">
            <i class="fas fa-bookmark"></i> Saved Stories
          </a>
        </div>
        <div class="search-container">
          <input type="text" id="search-input" placeholder="Search stories..." aria-label="Search stories">
        </div>
        <div id="loading" class="loading-indicator"></div>
        <div id="stories-container" class="stories-container"></div>
        <div id="map" class="map-container"></div>
      </section>
    `;

    this._storyAPI = StoryAPI;
    this._presenter = new HomePresenter({
      view: this,
      storyAPI: this._storyAPI,
    });
  }

  async render() {
    return this._initialUI;
  }

  async afterRender() {
    this._initElements();
    this._initMap();
    this._initSearchHandler();
    await this._presenter.getAllStories();
  }

  _initElements() {
    this._loadingElement = document.getElementById('loading');
    this._storiesContainer = document.getElementById('stories-container');
    this._mapContainer = document.getElementById('map');
    this._searchInput = document.getElementById('search-input');
  }

  _initSearchHandler() {
    let debounceTimer;
    this._searchInput.addEventListener('input', (event) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = event.target.value.trim();
        if (query) {
          this._presenter.searchStories(query);
        } else {
          this._presenter.getAllStories();
        }
      }, 300);
    });
  }

  showLoading() {
    this._loadingElement.style.display = 'block';
  }

  hideLoading() {
    this._loadingElement.style.display = 'none';
  }

  showLoginRequired() {
    this._storiesContainer.innerHTML = `
      <div class="login-required">
        <p>Please <a href="#/login">login</a> to view stories</p>
      </div>
    `;
  }

  showStories(stories) {
    if (stories.length === 0) {
      this._storiesContainer.innerHTML = '<p class="empty-message">No stories available</p>';
      return;
    }

    let storiesHTML = '';
    stories.forEach((story) => {
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

      if (story.lat && story.lon) {
        this._addMarkerToMap(story);
      }
    });

    this._storiesContainer.innerHTML = storiesHTML;

    // Initialize bookmark buttons
    const bookmarkButtons = document.querySelectorAll('bookmark-button');
    bookmarkButtons.forEach((button, index) => {
      button.story = stories[index];
    });
  }

  showError(message) {
    this._storiesContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }

  _initMap() {
    mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;

    this._map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [119.2, -0.8],
      zoom: 4
    });

    this._map.addControl(new mapboxgl.NavigationControl());

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
      this._map.setStyle(e.target.value);
    });
  }

  _addMarkerToMap(story) {
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
      .addTo(this._map);
  }
}

export default HomePage;