import React from 'react'
import './profileCard.css'
import {format} from 'timeago.js'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProfileVideoCard = ({ eachVideo }) => {
    const navigate = useNavigate();

    const deleteVideo = async () => {
        await axios.delete('/videos/'+eachVideo._id);
        navigate('/profile')

    }

    return (
            <div class="profilecard-video">
                <img src={eachVideo.imgURL} class="profilecard__image" alt="" />
                <div class="profilecard__overlay">
                    <div class="profilecard__header">
                        <svg class="profilecard__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                        <div class="profilecard__header-text">
                            <h3 class="profilecard__title">{eachVideo.title}</h3>
                            <span class="profilecard__status">{format(eachVideo.createdAt)}</span>
                        </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between', paddingBottom: '20px', paddingLeft: '20px',paddingRight: '20px',height:'60px'}}>
                    <button class="profile-card-button"><Link to={`/editVideo/${eachVideo._id}`} style={{textDecoration:'none', color:'white'}}>Edit</Link></button>
                    <button class="profile-card-button1" onClick={deleteVideo}>Delete</button>
                    </div>
                </div>
            </div>
    )
}

export default ProfileVideoCard
