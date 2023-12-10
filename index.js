const http= require("http");
const fs= require("fs");
var requests = require('requests');

const homefile= fs.readFileSync("Home.html","utf-8");

const replaceval= (tempval, orgval) =>{
    let kelvintemp= orgval.main.temp;                  //converting temperature from kelvin to celcius
    var celtemp= kelvintemp - 273.15 ;

   let  temperature= tempval.replace("{%tempval%}",celtemp);
//    console.log(temperature);
     
     temperature= temperature.replace("{%tempmin%}",orgval.main.temp_min-273.15);
     temperature= temperature.replace("{%tempmax%}",orgval.main.temp_max-273.15);
     temperature= temperature.replace("{%location%}",orgval.name);
     temperature= temperature.replace("{%countury%}",orgval.sys.country);
     temperature= temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature;
};

const server= http.createServer((req, res) =>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=chandigarh&appid=7cad55f1e74a91156cbd7e30ef2a1f3e'
        )
        .on('data', function (chunk) {
            const objdata= JSON.parse(chunk);
            const arrdata= [objdata];
            const reatimedata= arrdata.map((val) =>    replaceval(homefile, val)).join("");
            res.write(reatimedata);
            // console.log(reatimedata);
    })
    .on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);
    res.end();
    });
    }else{
        res.end("File not found");
    }
});
server.listen(8080);