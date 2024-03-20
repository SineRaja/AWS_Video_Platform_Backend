import React, { useState } from 'react'
import './ContactUs.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import { Player } from '@lottiefiles/react-lottie-player';
import emailjs from 'emailjs-com';

const ContactUs = () => {

    const [showSuccessPopup, setShowSuccessPopup] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();

        const templateParams = {
            from_name: e.target.name.value,
            email_id: e.target.email.value,
            phone_no: e.target.phone.value,
            message: e.target.message.value,
        };

        emailjs.send('service_tukojw7', 'template_t3szdss', templateParams, 'QIGbfkYqOUo0b7wGj')
            .then((result) => {
                console.log(result.text);
                setShowSuccessPopup('Successfully Sent the Query'); // Display the success popup
                e.target.reset(); // Reset the form fields
            })
            .catch((error) => {
                console.log(error.text);
            });

    };



    return (
        <div class="contact-sec">
            <div class="contactus-container col-lg-12">

                <div className="contacut-us-details">
                    <Player
                        autoplay
                        loop
                        controls
                        hover
                        src="https://lottie.host/c2e77aa0-73fc-4110-841e-fb8ebb6f8c4e/5CjvZwSpzK.json"
                        style={{ height: '250px', width: '250px' }}
                        background="transparent"
                        speed="1"
                    >
                    </Player>
                    <h1 class="section-title">Contact us</h1>

                    <ul class="contact-ul">
                        <li>
                            <LocationOnIcon style={{ paddingTop: '10px' }} />
                            123 Howard Road, Leicester</li>

                        <li>
                            <CallIcon />
                            <a href="tel:+447767933394"><b>+44 7767933394</b></a>,

                        </li>

                        <li>
                            <EmailIcon />
                            <a href="mailto:gudalapoojamahi@gmail.com"><b> gudalapoojamahi@gmail.com</b></a>
                        </li>
                    </ul>
                </div>

                <div className="contacut-us-form-container">
                    <form class="contacut-us-form" onSubmit={sendEmail}>
                        <div class="column">
                            <div class="col-sm-12 col-lg-12">
                                <input type="text" name="name" placeholder="Your Name" class="contacut-us-inptFld" required />
                            </div>

                            <div class="col-sm-12 col-lg-12">
                                <input type="email" name="email" placeholder="Email Address" class="contacut-us-inptFld" required />
                            </div>

                            <div class="col-sm-12">
                                <input type="tel" name="phone" placeholder="Phone Number" class="contacut-us-inptFld" required />
                            </div>

                            {/* <div class="col-sm-12">
                                <input type="text" name="sub" placeholder="Subject" class="contacut-us-inptFld" required />
                            </div> */}

                            <div class="col-sm-12">
                                <textarea
                                    class="contacut-us-inptFld" rows="" cols=""
                                    name='message'
                                    placeholder="Your Message..." required></textarea>
                            </div>

                            <div class="col-sm-12">
                                <button type="submit" class="contactus-submit">Click to Send an Email</button>
                                <p style={{color:'green'}}>{showSuccessPopup}</p>
                            </div>
                        </div>
                    </form>

                </div>


            </div>

        </div>
    )
}

export default ContactUs
