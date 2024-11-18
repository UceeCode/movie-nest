# Project: MovieNest

## Description
MovieNest is a movie browsing and favorites management application. It fetches trending movies from The Movie Database (TMDb) API and allows users to search and save their favorite movies to local storage. The app is built using **React** and **Next.js**, making it a performant and SEO-friendly single-page application.

---

## Table of Contents
1. [Installation](#installation)
2. [Running the Application](#running-the-application)
3. [Code Structure](#code-structure)
4. [Design Decisions](#design-decisions)
5. [Contributing](#contributing)
6. [License](#license)

---

## Installation

### Clone the repository:
```bash
git clone https://github.com/your-username/movienest.git
cd movienest

## Install dependencies:
## Make sure you have npm or yarn installed. Then run:
npm install

Environment variables:
Create a .env.local file in the root of your project and add your TMDb API key:
NEXT_PUBLIC_TMDB_API_KEY=your-api-key-here

Start the development server:
Run the following command to start the development server:
npm run dev


Open your browser and navigate to http://localhost:3000 to view the application.

Running the Application
Once the application is running, you can navigate through the following sections:

Home: Displays trending movies and a search bar to search for movies.
Favorites: Displays your favorite movies stored in local storage.
About: Provides information about the app.

The application will persist your favorite movies across sessions using localStorage.

Code Structure
The code is structured to promote maintainability and scalability, with the following key components:

pages: Contains all the Next.js route components (home, about, favorite).
components: Contains reusable UI components like Navbar, MovieCard, SearchBar, and FavoriteButton.
utils: Contains utility functions like debounced search, fetching movies, and managing localStorage.
styles: Contains the global styles and component-specific styles (using Tailwind CSS).

Design Decisions
1. State Management with React Hooks:
We use React's built-in hooks (useState, useEffect, useCallback) to manage state and side effects. This approach avoids the need for external state management libraries like Redux, keeping the app lightweight and simple.

State: Each feature (e.g., movies, favorites, searchTerm) is managed separately using useState.
Side Effects: The app fetches movie data and interacts with localStorage using useEffect.

2. localStorage for Favorites:
To persist the user's favorite movies across sessions, we use the browser's localStorage. This choice simplifies the implementation without requiring backend storage. The trade-off is that localStorage has a limited storage capacity (5MB), which may not be suitable for larger-scale applications.

3. Debounced Search:
A debounced search is implemented using lodash.debounce to avoid sending requests to the TMDb API for each keystroke. This reduces the number of API calls and improves performance.

Trade-off: While debouncing improves performance, it introduces a small delay in user experience, which may feel less responsive, but this is an acceptable trade-off to prevent excessive API calls.

4. API Fetching and Caching:
The app fetches data from The Movie Database (TMDb) API. We load trending movies by default and support movie search functionality. Each search or page scroll fetches new data, and the results are appended to the current list. We ensure the movie data is cached in localStorage for the current session.

Trade-off: Fetching new data every time may cause a slight delay when scrolling. This could be improved with better caching strategies or pagination.

5. Responsive Design:
The layout is fully responsive and adjusts for various screen sizes using Tailwind CSS's utility-first classes. This ensures that the application looks good on all devices, from mobile phones to large desktop screens.


Contributing
We welcome contributions to MovieNest! If you'd like to contribute:

Fork the repository
Create a new branch (git checkout -b feature-name)
Commit your changes (git commit -m 'Add feature-name')
Push to your branch (git push origin feature-name)
Open a pull request


