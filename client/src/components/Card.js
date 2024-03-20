import React  from 'react'
import './Card.css'
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import {format} from 'timeago.js'
import { useSelector } from 'react-redux';
// import axios from 'axios';



const Card = ({ type, video }) => {

  const { currentUser } = useSelector((state) => state.user); // Access the currentUser state

  // const [channel, setChannel] = useState();

  // useEffect(() => {
  //   const fetchChannel = async () => {
  //     try {
  //       const res = await axios.get(`/users/find/${video.userId}`);
  //       setChannel(res.data);
  //     } catch (error) {
  //       console.error("Error fetching channel data:", error);
  //     }
  //   };
  //   fetchChannel();
  // }, [video.userId]);

  return (
    <Link to={currentUser ? `/video/${video._id}` : '/singin'}  style={{ textDecoration: 'none' }}>
      <div className='card-container' type={type}>
        <img src={video.imgURL}
          alt='videoimage'
          type={type}
          className='card-image-style' />
        <div className='card-details'>
          {/* <img src={channel.img}
            alt='channelimage'
            type={type}
            className='card-channel-image'
          /> */}
          <div className='details2'>
            <h1 className='card-videotitle'>{video.title}</h1>
            <p className='channel-name'>{video.videoDescription}</p>
            <p className='video-info'>{video.views} • {format(video.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
