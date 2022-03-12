import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GIPHY_API;

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchURL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword
    .split(" ")
    .join("")}&limit=1&rating=G&lang=en`;

  const fetchGifs = async () => {
    try {
      const response = await fetch(fetchURL);
      const data = await response.json();
      setGifUrl(data.data[0]?.images?.downsized_medium?.url);
    } catch (error) {
      setGifUrl(
        `https://i.pinimg.com/originals/68/a0/9e/68a09e774e98242871c2db0f99307420.gif`
      );
    }
  };

  useEffect(() => {
    keyword && fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
