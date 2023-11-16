import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:8000/posters`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json(); // Parse the response as JSON
    setSearchResults(data);
    console.log(data);
    setLoading(false);
  };

  const handleDeletePoster = async (imdbID) => {
    try {
      const response = await fetch(
        `http://localhost:8000/posters/${imdbID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete poster");
      }

      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center${inter.className}`}
    >
      <div className="bg-black flex justify-around p-4">
        <p className="text-white my-auto text-xl cursor-pointer hover:text-blue-200">
          Favorites
        </p>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul className="flex mx-auto flex-wrap justify-center ml-16 mt-4">
            {searchResults.map((result, index) => (
              <li key={index} className="mx-3">
                <div className="w-[22vw] min-w-[360px] mt-16 ">
                  <Link href={`/singleMovie/${result.imdbID}`}>
                    <img src={result.Poster} className="w-[100%]" />
                  </Link>
                  <p className="my-4">
                    <span className="text-black font-semibold">Title:</span>{" "}
                    {result.Title}
                  </p>
                  <p>
                    <span className="text-black font-semibold">
                      Release Year:
                    </span>{" "}
                    {result.Year}
                  </p>
                  <button
                    className="bg-red-700 text-white rounded px-4 h-[40px] text-[20px] mt-4"
                    onClick={() => handleDeletePoster(result.imdbID)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
