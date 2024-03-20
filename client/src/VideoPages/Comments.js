import './CommentStyle.css'
import Comment from './Comment'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector


const Comments = ({videoId}) => {

  const { currentUser } = useSelector((state) => state.user); // Get the current user

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState(""); 


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comment/${videoId}`);
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  const handleCommentSubmit = async () => {
  if (newCommentText.trim() !== "") {
    try {
      const commentData = {
        comment: newCommentText, 
        videoId, 
      };
      const res = await axios.post('/comment', commentData);
      setComments([...comments, res.data]);
      setNewCommentText('');
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  }
};




  return (
    <div className='comments-container'>
      <div className='comments-newcomment'>
      {currentUser.img ? (
          <img src={currentUser.img} alt='comments' className='comments-imagestyle' />
        ) : (
          <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt='comments' className='comments-imagestyle' />
        )}
        <input placeholder="Add a comment..." 
        className='comments-input' 
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button className='comment-button' onClick={handleCommentSubmit}>Submit</button> {/* Add a submit button */}
      </div>
      {comments.map(comment=>(
        <Comment key={comment._id} comment={comment}/>
      ))}
    </div>
  )
}

export default Comments
