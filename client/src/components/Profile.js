import React, { useEffect, useState } from 'react'
import './ProfileStyle.css'
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess } from '../redux/userSlice';
import axios from 'axios';
import ProfileVideoCard from './ProfileVideoCard';
import ViewChart from '../charts/ViewChart';
import LikeChart from '../charts/LikeChart';
import DisLikeChart from '../charts/DisLikeChart';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import app from '../firebase'


const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [videoList, setVideList] = useState([]);
    const [imgPercentage, setImgPercentage] = useState(0);
    const [uploadImage, setUploadImage] = useState(undefined);

    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const [editedUser, setEditedUser] = useState({
        name: currentUser.name,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        address: currentUser.address,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleEditDetails = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.put(`/users/${currentUser._id}`, editedUser);
            dispatch(loginSuccess(res.data))
        } catch (error) {
            console.log(error)
        }
        setIsEditing(false);
    }

    const handleEditClick = () => {

        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const fetchUserVideo = async () => {
            try {
                const res = await axios.get(`/videos/randomVideo`);
                const data = res.data.filter(eachVideo => eachVideo.userId === currentUser._id)
                setVideList(data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserVideo();
    }, [currentUser._id])


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
                setImgPercentage(Math.round(progress));
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
            (error) => {
                console.error("Error uploading profile picture: ", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    axios
                        .put(`/users/${currentUser._id}`, { [urlType]: downloadURL })
                        .then(() => {
                            // You can optionally update the user data in your app state here.
                            // Example: setUser({ ...currentUser, [urlType]: downloadURL });
                        })
                        .catch((error) => {
                            console.error("Error updating user data: ", error);
                        });


                });
            }
        );
    };

    useEffect(() => {
        if (uploadImage) {
            uploadFile(uploadImage, "img");
        }
    }, [uploadImage]);


    return (
        <div class=''>
            <div class=''>
                <div className="main-body">
                    <div class="row gutters-sm">
                        <div class="col-md-4 mb-3">
                            <div class="profile-card">
                                <div class="card-body">
                                    <div class="d-flex flex-column align-items-center text-center">
                                        {currentUser.img ? (
                                            <img src={currentUser.img} alt="User Profile" className="rounded-circle" width="150" />
                                        ) : (
                                            <div>
                                                <img
                                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                                    alt="Default Profile"
                                                    className="rounded-circle"
                                                    width="150"
                                                />
                                                {
                                                    isEditing &&
                                                    <>
                                                        {imgPercentage > 0 ? (
                                                            `Uploading: ${imgPercentage}%`
                                                        ) : (
                                                            <input
                                                                className="uploadvideopage-form-field"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => setUploadImage(e.target.files[0])}
                                                            />
                                                        )}
                                                        <span>Upload Profile Image: </span>
                                                    </>
                                                }

                                            </div>
                                        )}
                                        <div class="mt-3">
                                            <h4>{currentUser.name}</h4>
                                            <p class="text-secondary mb-1">{currentUser.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="profile-card mb-3">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Full Name</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.name}
                                                onChange={handleInputChange}
                                                name="name"
                                                readOnly={!isEditing}
                                            />

                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Email</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedUser.email}
                                                onChange={handleInputChange}
                                                name="email"
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Phone</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text"
                                                class="form-control"
                                                placeholder='Add Phone Number'
                                                name='phoneNumber'
                                                value={editedUser.phoneNumber}
                                                readOnly={!isEditing}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Adress</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text"
                                                class="form-control"
                                                placeholder='Add Address'
                                                readOnly={!isEditing}
                                                value={editedUser.address}
                                                onChange={handleInputChange}
                                                name='address'
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Subscribed Channels</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            {currentUser?.subscribedUsers?.length || 0} Channels
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-12">
                                            {isEditing ? (
                                                <>
                                                    <button className="btn btn-info" onClick={handleEditDetails}>
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-danger ml-2"
                                                        onClick={handleEditClick}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="btn btn-primary" onClick={handleEditClick}>
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4>Views Analysis</h4>
                        <ViewChart videoList={videoList} />
                        <h4>Likes Analysis</h4>
                        <LikeChart videoList={videoList} />
                        <h4>Dislikes Analysis</h4>
                        <DisLikeChart videoList={videoList} />
                    </div>

                </div>
            </div>
            <div>

            </div>
            <div class='cards'>
                {videoList.map((eachVideo) => (
                    <ProfileVideoCard
                        key={eachVideo._id}
                        eachVideo={eachVideo} />
                ))}
            </div>
        </div>
    )
}

export default Profile
