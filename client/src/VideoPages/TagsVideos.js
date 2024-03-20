import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from '../components/Card'


const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TagsVideos = ({tags}) => {
  const [videos, setVideos] = useState([]);
console.log(tags)
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  console.log(videos)

  return <Container>
    {videos.map(video=>(
      <Card key={video._id} video={video}/>
    ))}
  </Container>;
};


export default TagsVideos
