import React, { useEffect, useState } from "react";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import { Player } from '@lottiefiles/react-lottie-player';
import './VideoDisplayStyle.css';
import Comments from './Comments';
import CardRecommend from '../components/CardRecommend';
import ShareVideo from "../components/ShareVideo";


const VideoDisplayPage = () => {

  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  // console.log(path)

  const [channel, setChannel] = useState({});
  const [videoss, setVideoss] = useState({});
  const [videoLoading, setVideoLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        setVideoss(videoRes.data)
        console.log(videoRes)
        dispatch(fetchSuccess(videoRes.data));
        setVideoLoading(false); // Set loading to false when video is loaded
      } catch (err) {
        setVideoLoading(false); // Set loading to false on error
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`/users/like/${videoss._id}`);
    dispatch(like(currentUser._id));
  };
  const handleDislike = async () => {
    await axios.put(`/users/dislike/${videoss._id}`);
    dispatch(dislike(currentUser._id));
  };
  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/users/unsub/${channel._id}`)
      : await axios.put(`/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  // Calling this function when the video starts playing
  const startWatching = async () => {
    try {
      await axios.put(`/videos/view/${currentVideo._id}`);
      // You can also update the local state or Redux store with the new view count
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };


  return (
    <div className='videopage-container'>
      <div className='videopage-content'>
        <div className='videopage-videowrapper'>
          {/* <iframe
              width="100%"
              height="520"
              src={`${videoss.videoUrl}?controls=0&modestbranding=0&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 60px 40px -7px', borderRadius: '20px' }}
            ></iframe>
             */}
          {videoLoading ? (
            <div className="loading-indicator">
              <Player
                autoplay
                loop
                controls
                hover
                src="https://lottie.host/dd811fa1-c66e-4ca3-88b7-5149d803e87a/IzXxSuOxlo.json"
                style={{ height: '200px', width: '200px' }}
                background="transparent"
                speed="1"

              ></Player>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '520px',
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                src={videoss.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                onLoad={startWatching}
                style={{      borderRadius: '20px',         
                 boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
              }}
              ></iframe>
            </div>

          )}
        </div>
        <h1 className='videopage-title'>{videoss.title}</h1>
        <div className='videopage-details'>
          <p className='videopage-info'> {videoss.views} views • {format(videoss.createdAt)}</p>
          <div className='videopage-buttons'>
            <button className='videopage-button' onClick={handleLike}> {videoss.likes?.includes(videoss?._id) ? (
              <ThumbUpIcon />
            ) : (
              <ThumbUpOutlinedIcon />
            )}{" "}
              {videoss.likes?.length} </button>
            <button className='videopage-button' onClick={handleDislike}>{videoss.dislikes?.includes(videoss?._id) ? (
              <ThumbDownIcon />
            ) : (
              <ThumbDownOffAltOutlinedIcon />
            )}{" "}
              Dislike</button>
            <button className='videopage-button' onClick={() => setOpenModal(true)}><ReplyOutlinedIcon /> Share</button>
            {/* <button className='videopage-button'><AddTaskOutlinedIcon /> Save</button> */}
          </div>
        </div>
        <hr className='hr-videoplatyedstyle' />
        <div className='videopage-channel'>
          <div className='videopage-channelinfo'>
            <img src={channel.img} alt='' className='videopage-imagestyle-channel' />
            <div className='videopage-channeldetails'>
              <p className='videopage-channelname'>{channel.name}</p>
              <p className='videopage-channel-subs'>{channel.subscribers} subscribers</p>
              <p className='videopage-description-channel'>{videoss.videoDescription}</p>
            </div>
          </div>
          <button className={`videopage-subscribe ${currentUser.subscribedUsers?.includes(channel._id) ? 'subscribed' : 'not-subscribed'}`} onClick={handleSub}>
            {currentUser.subscribedUsers?.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE"}
          </button>

        </div>
        <hr className='hr-videoplatyedstyle' />
        <Comments videoId={videoss._id} />
      </div>
      <div className='videopage-recommendation'>
        <CardRecommend tags={videoss.tags} />
      </div>
      {openModal && <ShareVideo setOpenModal={setOpenModal} link={videoss} />}
    </div>
  )
}

export default VideoDisplayPage
