import express from "express";
import { signin, signup, googleAuth } from "../controllers/authentication.js";


const router = express.Router();

// Create a user
router.post("/signup",signup)

// sign in
router.post("/signin", signin)

//google auth
router.post("/google",googleAuth)

router.post('/logout', (req, res) => {
    try {
        // Assuming you are using session-based authentication
        if (req.session) {
            req.session.destroy((error) => {
                if (error) {
                    console.error('Logout error:', error);
                    res.status(500).json({ message: 'Logout error' });
                } else {
                    res.clearCookie('connect.sid'); // Clear the session cookie
                    res.json({ message: 'Logged out successfully' });
                }
            });
        } else {
            res.json({ message: 'No active session' });
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout error' });
    }
});



export default router;