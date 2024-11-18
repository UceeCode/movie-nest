"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Retrieve favorites from localStorage when the component mounts
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    console.log("savedFavorites on mount:", savedFavorites); // Debugging: Check localStorage content
    if (savedFavorites) {
      try {
        const parsedFavorites: Movie[] = JSON.parse(savedFavorites);
        console.log("Parsed favorites:", parsedFavorites); // Debugging: Check parsed favorites
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error("Error parsing favorites from localStorage", error);
      }
    } else {
      console.log("No favorites in localStorage."); // Debugging: If localStorage is empty
    }
  }, []); // This will run once when the component is mounted

  // Store favorites in localStorage when the favorites state changes
  useEffect(() => {
    console.log("favorites state changed:", favorites); // Debugging: Check if the favorites state is changing
    if (favorites.length > 0) {
      try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Saving favorites to localStorage:", favorites); // Debugging: Ensure data is saved
      } catch (error) {
        console.error("Error saving favorites to localStorage", error);
      }
    } else {
      console.log("No favorites to save in localStorage."); // Debugging: If no favorites to save
    }
  }, [favorites]); // This will run every time the favorites array is updated

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      {/* Navbar */}
      <nav className="bg-black-900 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-6">
            <span className="text-2xl font-extrabold text-white-400">MovieNest</span>
          </div>
          <ul className="flex space-x-8 text-lg">
            <li>
              <Link href="/" className="hover:text-red-400 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/favorites" className="hover:text-red-400 transition duration-300">
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

      {/* Favorite Movies Grid */}
      <div className="container mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`Poster for ${movie.title}`}
                  width={500}
                  height={750}
                  className="object-cover w-full h-80"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white truncate">{movie.title}</h2>
                  <p className="text-sm text-gray-400">Release Date: {movie.release_date}</p>
                  <p className="text-sm text-yellow-400">
                    Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
