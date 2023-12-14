const express = require('express');

const router = express.Router();

const { getPlaceById, getPlaceByUserId } = require('../controllers/places-controllers');

router.get('/:pid', getPlaceById);

router.get("/user/:uid", getPlaceByUserId);

module.exports = router; 