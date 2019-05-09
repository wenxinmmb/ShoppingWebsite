const QUANTITY = "quantity";
const PRICE = "price";


function Store(serverUrl){
	this.serverUrl = serverUrl;
	this.stock = {};
	this.cart = {};
	this.onUpdate = null;

};

Store.prototype.addItemToCart = function(itemName){
	console.log("Add Item"+ itemName);
	if(this.stock.hasOwnProperty(itemName)){
		if(this.stock[itemName][QUANTITY] > 0){
			if(this.cart.hasOwnProperty(itemName)){
				this.cart[itemName]++;
			}else{
				this.cart[itemName] = 1;
			}
			this.stock[itemName][QUANTITY]--;
			console.log("Added" + itemName + " - Count: " + this.cart[itemName]);
		}else{
			console.log("Not enough "+ itemName +" at store.");
		}
		console.log("Store has "+ itemName + " - " + this.stock[itemName][QUANTITY]);
	}else{
		console.log(itemName +" not found.");
	}		
	inactiveTime = 0;

	//re-render views
	this.onUpdate(itemName);
}

Store.prototype.removeItemFromCart = function(itemName){
	if(this.stock.hasOwnProperty(itemName)){
		if(this.cart.hasOwnProperty(itemName)){
				this.cart[itemName]--;
				console.log("Removed" + itemName + " - Count: " + this.cart[itemName]);
				if (this.cart[itemName] == 0)
					delete this.cart[itemName];
				this.stock[itemName][QUANTITY]++;
		}else{
			console.log("No "+ itemName + " in the cart.");
		}
		console.log("Store has "+ itemName + " - " + this.stock[itemName][QUANTITY]);
	}else{
		console.log(itemName +" not found.");
	}
	inactiveTime = 0;

	//re-render views
	this.onUpdate(itemName);
}

Store.prototype.syncWithServer = function(onSync){
	ajaxGet(this.serverUrl + "/products",function(val, context){
		var delta = calDelta(val, context);
		context.stock = val;
		var cartItems = Object.keys(context.cart);
		for(var i = 0; i < cartItems.length; i++ ){
			context.stock[cartItems[i]].quantity -= context.cart[cartItems[i]];
		}
		context.onUpdate();
		if(onSync !== undefined)
			onSync(delta);
	},
	function(err){
		console.log("Cannot retrieve data")
	}, this);
}

Store.prototype.checkOut = function(onFinish){
	var curStock = this.stock;

	this.syncWithServer(function(delta){
		console.log(delta);
		var comments = [];

		for(let item of Object.keys(delta)){
			
			if(delta[item].hasOwnProperty("quantity") && delta[item].quantity != 0){
				let origQuantity = curStock[item].quantity + delta[item].quantity;
				let comment = "Quantity of " + item + 
					((delta[item].quantity > 0) ? " increased from " : " decresed from ") + 
					origQuantity + 
					" to "+ curStock[item].quantity + "\n";
				console.log(comment);
				comments.push(comment);
			}

			if(delta[item].hasOwnProperty("price") && delta[item].price != 0){
				let comment = "Price of " + item + 
					((delta[item].price > 0) ? " increased from $" : " decresed from $") + 
					(curStock[item].price + delta[item].price) + 
					" to $"+ curStock[item].price + "\n";
				console.log(comment);
				comments.push(comment);
			}
		}
		if(comments.length > 0){
			console.log(comments);
		}else{
			console.log(calTotalPrice());
		}

	});
	onFinish();
}

const storeUrl = "https://cpen400a-bookstore.herokuapp.com";
var store = new Store(storeUrl);
store.syncWithServer();
var inactiveTime = 0;

store.onUpdate = function(itemName){
	if(itemName == undefined){
		renderProductList(document.getElementById("productView"), store);
	}else{
		renderProduct(document.getElementById("product-" + itemName), store, itemName);
	}
	renderCart(document.getElementById('modal-content'),this)
}

// Inactivity timer
var timerIncrement = function() {
    inactiveTime ++;
    if(inactiveTime >= 1800){
    	alert( "Hey there! Are you still planning to buy something?");
    	inactiveTime = 0;
    }
}


window.onload = function() {

	// Get the button that opens the modal
	var cartModal = document.getElementById('modal');
	var showCartbtn = document.getElementById("btn-show-cart");
	var closeSpan = document.getElementById("btn-hide-cart");

	// When the user clicks on the button, open the modal 
	showCartbtn.onclick = function() {
	  	showCart();
	}

	closeSpan.onclick = function() {
	  	hideCart();
	}

	window.onclick = function(event) {
	  	if (event.target == cartModal) {
			hideCart();
	  	}
	}

	document.onkeydown = function(e) {
     	if (e.key === "Escape") { 
       		hideCart();
    	}
	};
}
