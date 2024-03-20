import React, { useState } from 'react'
import './ShareVideoStyle.css';
// import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

const ShareVideo = ({ setOpenModal, link }) => {
    const [copySuccess, setCopySuccess] = useState(false);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(link.videoUrl);
        setCopySuccess(true);
    };
    
    const openWhatsApp = () => {
        const message = ` Name : ${link.title} 
        Check out this video: ${link.videoUrl}`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    
    // const openMessenger = () => {
    //     const url = `https://www.messenger.com/share?url=${encodeURIComponent(link)}`;
    //     window.open(url, '_blank');
    // };

    const openEmail = () => {

        const body = ` Name : ${link.title} 
        Check out this video: ${link.videoUrl}`;
        const subject = 'Online Video Platform'
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl,'_blank' )
    }

    const openInstagram = () => {
        const message = ` Name : ${link.title} 
        Check out this video: ${link.videoUrl}`;
        const url = `https://www.instagram.com/direct/inbox/?${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const openTwitter = () => {
        const message = ` Name : ${link.title} 
        Check out this video: ${link.videoUrl}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const openTelegram = () => {
        const message = ` Name : ${link.title} 
        Check out this video: ${link.videoUrl}`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
    

    return (
        <div className='ShareVideoContainer'>
            <div className='shareVideoWrapper'>
                <header>
                    <span className='shareVideoHeading'>Share Modal</span>
                    <div className="close" onClick={() => setOpenModal(false)}>X</div>
                </header>
                <div className="content">
                    <p className='shareVideoLink'>Share this link via</p>
                    <ul className="icons">
                         <a href="# " onClick={openEmail}><EmailIcon /></a> 
                        <a href="# " onClick={openTwitter}><TwitterIcon /></a>
                        <a href="# " onClick={openInstagram}><InstagramIcon /></a>
                        <a href="# " onClick={openWhatsApp}><WhatsAppIcon /></a>
                        <a href="# " onClick={openTelegram}><TelegramIcon /></a>
                    </ul>
                    <p>Or copy link</p>
                    <div className="field">
                        <i className="url-icon uil uil-link"></i>
                        <input type="text" readonly value={link.videoUrl} />
                        <button onClick={copyToClipboard}>
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareVideo
