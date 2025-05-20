import AboutPresenter from './about-presenter';

class AboutPage {
  constructor() {
    this._presenter = new AboutPresenter({ view: this });
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content" id="skipLink">Lewati ke konten</a>
      </div>
      <section id="content" class="container" tabindex="-1">
        ${this.renderAboutContent()}
      </section>
      <div id="loadingSkeleton" class="loading-indicator"></div>
    `;
  }

  async render() {
    return this._initialUI;
  }

  renderAboutContent() {
    return `
      <div class="about-content">
        <p>
        </p>
        ${this.renderFeatures()}
        ${this.renderTechStack()}
      </div>
    `;
  }

  renderFeatures() {
    return `
      
    `;
  }

  renderTechStack() {
    return `
      <div class="tech-stack">
        <h2>KELUH KESAH</h2>
        <p>Aplikasi ini dibangun menggunakan:</p>
        <ul>
          <li>EMOSI</li>
          <li>MUMET</li>
          <li>PUSING</li>
          <li>TANTRUM</li>
          <li>STRESS</li>
        </ul>
      </div>
    `;
  }

  async afterRender() {
    const skipLink = document.getElementById('skipLink');
    const content = document.getElementById('content');

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      content.focus();
      content.scrollIntoView({ behavior: 'smooth' });
    });

    const loadingSkeleton = document.getElementById('loadingSkeleton');
    if (loadingSkeleton) {
      loadingSkeleton.style.display = 'none';
    }
  }
}

export default AboutPage;
