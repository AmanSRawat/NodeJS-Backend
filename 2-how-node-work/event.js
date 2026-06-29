const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter{
    constructor(){
        super();
    }
}

const myEmmitter = new Sales();

myEmmitter.on("newSales",()=>{
    console.log("There is a new sale");
})

myEmmitter.on("newSales",()=>{
    console.log("Coustomer name: Aman");
})

myEmmitter.on("newSales",stock=>{
    console.log(`There are ${stock} items in stock.`);
})

myEmmitter.emit("newSales",9);

/////////////////////////
const server = http.createServer();

server.on("request",(req,res)=>{
    console.log("Request recived!");
    res.end("Request recived");
});

server.on("request",(req,res)=>{
    console.log("Another request recived!");
})

server.on("close",()=>{
    console.log("Server is closed");
})

server.listen(8000,"127.0.0.1",()=>{
    console.log("Waiting for the request....");
})