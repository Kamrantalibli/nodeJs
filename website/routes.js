var fs  = require("fs");


const routeHandler = (request,response) =>{

    if(request.url == "/"){
        fs.readFile("index.html",(error,html) => {
            response.writeHead(200, {"Content-type": "text/html"});
            response.write(html)
            response.end() 
        })
    }
    else if(request.url == '/blogs'){
        fs.readFile("blogs.html",(error,html) => {
            response.writeHead(200, {"Content-type": "text/html"});
            response.write(html)
            response.end() 
        })
    }
    
    else if(request.url == '/create' && request.method == "POST"){
        const data = [];

        request.on("data" , (chunk) =>{
            data.push(chunk);
        })
        request.on("end" , ()=>{
            const result = Buffer.concat(data).toString();
            console.log(result);
            const parsedData = result.split("=").pop();
            console.log(parsedData);
            fs.appendFile("blogs.txt" , parsedData , (err) =>{
                if (err) {
                    console.log(err);
                }else{
                    response.statusCode = 302;
                    response.setHeader("location" , "/");
                    response.end();
                }
            })
        });

    }
    else if(request.url == '/create'){
        fs.readFile("create.html",(error,html) => {
            response.writeHead(200, {"Content-type": "text/html"});
            response.write(html)
            response.end() 
        })
    }
    else{
        fs.readFile("404.html",(error,html) => {
            response.writeHead(404, {"Content-type": "text/html"});
            response.write(html)
            response.end() 
        })
    }

}

module.exports = routeHandler;