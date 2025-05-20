// src/scripts/pages/add-story/add-story-page.js
import StoryAPI from '../../data/story-api';
import AddStoryPresenter from './add-story-presenter';
import CONFIG from '../../config';
import mapboxgl from 'mapbox-gl';

class AddStoryPage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Add New Story</h1>
        
        <div id="status-message" class="status-message"></div>
        <div id="loading" class="loading-indicator"></div>
        
        <form id="add-story-form" class="add-story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="photo">Photo</label>
            <div class="camera-container">
              <video id="camera-preview" autoplay></video>
              <canvas id="photo-canvas" style="display:none;"></canvas>
              <button type="button" id="capture-button" class="button">Capture Photo</button>
              <button type="button" id="retake-button" class="button" style="display:none;">Retake Photo</button>
              <img id="captured-image" style="display:none;" alt="Captured photo">
            </div>
          </div>
          
          <div class="form-group">
            <label for="location">Location</label>
            <div id="location-map" class="map-container"></div>
            <p id="selected-location">No location selected</p>
            <input type="hidden" id="latitude" name="latitude">
            <input type="hidden" id="longitude" name="longitude">
          </div>
          
          <button type="submit" class="submit-button">Submit Story</button>
        </form>
      </section>
    `;

    this._storyAPI = StoryAPI;
    this._presenter = new AddStoryPresenter({
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
    this._initCamera();
    this._initFormSubmit();
  }

  _initElements() {
    this._loadingElement = document.getElementById('loading');
    this._statusMessage = document.getElementById('status-message');
    this._form = document.getElementById('add-story-form');
    this._descriptionInput = document.getElementById('description');
    this._cameraPreview = document.getElementById('camera-preview');
    this._photoCanvas = document.getElementById('photo-canvas');
    this._captureButton = document.getElementById('capture-button');
    this._retakeButton = document.getElementById('retake-button');
    this._capturedImage = document.getElementById('captured-image');
    this._selectedLocation = document.getElementById('selected-location');
    this._latitudeInput = document.getElementById('latitude');
    this._longitudeInput = document.getElementById('longitude');

    this._stream = null;
    this._photoBlob = null;
  }

  _initCamera() {
    this._captureButton.addEventListener('click', () => {
      this._capturePhoto();
    });

    this._retakeButton.addEventListener('click', () => {
      this._resetCamera();
    });

    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this._stream = stream;
        this._cameraPreview.srcObject = stream;
      })
      .catch((error) => {
        this.showError(`Camera error: ${error.message}`);
      });
  }

  _capturePhoto() {
    const context = this._photoCanvas.getContext('2d');

    this._photoCanvas.width = this._cameraPreview.videoWidth;
    this._photoCanvas.height = this._cameraPreview.videoHeight;

    context.drawImage(this._cameraPreview, 0, 0, this._photoCanvas.width, this._photoCanvas.height);

    this._photoCanvas.toBlob((blob) => {
      this._photoBlob = blob;

      const imageUrl = URL.createObjectURL(blob);
      this._capturedImage.src = imageUrl;
      this._capturedImage.style.display = 'block';

      this._cameraPreview.style.display = 'none';
      this._captureButton.style.display = 'none';
      this._retakeButton.style.display = 'block';

      // Stop camera stream
      if (this._stream) {
        this._stream.getTracks().forEach(track => track.stop());
      }
    }, 'image/jpeg', 0.8);
  }

  _resetCamera() {
    this._capturedImage.style.display = 'none';
    this._retakeButton.style.display = 'none';

    this._cameraPreview.style.display = 'block';
    this._captureButton.style.display = 'block';

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this._stream = stream;
        this._cameraPreview.srcObject = stream;
      });
  }

  _initMap() {
    mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;

    this._map = new mapboxgl.Map({
      container: 'location-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [119.2, -0.8], // Indonesia center
      zoom: 4
    });

    this._map.addControl(new mapboxgl.NavigationControl());

    this._map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      this._latitudeInput.value = lat;
      this._longitudeInput.value = lng;

      // Show selected location
      this._selectedLocation.textContent = `Selected: Lat ${lat.toFixed(6)}, Long ${lng.toFixed(6)}`;

      // Add or update marker
      if (this._marker) {
        this._marker.setLngLat([lng, lat]);
      } else {
        this._marker = new mapboxgl.Marker({ color: '#FF4500' })
          .setLngLat([lng, lat])
          .addTo(this._map);
      }
    });
  }

  _initFormSubmit() {
    this._form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!this._photoBlob) {
        this.showError('Please capture a photo first');
        return;
      }

      const formData = new FormData();
      formData.append('description', this._descriptionInput.value);
      formData.append('photo', this._photoBlob, 'photo.jpg');

      // Add location if selected
      if (this._latitudeInput.value && this._longitudeInput.value) {
        formData.append('lat', this._latitudeInput.value);
        formData.append('lon', this._longitudeInput.value);
      }

      const success = await this._presenter.addStory(formData);
      if (success) {
        // Clean up resources
        if (this._stream) {
          this._stream.getTracks().forEach(track => track.stop());
        }

        // Redirect to home after short delay
        setTimeout(() => {
          window.location.hash = '#/';
        }, 1500);
      }
    });
  }

  showLoading() {
    this._loadingElement.style.display = 'block';
  }

  hideLoading() {
    this._loadingElement.style.display = 'none';
  }

  showSuccess(message) {
    this._statusMessage.textContent = message;
    this._statusMessage.className = 'status-message success';
  }

  showError(message) {
    this._statusMessage.textContent = message;
    this._statusMessage.className = 'status-message error';
  }

  destroy() {
    // Matikan kamera jika masih aktif
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
  }
}

export default AddStoryPage;