////////////Server/////////////
const fs = require("fs");
const http = require("http");
const { default: slugify } = require("slugify");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

////////////Read files///////////////////////
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

////////////////slugs/////////////////
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

///////////Read Each time of request///////////
const server = http.createServer((req, res) => {
  // console.log(req);
  console.log(req.url);
  // const pathname = req.url;
  const { query, pathname } = url.parse(req.url, true);

  /////////////routes//////////////////////////
  ///////////Overview page/////////////////////////
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARD%}", cardsHtml);
    res.end(output);
  }

  /////////////////Product page/////////////
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  /////////////api/////////////////////////
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  ///////////////Not Found//////////////
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});

///////listen //////////////////////////
server.listen(8000, "localhost", () => {
  console.log("listening to requests on port 8000");
});
