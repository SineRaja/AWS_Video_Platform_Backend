import React, { useEffect, useState } from 'react';
import './UploadVideo.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import app from '../firebase'
import { Player } from '@lottiefiles/react-lottie-player';

const UploadVideo = ({ setOpenModal }) => {

    const [uploadImage, setUploadImage] = useState(undefined);
    const [uploadVideo, setUploadVideo] = useState(undefined);
    const [imgPercentage, setImgPercentage] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);

    const navigate = useNavigate()

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
                urlType === "imgUrl" ? setImgPercentage(Math.round(progress)) : setVideoPerc(Math.round(progress));
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
        uploadVideo && uploadFile(uploadVideo, "videoUrl");
    }, [uploadVideo]);

    useEffect(() => {
        uploadImage && uploadFile(uploadImage, "imgURL");
    }, [uploadImage]);

    const handleUpload = async (e) => {
        e.preventDefault();
        const res = await axios.post("/videos", { ...inputs, tags })
        setOpenModal(false)
        res.status === 200 && navigate(`/video/${res.data._id}`)
    }

    return (
        <div className='uploadVideo-Container'>
            <div className='uploadVideo-Wrapper'>
                <div className='typewriter'>
                <h1>Upload a New Video</h1>
                </div>
                <div className='uploadWrapper'>
                <div className='sub-uploadVideo-Wrapper1'>

                    <Player
                        autoplay
                        loop
                        controls
                        hover
                        src="https://lottie.host/778bac5f-47c4-44d7-8a07-dad59ac143f0/Vo6fMtqviW.json"
                        style={{ height: '550px', width: '450px' }}
                        background="transparent"
                        speed="1"
                    >
                    </Player>
                </div>
                <div className='sub-uploadVideo-Wrapper'>
                    <div className='uploadVideoClose' onClick={() => setOpenModal(false)}>X</div>
                   
                    <div class="uploadvideopage-form-group">
                    <span>Video : </span>                    
                            {videoPerc > 0 ? (
                                "Uploading:" + videoPerc
                            ) : (
                                <input
                                    className='uploadvideopage-form-field'
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setUploadVideo(e.target.files[0])}
                                />
                            )}
                    </div>
                    
                    <div class="uploadvideopage-form-group">
                    <span>Video Title : </span> 
                    <input
                        className='uploadvideopage-form-field'
                        type="text"
                        placeholder="Title"
                        name="title"
                        onChange={handleChange}
                    />
                    </div>

                    <div class="uploadvideopage-form-group">
                    <span>Video Description : </span> 
                    <textarea
                        className='uploadvideopage-form-field'
                        placeholder="Description"
                        name="videoDescription"
                        rows={5}
                        onChange={handleChange}
                    />
                    </div>

                    <div class="uploadvideopage-form-group">
                    <span>Video Tags : </span> 
                    <input
                        className='uploadvideopage-form-field'
                        type="text"
                        name='tags'
                        placeholder="Separate the tags with commas."
                        onChange={handleTags}

                    />
                    </div>

                    <div class="uploadvideopage-form-group">
                    <span>Video Thumbnail: </span> 
                    {imgPercentage > 0 ? (
                        "Uploading:" + imgPercentage + "%"
                    ) : (
                        <input
                        className='uploadvideopage-form-field'
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadImage(e.target.files[0])}
                        />
                    )}
                    </div>
                    <button className='button-uploadvideo' onClick={handleUpload}>Upload</button>
                </div>
                </div>

            </div>
        </div>
    )
}

export default UploadVideo
