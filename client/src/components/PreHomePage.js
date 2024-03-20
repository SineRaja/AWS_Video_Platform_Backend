import React from 'react'
import './PreHomePage.css'

import { Player } from '@lottiefiles/react-lottie-player';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import TabletAndroidOutlinedIcon from '@mui/icons-material/TabletAndroidOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import LoginIcon from '@mui/icons-material/Login';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function PreHomePage() {

    const movielist = [
        {
            moviename: 'avatar',
            movieurl: 'https://e0.pxfuel.com/wallpapers/556/343/desktop-wallpaper-avatar-movie-avatar-movie-pandora-avatar-avatar-2-movie.jpg',
        },
        {
            moviename: 'Avenger',
            movieurl: 'https://pbs.twimg.com/media/CGXtzRrWoAA9mED.jpg',
        },
        {
            moviename: 'Jurrasicpark',
            movieurl: 'https://i0.wp.com/exquisitemag.com/wp-content/uploads/2022/07/B671019A-61AE-4F1D-A13A-7A9D4653B067.jpeg',
        },
        {
            moviename: 'TheNub',
            movieurl: 'https://hips.hearstapps.com/hmg-prod/images/mv5bnjzlogvhzdctodu2yi00nzcylwflnmitzgq2zdc2ntiwngmyxkeyxkfqcgdeqxvynzkwmtyymtiat-v1-1670535813.jpg',
        },
        {
            moviename: 'Bramhastar',
            movieurl: 'https://img.etimg.com/photo/89661295/89661295.jpg',
        },
        {
            moviename: 'Intershellar',
            movieurl: 'https://qph.cf2.quoracdn.net/main-qimg-9288b929264d8c7a6c1871a8b6055e41-lq',
        },
        {
            moviename: 'Thor',
            movieurl: 'https://i0.wp.com/exquisitemag.com/wp-content/uploads/2022/07/2A56CE5C-3D67-4F7A-B0CD-3406CA97FB2B.jpeg?resize=405%2C600&ssl=1',
        },
    ]

    return (
        <div className='prehomepage'>

            {/* Banner Pre Home */}
            <div className='prehome-banner'>
                <div className='containers'>
                    <h1 className='banner-title'>Indulge in a world of captivating content: Stream brand new Originals, blockbuster hits, binge-worthy series, and beyond.</h1>
                    <p className='banner-description'>All at Free of cost. Cancel at any time.*</p>
                    <p className='banner-description-2'>Unlock a world of limitless entertainment: Click to embark on an immersive free experience or reignite your journey.</p>
                    <div className='row-content'>
                        <Link to='/singin' style={{textDecoration:'none', marginTop:'-10px'}}>
                        <button className='btn-signin'> <LoginIcon/>  Connect With US</button>
                        </Link>
                    </div>
                    <div className='bannerfadebottom' />
                </div>

            </div> 

            {/* Bottom of banner */}
            <div className='pretwohomepage'>
                <div className='contenttwo'>
                    <h1>Only on WatchVideo▶️</h1>
                    <p>The only place to watch the best movies and TV shows, before anyone else.</p>
                    <div className='fadecontenttwo' />
                </div>
                <div className='card-content'>
                    {
                        movielist.map((eachmovie) => (
                            <div className='cardstyle'>
                                <img src={eachmovie.movieurl} alt={eachmovie.moviename} className='imagestyle' />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='prehomepagethree'>
                <div className='contenttree'>

                    <h1>Discover the world's greatest stories</h1>
                    <p>Our stories are always ready for you.</p>
                </div>
                <div className='prehomepagethree-firstcontent'>
                    <Player
                        autoplay
                        loop
                        controls
                        hover
                        src="https://assets5.lottiefiles.com/packages/lf20_qmvs7uqa.json"
                        style={{ height: '250px', width: '250px' }}
                        background="transparent"
                        speed="1"
                    >
                    </Player>

                </div>
                <div className='prehomepagethree-firstcontent'>

                    <Player
                        autoplay
                        loop
                        controls
                        src="https://assets4.lottiefiles.com/private_files/lf30_bb9bkg1h.json"
                        style={{ height: '350px', width: '350px', marginRight: '60px' }}
                        background="transparent"
                        speed="1"
                    >
                    </Player>

                    <Player
                        autoplay
                        loop
                        controls
                        src="https://assets1.lottiefiles.com/private_files/lf30_fjln45y5.json"
                        style={{ height: '350px', width: '350px', marginLeft: '60px' }}
                        background="transparent"
                        speed="1"
                    >
                    </Player>
                </div>
            </div>

            <div className='prehomepagefour'>
                <div className='content-four'>
                    <Player
                        autoplay
                        loop
                        controls
                        hover
                        src="https://assets6.lottiefiles.com/private_files/lf30_6amhqkvr.json"
                        style={{ height: '200px', width: '200px' }}
                        background="transparent"
                        speed="1"
                    ></Player>
                    <h1>Entertainment without limits</h1>
                    <p>Embark on an Epic Journey of Endless Entertainment:
                        Unleash Your Imagination, Dive into a World of Thrilling Videos.</p>
                </div>

                <div className='content-four'>
                    <Player
                        autoplay
                        loop
                        controls
                        hover
                        src="https://assets6.lottiefiles.com/packages/lf20_pSWs1E.json"
                        style={{ height: '200px', width: '200px' }}
                        background="transparent"
                        speed="1"
                    ></Player>
                    <h1>Entertainment, anywhere.</h1>
                    <p>Watch your favorite shows on your favorite devices.</p>
                </div>

                <div className='content-four'>
                    <Player
                        autoplay
                        loop
                        controls
                        hover
                        src="https://assets9.lottiefiles.com/packages/lf20_597nlu.json"
                        style={{ height: '200px', width: '200px' }}
                        background="transparent"
                        speed="1"
                    ></Player>
                    <h1>Parental controls that work for you.</h1>
                    <p>Give your kids the freedom to explore, without giving them too much freedom.</p>
                </div>
            </div>

            <div className='availabledevices'>
                <h1>Available on your favourite devices</h1>
                <div className='row-content'>

                    <div className='column-content'>
                        <LiveTvOutlinedIcon sx={{ fontSize: 140 }} color='inherit' />
                        <h1>TV</h1>
                        <p>Amazon Fire TV <br/> Android TV devices <br/> AppleTV <br/> Chromecast <br/> LG TVs <br/> Roku <br/>
                            Samsung <br/> Sky Q <br/> Panasonic</p>
                    </div>

                    <div className='column-content'>
                        <ComputerOutlinedIcon sx={{ fontSize: 140 }} color='inherit' />
                        <h1>Computer</h1>
                        <p>Chrome OS <br/> MacOS <br/> Windows PC</p>
                    </div>

                    <div className='column-content'>
                        <TabletAndroidOutlinedIcon sx={{ fontSize: 140 }} color='inherit' />
                        <h1>Mobile & Tablet</h1>
                        <p>Amazon Fire Tablets <br/> Android Phones & Tablets <br/> iPhone and iPad </p>
                    </div>

                    <div className='column-content'>
                        <SportsEsportsOutlinedIcon sx={{ fontSize: 140 }} color='inherit' />
                        <h1>Game Consoles</h1>
                        <p>PS4 <br/> PS5 <br/> Xbox One <br/> Xbox Series X <br/> Xbox Series S </p>
                    </div>


                </div>
            </div>

            <Footer />



        </div>
    )
}

export default PreHomePage
