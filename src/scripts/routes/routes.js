// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailPage from '../pages/detail/detail-page';
import BookmarkedPage from '../pages/bookmark/bookmark-page';
import NotFound from '../views/pages/not-found';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add': new AddStoryPage(),
  '/detail/:id': new DetailPage(),
  '/bookmarks': new BookmarkedPage(),
};

const getPage = (url) => {
  return routes[url] || new NotFound();
};

export { routes, getPage };