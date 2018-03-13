var express = require('express'); // import the express framework
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

var db_name = 'EMPLOYEEDB';

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost';;

var jsonMessage = '{"status":"true","message":"hello node.js"}';

// this callback will respond with the message string
app.get('/hello', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
 
   // Send the response body as hardcoded json containing message
   res.end(jsonMessage);
  })

// insert employee details using post
app.post('/addEmployee', function(req, res) {
 
   // Use connect method to connect to the Server
   MongoClient.connect('mongodb://localhost', function (err, client) {
    if (err) throw err;
  
    var db = client.db(db_name);

        if(err) { 
            console.log(err);
         }
else{
    db.collection('employee').insertOne( {
        name: req.body.name,
        city: req.body.city,
        age: req.body.age
    } , function(err, result) {
    console.log("Inserted a document into the employee collection.");

          if(!err)
          {
                   res.status(200).send({"success":"true"});
                console.log({"success":"true"});
           }
          else
           {
               res.status(200).send({"success":"false"});
                console.log({"success":"false"});
             }
      });
    }
    });
  });

// get the list of employees from db
app.get('/listEmployees', function (req, res) {

    MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
      
        var db = client.db(db_name);

    // Get the documents collection
    var collection = db.collection('employee');

    collection.find().toArray(function (err, result) {
        if (err) {
        console.log(err);
       } else if (result.length) {
         console.log('Found:', result);
         res.status(200).send('{"employee":'+ JSON.stringify(result)+"}");
       } else {
        console.log('No document(s) found with defined "find" criteria!');
       }
    });
  });
})

var server = app.listen(8080, function () {

  var port = server.address().port

  console.log("Node app listening at http://127.0.0.1:%s", port)

})