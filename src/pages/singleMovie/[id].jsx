// pages/[id].js
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // Fetch data based on the id (use your own fetching logic)
  const fetchData = async () => {
    const response = await fetch(
      `https://omdbapi.com/?apikey=88ffad7c&i=${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json(); // Parse the response as JSON
    setMovie(data);
    console.log(data);
    setLoading(false);
  };

  // Call the fetchData function when the component mounts
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAdd = async (e) => {
    const posterData = {
      Poster: movie.Poster,
      Title: movie.Title,
      Type: movie.Type,
      Year: movie.Year,
      imdbID: movie.imdbID,
    };

    try {
      const response = await fetch(
        "http://localhost:8000/posters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(posterData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create poster");
      }

      const createdPoster = await response.json();
      console.log("Created Poster:", createdPoster);

      // Optionally, you can redirect or update state after successful creation
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <main className={` min-h-screen`}>
      <div className="bg-black flex justify-end p-4 w-[100vw]">
        <Link href={`/favourite`}>
          <p className="text-white my-auto text-xl cursor-pointer hover:text-blue-200 mr-20">
            Favorites
          </p>
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-20 px-10">
          <div className="flex">
            <div>
              <img src={movie.Poster} className="w-[22vw] min-w-[300px]" />
            </div>
            <div className="ml-8">
              <p className="text-[36px]">{movie.Title}</p>
              <ul className="mt-4">
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Actors:
                  </span>
                  {movie.Actors}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Awards:
                  </span>
                  {movie.Awards}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Director:
                  </span>
                  {movie.Director}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Genre:
                  </span>
                  {movie.Genre}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Runtime:
                  </span>
                  {movie.Runtime}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Year:
                  </span>
                  {movie.Year}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Director:
                  </span>
                  {movie.Director}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Genre:
                  </span>
                  {movie.Genre}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Runtime:
                  </span>
                  {movie.Runtime}
                </li>
                <li className="mt-2">
                  <span className="text-lg font-semibold text-[24px]">
                    Year:
                  </span>
                  {movie.Year}
                </li>
              </ul>
              <button
                className="bg-gray-700 text-white rounded px-4 h-[40px] text-[20px] mt-4"
                onClick={handleAdd}
              >
                Add to Favourite
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MovieDetail;
