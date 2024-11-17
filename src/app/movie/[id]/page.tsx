"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
  cast?: { name: string; character: string }[]; // Optional cast
}

const MovieDetails: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      setLoading(true);
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const movieEndpoint = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
      const castEndpoint = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`;

      try {
        const [movieResponse, castResponse] = await Promise.all([
          fetch(movieEndpoint),
          fetch(castEndpoint),
        ]);

        const movieData = await movieResponse.json();
        const castData = await castResponse.json();

        setMovie({
          ...movieData,
          cast: castData.cast.slice(0, 5), // Limit to 5 cast members
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-6 bg-black text-white text-center">
        <p className="text-xl text-gray-500">Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-6 py-6 bg-black text-white text-center">
        <p className="text-xl text-gray-500">Movie not found.</p>
      </div>
    );
  }

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
              <Link
                href="/"
                className="hover:text-red-400 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="hover:text-red-400 transition duration-300"
              >
                Favorites
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-red-400 transition duration-300"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Movie Details */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center">
          {/* Poster Image */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="object-cover w-full h-96 rounded-lg shadow-xl"
            />
          </div>
          {/* Movie Information */}
          <div className="w-full md:w-2/3 md:pl-12">
            <h1 className="text-3xl font-semibold text-white mb-4">{movie.title}</h1>
            <p className="text-lg text-gray-400 mb-4">Release Date: {movie.release_date}</p>
            <p className="text-lg text-yellow-400 mb-4">Rating: {movie.vote_average.toFixed(1)}</p>
            <p className="text-lg text-white mb-6">{movie.overview}</p>

            {/* Genres */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Genres:</h2>
              <ul className="flex flex-wrap space-x-4 text-gray-400">
                {movie.genres.map((genre) => (
                  <li key={genre.id} className="bg-gray-800 py-1 px-3 rounded-full text-sm">
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Cast:</h2>
                <ul className="text-gray-400">
                  {movie.cast.map((actor, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-semibold">{actor.name}</span> as {actor.character}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Back Button */}
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-500 transition duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
