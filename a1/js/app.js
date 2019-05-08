const QUANTITY = "quantity";
const PRICE = "price";


function Store(serverUrl){
	this.serverUrl = serverUrl;
	this.stock = {};
	this.cart = {}; 
	this.onUpdate = null;
	// ajaxGet(serverUrl);
	ajaxGet("https://cpen400a-bookstore.herokuapp.com/products", 
		function(val){this.stock = val;}, 
		function(err){console.log(err)});

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

const storeUrl = "https://cpen400a-bookstore.herokuapp.com";
var store = new Store(storeUrl);
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
	renderProductList(document.getElementById("productView"), store);
	
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
