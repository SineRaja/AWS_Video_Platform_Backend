import './EditVideoDisplayStyle.css';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {  fetchSuccess } from "../redux/videoSlice";
import { Player } from '@lottiefiles/react-lottie-player';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase'

const EditVideoDisplay = () => {
    // const { currentVideo } = useSelector((state) => state.video);
    const [imgPercentage, setImgPercentage] = useState(0);
    const [uploadImage, setUploadImage] = useState(undefined);
    const [inputs, setInputs] = useState({});

    const [tags, setTags] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const path = useLocation().pathname.split("/")[2];

    // console.log(path)

    const [videoss, setVideoss] = useState({});
    const [videoLoading, setVideoLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axios.get(`/videos/find/${path}`);

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


    // // Calling this function when the video starts playing
    // const startWatching = async () => {
    //     try {
    //         await axios.put(`/videos/view/${currentVideo._id}`);
    //         // You can also update the local state or Redux store with the new view count
    //     } catch (error) {
    //         console.error('Error updating views:', error);
    //     }
    // };

    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleTags = (e) => {
        const tagString = e.target.value;
        const tagArray = tagString.split(",").map(tag => tag.trim());
        setTags(tagArray);
    };

    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImgPercentage(Math.round(progress)) 
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downloadURL };
                    });
                });
            }
        );
    };

    useEffect(() => {
        uploadImage && uploadFile(uploadImage, "imgURL");
    }, [uploadImage]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await axios.put(`/videos/${videoss._id}`, { ...inputs, tags })
        res.status === 200 && navigate(`/video/${res.data._id}`)
    }

    console.log(videoss)

    return (
        <div className='videopage-container'>
            <div className='editvideopage-content'>
                <div className='videopage-videowrapper'>

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
                                width: '80%',
                                height: '520px',
                                margin: '25px', borderRadius: '25px',
                                objectFit: 'cover',
                                boxShadow: 'rgba(0, 0, 0, 0.2) 0px 60px 40px -7px',
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
                                style={{ boxShadow: 'rgba(0, 0, 0, 0.56) 0px 22px 70px 4px', borderRadius: '25px' }}
                                // onLoad={startWatching}
                            ></iframe>
                        </div>

                    )}
                </div>

                <div class="editvideopage-form-group">
                    <span>Video Title </span>
                    <input class="editvideopage-form-field"
                    onChange={handleChange}
                    type="text" name='title' placeholder={videoss.title} />
                </div>

                <div class="editvideopage-form-group">
                    <span>Video Description</span>
                    <textarea rows={5}
                     onChange={handleChange}
                     class="editvideopage-form-field" name='videoDescription' type="text" placeholder={videoss.videoDescription} />
                </div>

                <div class="editvideopage-form-group">
                    <span>Video Tags </span>
                    <input class="editvideopage-form-field"
                    onChange={handleTags}
                    type="text" name='tags' placeholder={videoss.tags} />
                </div>

                <div class="editvideopage-form-group">
                <span>Video Thumbnail image </span>
                {imgPercentage > 0 ? (
                    "Uploading:" + imgPercentage + "%"
                ) : (
                    
                    <input
                        className='editvideopage-form-field'
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUploadImage(e.target.files[0])}
                    />
                )}
                </div>

                <button className='btn-edi-video'
                onClick={handleUpdate} >Update Video Details</button>

            </div>

        </div>
    )
}

export default EditVideoDisplay
