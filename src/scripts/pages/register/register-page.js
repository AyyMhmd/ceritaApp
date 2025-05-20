// src/scripts/pages/register/register-page.js
import StoryAPI from '../../data/story-api';
import RegisterPresenter from './register-presenter';

class RegisterPage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Register</h1>
        
        <div id="status-message" class="status-message"></div>
        <div id="loading" class="loading-indicator"></div>
        
        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
            <small>Password must be at least 8 characters</small>
          </div>
          
          <button type="submit" class="submit-button">Register</button>
          
          <p class="auth-link">
            Already have an account? <a href="#/login">Login</a>
          </p>
        </form>
      </section>
    `;

    this._storyAPI = StoryAPI;
    this._presenter = new RegisterPresenter({ view: this });
  }

  async render() {
    return this._initialUI;
  }

  async afterRender() {
    this._initElements();
    this._initFormSubmit();
  }

  _initElements() {
    this._loadingElement = document.getElementById('loading');
    this._statusMessage = document.getElementById('status-message');
    this._form = document.getElementById('register-form');
    this._nameInput = document.getElementById('name');
    this._emailInput = document.getElementById('email');
    this._passwordInput = document.getElementById('password');
  }

  _initFormSubmit() {
    this._form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const registerData = {
        name: this._nameInput.value,
        email: this._emailInput.value,
        password: this._passwordInput.value,
      };
      this._presenter.register(registerData);
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
}

export default RegisterPage;