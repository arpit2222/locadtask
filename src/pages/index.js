import { useState } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce function to delay API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to make API call
  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      console.log('checking page',page)
      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
      const response = await fetch(`https://omdbapi.com/?apikey=88ffad7c&s=${searchQuery}&page=${page}`);
      const data = await response.json();
      if(data.Search){
      setSearchResults(data.Search);
      console.log(data.Search);
    }else{
      console.log('No results found');
    }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced function to delay API calls by 500 milliseconds
  const fetchSearchResultsMain = debounce(fetchSearchResults, 500);

  // Handle input change
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    fetchSearchResultsMain(); // Trigger API call after a short delay
  };

  const handleIncremnet = () => {
    setPage(page + 1);
    fetchSearchResultsMain();
  }

  const handleDecrement = () => {
    setPage(page - 1);
    fetchSearchResultsMain();

  }

  return (
    <main className={`flex min-h-screen flex-col items-center${inter.className}`}>
      <div className='bg-black flex justify-around p-4'>
        <div className=''>
          <input
            placeholder='Search Movies, TV shows...'
            className='rounded w-[30vw] h-10 text-black p-4'
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
        <Link href={`/favourite`}>
        <p className='text-white my-auto text-xl cursor-pointer hover:text-blue-200'>
          Favorites
        </p>
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
        <ul className='flex mx-auto flex-wrap justify-center ml-16 mt-4'>
          {searchResults.map((result,index) => (
            <li key={index} className='mx-3'>
              <div className='w-[22vw] min-w-[360px] mt-16 '>
              <Link href={`/singleMovie/${result.imdbID}`}>
                <img src={result.Poster} className='w-[100%]'/>
              </Link>
                <p className='my-4'><span className='text-black font-semibold'>Title:</span> {result.Title}</p>
                <p ><span className='text-black font-semibold'>Release Year:</span> {result.Year}</p>
              </div>
            </li>
          ))}
        </ul>
          <div className='mt-4 flex justify-center mb-4'>
            {
              page<=1?
              <button className='bg-gray-500 text-white rounded w-[80px] h-[40px] text-[20px] ml-4 cursor-not-allowed' disabled>Prev</button>:
              <button className='bg-gray-700 text-white rounded w-[80px] h-[40px] text-[20px] ml-4' onClick={handleDecrement}>Prev</button>
            }
          <button className='bg-gray-700 text-white rounded w-[80px] h-[40px] text-[20px] ml-4' onClick={handleIncremnet}>Next</button>
        </div>
        </div>
      )}
      
    </main>
  );
}
