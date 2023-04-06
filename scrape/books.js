const axios = require("axios");
const cheerio = require("cheerio");

const url = "http://books.toscrape.com/catalogue/category/books_1/"
const book_data = []
async function getBooks(url){
    try{
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const books = $("article");
        books.each(function (){
            title = $(this).find("h3 a").text();
            price = $(this).find(".price_color").text();
            stock = $(this).find(".availability").text().trim();

            book_data.push({title,price,stock})
        });

        if($(".next a").length > 0){
            url = "http://books.toscrape.com/catalogue/category/books_1/"
            next_page = url + $(".next a").attr("href");
            getBooks(next_page)
        }
        return book_data
    }
    catch (error){
        console.error(error);
    }
}

module.exports = getBooks;


