import express from "express";

const router = express.Router();

router.get("/isAlive", (_, res) => {
  res.status(200).end();
});

router.get("/isReady", (_, res) => {
  res.status(200).end();
});

export default router;
