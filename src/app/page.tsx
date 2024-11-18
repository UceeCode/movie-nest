"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import debounce from "lodash.debounce";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch favorite movie IDs from localStorage whenever it changes
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites).map(
        (movie: Movie) => movie.id
      );
      setFavorites(parsedFavorites);
    }
  }, []); // Empty dependency array to run only once when component mounts

  // Save updated favorites to localStorage whenever favorites change
  useEffect(() => {
    const favoriteMovies = movies.filter((movie) =>
      favorites.includes(movie.id)
    );
    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
  }, [favorites, movies]);

  const fetchMovies = async (pageNumber: number, search: string = "") => {
    setLoading(true);
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    const endpoint = search
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}&page=${pageNumber}`
      : `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US&page=${pageNumber}`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (pageNumber === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((value: string) => {
      setPage(1);
      fetchMovies(1, value);
    }, 500),
    []
  );

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1);
      }
    }, 200),
    []
  );

  useEffect(() => {
    fetchMovies(page, searchTerm);
  }, [page, searchTerm]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleFavorite = (movieId: number) => {
    setFavorites((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      {/* Navbar */}
      <nav className="bg-black-900 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-6">
            <span className="text-2xl font-extrabold text-white-400">
              MovieNest
            </span>
          </div>
          <ul className="flex space-x-8 text-lg">
            <li>
              <Link href="/" className="hover:text-red-400 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/favorite" className="hover:text-red-400 transition duration-300">
                Favorites
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-red-400 transition duration-300">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="container mx-auto px-6 py-8">
        <input
          type="text"
          placeholder="Search movies..."
          className="w-full p-4 rounded-md border-2 border-white-400 bg-gray-800 text-white placeholder-white-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>

      {/* Movie Grid */}
      <div className="container mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading ? (
          // Skeleton Loading
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg overflow-hidden relative animate-pulse"
            >
              <div className="w-full h-80 bg-gray-600"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-600 rounded"></div>
              </div>
            </div>
          ))
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg overflow-hidden relative"
            >
              {/* Link to Movie Details */}
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="object-cover w-full h-80"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Release Date: {movie.release_date}
                  </p>
                  <p className="text-sm text-yellow-400">
                    Rating: {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </Link>
              {/* Favorite Icon */}
              <button
                onClick={() => toggleFavorite(movie.id)}
                className={`absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center ${
                  favorites.includes(movie.id) ? "bg-red-400" : "bg-gray-600"
                } hover:bg-red-500 transition duration-300`}
              >
                <span className="text-white text-lg">
                  {favorites.includes(movie.id) ? "♥" : "♡"}
                </span>
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No movies found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
