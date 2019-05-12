// Require dependencies
var path = require('path');
var express = require('express');
var storedb = require('./StoreDB');

// Declare application parameters
var PORT = process.env.PORT || 3000;
var STATIC_ROOT = path.resolve(__dirname, './public');

// Defining CORS middleware to enable CORS.
// (should really be using "express-cors",
// but this function is provided to show what is really going on when we say "we enable CORS")
function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
  	next();
}

// Instantiate an express.js application
var app = express();

// Configure the app to use a bunch of middlewares
app.use(express.json());							// handles JSON payload
app.use(express.urlencoded({ extended : true }));	// handles URL encoded payload
app.use(cors);										// Enable CORS

app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource

// Configure '/products' endpoint
app.get('/products', function(request, response) {
	console.log(request.query);
	bookstoreDb.getProducts(request.query).then(
		function(products){
			response.json(products)
		},
		function(err){
			response.status(500).send({error: err});
		} // TODO: need to test error state
	);
});

// Configure POST '/checkout' endpoint
app.post('/checkout', function (request, response) {
	console.log(request.body)
	
	var order = request.body
	if(!order.hasOwnProperty("client_id") || (typeof order["client_id"] !== 'string')){
		response.status(500).send("Invalid Client Id.");
		console.log("Invalid Client Id.")
		return;
	}

	if(order.hasOwnProperty("cart")){
		let cart = order["cart"];
		for(var key in cart){
			if((typeof key !== 'string') || (typeof cart[key] !== 'number')){
				response.status(500).send("Invalid Cart Product.");	
				console.log("Invalid Cart Product.")	
				return;
			}
		}
	}else{
		response.status(500).send("Invalid Cart.");
		console.log("Invalid Cart.")
		return;		
	}

	if(!order.hasOwnProperty("total") || (typeof order["total"] !== 'number')){
		response.status(500).send("Invalid Total.");
		console.log("Invalid Total.")
		return
	}

	bookstoreDb.addOrder(order).then(
		function(id){
			console.log("ref: " + id);
			response.json(id)
		},
		function(err){
			response.status(500).send({error: err});
		} // TODO: need to test error state
	);
})

// Start listening on TCP port
app.listen(PORT, function(){
    console.log('Express.js server started, listening on PORT '+PORT);
});

var dbUrl = "mongodb://localhost:27017/"
var bookstoreDb = storedb(dbUrl,"cpen400a-bookstore");