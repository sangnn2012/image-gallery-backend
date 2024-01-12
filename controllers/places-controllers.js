const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1',
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1',
    },
    {
        id: 'p3',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u2',
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid; // { pid: 'p1' }
    const place = DUMMY_PLACES.find((place) => place.id === placeId);

    if (!place) {
        const error = new HttpError('Could not find a place for the provided place id', 404);
        return next(error);
    }
    res.json({ place });
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const userPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
    if (!userPlaces || places.length === 0) {
        const error = new HttpError('Could not find a place for the provided user id', 404);
        return next(error);
    }
    res.json({ userPlaces });
}

const createPlace = async (req, res, next) => {    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data.', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates = '';
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator,
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({ place: createdPlace });
}

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid input passed, please check your data.', 422);
    }

    const placeId = req.params.pid;
    const updatedPlace = {
        ...DUMMY_PLACES.find((place) => place.id === placeId),
        title,
        description,
    };
    const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
        throw new HttpError('Could not find a place for that id.', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
    res.status(200).json({ message: 'Deleted place.' });
}

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlace,
    deletePlace,
}