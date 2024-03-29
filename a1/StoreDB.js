var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver
const CTGR = "category";
const minP = "minPrice";
const maxP = "maxPrice";

/**
 * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
 * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our bookstore app.
 */
function StoreDB(mongoUrl, dbName){
	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
	this.connected = new Promise(function(resolve, reject){
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			function(err, client){
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
					resolve(client.db(dbName));
				}
			}
		)
	});
}

StoreDB.prototype.getProducts = function(queryParams){
	return this.connected.then(function(db){
		return new Promise(function(resolve,reject){
			var query = {};

			if(queryParams.hasOwnProperty(CTGR)){
				query[CTGR] = queryParams[CTGR];
			}

			var priceRange = {}
			if(queryParams.hasOwnProperty(minP)){
				priceRange["$gte"] = parseInt(queryParams[minP]);
			}
			if(queryParams.hasOwnProperty(maxP)){
				priceRange["$lte"] = parseInt(queryParams[maxP]);
			}

			if(Object.keys(priceRange).length > 0){
				query["price"] = priceRange;
			}

			console.log(query);
			db.collection("products").find(query).toArray(
			function(err, result){
				if(err) reject(err);
				var products = {};
				
				for (var i = 0; i < result.length; i++) {
					var id = result[i]["_id"];
					var product = result[i];
					delete product["_id"];
					products[id] = product;
				}
				resolve(products);
			});
		})
	});
}

StoreDB.prototype.addOrder = function(order){
	return this.connected.then(function(db){
		return new Promise(function(resolve, reject){
			
			// 2.  update product collection
			var cart = order["cart"];
			for( const product of Object.keys(cart)){
				var query = {"_id": product};
				console.log("query " + product);
				db.collection("products").updateOne(
					query,
					{"$inc":{"quantity": -cart[product]}},
					function(err,res){
						if(err){
							reject(err)
						}else{
							console.log("Decreased " + product + " by " + cart[product]);
						}
					}
				);
			}
			
			// 1. insert new order document
			var orderId = undefined;
			db.collection("orders").insertOne(order, function(err, res){
				if(err){ 
					reject(err);
				}else{
					orderId = res.insertedId;
					console.log("1 document inserted " + orderId);
					resolve(orderId);
				}
			})
			
		});
	})
}

module.exports = StoreDB;