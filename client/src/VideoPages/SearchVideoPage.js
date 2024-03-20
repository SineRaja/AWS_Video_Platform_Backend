import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from '../components/Card'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SearchVideoPage = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  console.log(query)

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/search${query}`);
      const keyword = query.replace('?q=', '');
      const resss = await axios.get(`/videos/tags?tags=${keyword}`);  
      const mergedVideos = [...res.data, ...resss.data];   
      setVideos(mergedVideos);
    };
    fetchVideos();
  }, [query]);

  return <Container>
    {videos.map(video=>(
      <Card key={video._id} video={video}/>
    ))}
  </Container>;
};

export default SearchVideoPage;