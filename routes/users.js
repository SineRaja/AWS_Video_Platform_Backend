import express from "express";
import { deleteUser, dislike, getUser, like, subscribe, unSubscribe, update } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// update user details
router.put("/:id", verifyToken, update)

// delete user details
router.delete("/:id",verifyToken, deleteUser)

//get a user 
router.get("/find/:id", getUser)

// subscribe a user
router.put("/sub/:id",verifyToken, subscribe)

// unsubscribe a user
router.put("/unsub/:id",verifyToken, unSubscribe)

//like a video
router.put("/like/:videoid",verifyToken, like)

//dis like a video
router.put("/dislike/:videoid",verifyToken, dislike)

export default router;