const NodeCache = require("node-cache");
const cache = new NodeCache();

module.exports = (duration) => (req, res, next) => {
  if (req.method !== "GET") {
    console.log("Impossible de mettre en cache autre chose qu'une requête GET");
    return next();
  }
  const key = req.originalUrl;
  const cacheResponse = cache.get(key);

  if (cacheResponse) {
    console.error("Cache hit pour ${key}");
    res.send(cachedResponse);
  } else {
    console.log("Cache miss pour ${key}");
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
    next();
  }
};
