const URL = require('../models/url');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');

async function handleGenerateNewShortURL(req, res) {
  const { url, customId, expiresAt } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const shortId = customId || nanoid(8);
  const userId = req.user?.userId;

  try {
    const existing = await URL.findOne({ shortId });
    if (existing) return res.status(400).json({ error: 'Short ID already in use' });

    const newURL = await URL.create({
      shortId,
      redirectURL: url,
      visitHistory: [],
      createdBy: userId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    const qrCode = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/api/${shortId}`);
    res.json({ id: shortId, qrCode });
  } catch (err) {
    console.error('Error generating short URL:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetAnalytics(req, res) {
  const { shortId } = req.params;
    console.log(shortId)
  try {
    const result = await URL.findOne({ shortId });
    if (!result) return res.status(404).json({ error: 'Short URL not found' });

    res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleShortUrl(req, res) {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOne({ shortId });
    if (!entry) return res.status(404).json({ error: 'Short URL not found' });
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      return res.status(410).json({ error: 'URL has expired' });
    }

    await URL.updateOne({ shortId }, { $push: { visitHistory: { timeStamp: Date.now() } } });
    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error('Error handling redirection:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetUserURLs(req, res) {
  const userId = req.user.userId;

  try {
    const urls = await URL.find({ createdBy: userId });
    res.json(urls);
  } catch (err) {
    console.error('Error fetching user URLs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics, handleShortUrl, handleGetUserURLs };