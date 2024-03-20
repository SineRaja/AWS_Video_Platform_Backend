import React from 'react'
import '../components/Menu.css';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className='menu-container'>
            <div className='menu-content'>
                <Link to='/mainplatform' style={{ textDecoration: 'none', color: '#00abbef9' }}>
                    <div className='logo-body'>
                        <img src='https://img.freepik.com/free-icon/fast-forward_318-301441.jpg'
                            alt='logo'
                            className='logo-img' />
                        <h7>WatchVideo</h7>
                    </div>
                </Link>
                <Link to='/' style={{ textDecoration: 'none',  }}>
                    <div className='items-container'>
                        <HomeIcon />
                        Home
                    </div>
                </Link>

                <Link to='trendvideo' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <ExploreIcon />
                        Explore
                    </div>
                </Link>

                <Link to='subscribevideos' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <SubscriptionsIcon />
                        Subscription
                    </div>
                </Link>

                <hr />
                <Link to='music' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <LibraryMusicIcon />
                        Music
                    </div>
                </Link>
                <Link to='sports' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <SportsCricketIcon />
                        Sports
                    </div>
                </Link>
                <Link to='gaming' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <SportsEsportsIcon />
                        Gaming
                    </div>
                </Link>
                <Link to='movies' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <MovieIcon />
                        Movies
                    </div>
                </Link>
                <Link to='news' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <NewspaperIcon />
                        News
                    </div>
                </Link>
                <Link to='education' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <LocalLibraryIcon />
                        Education
                    </div>
                </Link>
                {/* <div className='items-container'>
                <LiveTvIcon/>
                Live
            </div> */}
                <hr />
                <Link to='/contactus' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <HelpCenterIcon />
                        Help
                    </div>
                </Link>

                <Link to='/profile' style={{ textDecoration: 'none', color: 'whitesmoke' }}>
                    <div className='items-container'>
                        <AccountCircleIcon />
                        profile
                    </div>
                </Link>


            </div>
        </div>
    )
}

export default Menu
