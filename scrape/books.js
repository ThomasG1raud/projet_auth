const axios = require("axios");
const cheerio = require("cheerio");

const url = "http://books.toscrape.com/catalogue/category/books_1/"

async function getBooks(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const books = $("article");
        const book_data = [];
        books.each(function () {
            const title = $(this).find("h3 a").text();
            const price = $(this).find(".price_color").text();
            const stock = $(this).find(".availability").text().trim();

            book_data.push({ title, price, stock });
        });

        const nextLink = $(".next a").attr("href");
        if (nextLink) {
            url = "http://books.toscrape.com/catalogue/category/books_1/"
            const nextPage = url + nextLink;
            const nextBookData = await getBooks(nextPage);
            return book_data.concat(nextBookData);
        } else {
            return book_data;
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = getBooks;