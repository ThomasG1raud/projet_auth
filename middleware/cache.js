const NodeCache = require("node-cache");
const cache = new NodeCache();

module.exports = {
  get: (key) => {
    return cache.get(key);
  },
  set: (key, value, duration) => {
    return cache.set(key, value, duration);
  },
  middleware: (duration, preCache) => (req, res, next) => {
    if (req.method !== "GET") {
      console.log(
        "Impossible de mettre en cache autre chose qu'une requête GET"
      );
      return next();
    }
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.error(`Cache hit pour ${key}`);
      res.send(cachedResponse);
    } else {
      console.log(`Cache miss pour ${key}`);
      res.originalSend = res.send;
      res.send = (body) => {
        res.originalSend(body);
        cache.set(key, body, duration);
      };

      if (preCache) {
        preCache().then((data) => {
          cache.set(key, data, duration);
        });
      }

      next();
    }
  },
};
