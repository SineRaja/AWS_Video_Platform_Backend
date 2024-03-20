import React from 'react'
import './Footer.css'

import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const Footer = () => {
  return (
    <div className='footer-container'>

        <div class="fotter-content-box">
          <PinDropOutlinedIcon color='warning' sx={{ fontSize: 40 }} />
          <div class="fotter-content-text">
            <h4>Find us</h4>
            <span>University Of Leicester, Leicester, LE21XP</span>
          </div>
        </div>

        <div class="fotter-content-box">
          <LocalPhoneOutlinedIcon color='warning' sx={{ fontSize: 40 }} />
          <div class="fotter-content-text">
            <h4>Contact Us</h4>
            <span>+44 7767933394</span>
          </div>
        </div>

        <div class="fotter-content-box">
          <EmailOutlinedIcon color='warning' sx={{ fontSize: 40 }} />
          <div class="fotter-content-text">
            <h4>mail us</h4>
            <span>online@videoplatform.uk</span>
          </div>
        </div>

      </div>
  )
}

export default Footer
