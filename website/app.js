const http = require("http");
const routes = require("./routes");
const port = 5000;

var server =  http.createServer(routes);
server.listen(port,()=>{
    console.log("node.js server at port",port);
});

