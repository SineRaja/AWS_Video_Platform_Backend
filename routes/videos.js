import express from "express";
import { addVideo, addView, deleteVideo, getBySearch, getByTag, getVideo, randomVideo, subscribeVideo, trendVideo, upateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// create a video
router.post("/", verifyToken, addVideo)
router.put("/:id",verifyToken,upateVideo)
router.delete("/:id", verifyToken, deleteVideo)
router.get("/find/:id", verifyToken, getVideo)
router.put("/view/:id", addView)
router.get("/trendvideo",trendVideo)
router.get("/randomvideo",randomVideo)
router.get("/subscribevideos",verifyToken,subscribeVideo)
router.get("/tags",getByTag)
router.get("/search",getBySearch)


export default router;