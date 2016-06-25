//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var dgram = require('dgram');

app.use(express.static('app'));
app.use(bodyParser());

//Lets define a port we want to listen to
const PORT=8080;

app.get("/", function(req, res) {
    var path = 'app/index.html';
    var file = fs.createReadStream(path);
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.method === 'HEAD') {
        res.end();
    } else {
        file.on('data', res.write.bind(res));
        file.on('close', function () {
            res.end();
        });
        file.on('error', function (error) {
            self.sendError_(req, res, error);
        });
    }
});

app.get("/api/retrieveComputers", function(req, res) {

    // Read file of stored computers
    initializeRegistry(function(result) {
        console.log(result);
        fs.readFile('registeredComputers.txt', 'utf8', function(err, contents) {
            res.writeHead(200);
            res.write(contents);
            res.end();
        });
    });
});

function initializeRegistry(callback) {
    // Check if file exists, if not then create an empty one "[]"
    fs.access('registeredComputers.txt', fs.F_OK, function(err) {
        if (err) {
            // It isn't accessible, so initialize it.
            fs.writeFile("registeredComputers.txt", "[]", function(err) {
                if (err) {
                    callback(err);
                }
                callback("registeredComputers.txt initialized");
            });
        }
        callback("Accessing registeredComputers.txt");
    });
}

app.post("/api/removeComputer", function(req, res) {
  var user = req.body.username;
  var ip = req.body.ip;
  var mac = req.body.mac;
  fs.readFile('registeredComputers.txt', 'utf8', function(err, contents) {
      // On successful read, convert into an object, push new data,
      // and write new contents
      // console.log("File read...");
      var registerObject = JSON.parse(contents);
      // Search registerObject for matching user/ip/mac
      for (var i = 0; i < registerObject.length; i++) {
        if (registerObject[i].username == user &&
            registerObject[i].ip == ip &&
            registerObject[i].mac == mac) {
              console.log("Found matching entry, removing....");
              registerObject.splice(i, 1);
            }
      }
      fs.writeFile("registeredComputers.txt", JSON.stringify(registerObject), function(err) {
          if (err) {
              return console.log(err);
          }
          console.log("The file was saved!");
          res.writeHead(200);
          res.write(JSON.stringify(registerObject));
          res.end();
      });
  });
})

app.post("/api/register", function(req, res) {
    var user = req.body.username;
    var ip = req.body.ip;
    var mac = req.body.mac;
    initializeRegistry(function(result) {
      console.log(result);
      fs.readFile('registeredComputers.txt', 'utf8', function(err, contents) {
          // On successful read, convert into an object, push new data,
          // and write new contents
          // console.log("File read...");
          var registerObject = JSON.parse(contents);
          registerObject.push(req.body);
          fs.writeFile("registeredComputers.txt", JSON.stringify(registerObject), function(err) {
              if (err) {
                  return console.log(err);
              }
              console.log("The file was saved!");
          });
      });
      console.log(req.body);
      res.writeHead(200);
      res.write(JSON.stringify(req.body));
      res.end();
    })
});

app.post("/api/wakeComputer", function(req, res) {
  // According to:
  // http://www.adminarsenal.com/admin-arsenal-blog/powershell-sending-a-wake-on-lan-wol-magic-packet/
  // The magic packet is a byte array with:
  // 6 bytes of value 255 (0xFF)
  // Followed by 16 repetitions of the mac address
  var beforeConversion = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
  // Break the mac address into its components.
  var splitMac = req.body.mac.split(":");
  // Iterate 16 times
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < splitMac.length; j++) {
      beforeConversion.push(new Buffer(splitMac[j], 'hex')[0]);
    }
  }
  // Convert to byte array
  var magicBytes = Buffer.from(beforeConversion);
  // Send to target ip via udp
  // Supposedly port does not matter with magic packets.
  // Some people report weird behaviour depending on ports (ex./ restart when WOL on port 9)
  // Testing with port 7...
  var udpSocket = dgram.createSocket('udp4');
  udpSocket.send(magicBytes, 0, magicBytes.length, 9, req.body.ip, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + req.body.ip +':'+ 9);
    udpSocket.close();
  });
  console.log(magicBytes);
  console.log(magicBytes.length);
  console.log(req.body);
  res.writeHead(200);
  res.end();
})


// //A sample POST request
// dispatcher.onPost("/post1", function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Got Post Data');
// });

//Lets start our server
app.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
