const jsonServer = require("json-server");

const server = jsonServer.create();

// Comment out to allow write operations
const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
    "/movies": "/movies",
  })
);

// Middleware para permitir pesquisas por título
server.use((req, res, next) => {
  if (req.method === "GET" && req.path === "/movies") {
    const title = req.query.title;
    if (title) {
      const db = router.db;
      const movies = db.get("movies").filter({ title }).value();
      res.jsonp(movies);
    } else {
      next();
    }
  } else {
    next();
  }
});

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
