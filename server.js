////////////Server/////////////
const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////////////////
const server = http.createServer((req, res) => {
  // console.log(req);
  console.log(req.url);
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.end("this is overview");
  } else if (req.url === "/product") {
    res.end("this is product");
  } else if (pathName === "/api") {
    fs.readFile("./dev-data/data.json", "utf-8", (err, data) => {
      const productData = JSON.parse(data);
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    });
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log("listening to requests on port 8000");
});
