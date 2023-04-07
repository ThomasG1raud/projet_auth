const getBooks = require("../scrape/books");

const resources = [
  {
    url: "http://books.toscrape.com/catalogue/category/books_1/",
    data: getBooks("http://books.toscrape.com/catalogue/category/books_1/"),
    ttl: 200,
  },
];

const preCache = (cache) => {
  resources.forEach((resource) => {
    const key = resource.url;
    const value = resource.data;
    cache.set(key, value, resource.ttl);
  });
};

module.exports = { preCache, resources };
