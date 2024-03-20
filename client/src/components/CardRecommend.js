import axios from "axios";
import React, { useEffect, useState } from "react";
import './CardRecommendStyle.css';
import Card from "./Card";

const CardRecommend =  ({ tags })=> {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);


  return (
    <div className='cardrecommend-container'>
    {videos.map((video) => (
      <Card type="sm" key={video._id} video={video} />
    ))}
    </div>
  )
}

export default CardRecommend
