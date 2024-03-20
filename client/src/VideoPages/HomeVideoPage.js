import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import './HomeVideoPage.css';
import axios from 'axios';

const HomeVideoPage = ({type}) => {

  const [videos, setVideos] = useState([]);

  useEffect(()=>{
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/${type}`);
      console.log("API Response:", res.data); // Check the actual API response
      setVideos(res.data);
    };
    
    
    fetchVideos()
  },[type])


  return (
    <div className='container-homevideo-page'>
        {Array.isArray(videos) ? videos.map((video) => (
      <Card key={video._id} video={video}/>
    )) : <p>No videos found.</p>}

    </div>
  )
}

export default HomeVideoPage
