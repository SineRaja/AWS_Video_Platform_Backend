import axios from "axios";
import React, { useEffect, useState } from "react";
import './CommentStyle.css'
import { format } from "timeago.js";

const Comment = ({ comment }) => {

  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data)
    };
    fetchComment();
  }, [comment.userId]);

  return (
    <div className='comment-container'>
      {/* {channel.img ? (
        <img src={channel.img} alt='' className='videopage-imagestyle-channel' />
      ) : (
        <div className='channel-initial'>
          <p className='channel-initial-text'>{channel ? channel.name.charAt(0) : ''}</p>
        </div>
      )} */}
       <img src={channel.img} alt='' className='videopage-imagestyle-channel' />
      <div className='details-comment'>
        <p className='comment-name'> {channel.name} <span>{format(comment.createdAt)}</span></p>
        <p className='text-comment'>
          {comment.comment}
        </p>
      </div>
    </div>
  )
}

export default Comment
