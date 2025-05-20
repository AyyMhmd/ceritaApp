// src/scripts/pages/app.js
import { getPage } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupSkipToContent();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupSkipToContent() {
    const skipLink = document.createElement('div');
    skipLink.className = 'skip-link';
    skipLink.innerHTML = '<a href="#main-content" class="skip-to-content">Skip to content</a>';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = getPage(url);

    // Destroy previous page if it has destroy method
    if (this.#currentPage && typeof this.#currentPage.destroy === 'function') {
      this.#currentPage.destroy();
    }
    this.#currentPage = page;

    try {
      // Use View Transitions API if available
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        }).finished;
      } else {
        // Fallback for browsers that don't support View Transitions API
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = `
        <div class="container">
          <h2>Error</h2>
          <p>Something went wrong: ${error.message}</p>
          <a href="#/">Go to Home</a>
        </div>
      `;
    }
  }
}

export default App;