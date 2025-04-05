const express = require('express');
const { handleGenerateNewShortURL, handleGetAnalytics, handleShortUrl, handleGetUserURLs } = require('../controllers/url');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, handleGenerateNewShortURL);
router.get('/analytics/:shortId', handleGetAnalytics);
router.get('/:shortId', handleShortUrl);
router.get('/user/urls', auth, handleGetUserURLs);

module.exports = router;