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
	var self = this;
	ajaxGet(this.serverUrl + "/products",function(val){
		var delta = calDelta(val, self);
		self.stock = val;
		var cartItems = Object.keys(self.cart);
		for(var i = 0; i < cartItems.length; i++ ){
			self.stock[cartItems[i]].quantity -= self.cart[cartItems[i]];
		}
		self.onUpdate();
		if(onSync !== undefined)
			onSync(delta);
	},
	function(err){
		console.log("Cannot retrieve data")
	});
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

Store.prototype.queryProducts = function(query, callback){
	var self = this;
	var queryString = Object.keys(query).reduce(function(acc, key){
			return acc + (query[key] ? ((acc ? '&':'') + key + '=' + query[key]) : '');
		}, '');
	ajaxGet(this.serverUrl+"/products?"+queryString,
		function(products){
			Object.keys(products)
				.forEach(function(itemName){
					var rem = products[itemName].quantity - (self.cart[itemName] || 0);
					if (rem >= 0){
						self.stock[itemName].quantity = rem;
					}
					else {
						self.stock[itemName].quantity = 0;
						self.cart[itemName] = products[itemName].quantity;
						if (self.cart[itemName] === 0) delete self.cart[itemName];
					}
					
					self.stock[itemName] = Object.assign(self.stock[itemName], {
						price: products[itemName].price,
						label: products[itemName].label,
						imageUrl: products[itemName].imageUrl
					});
				});
			self.onUpdate();
			callback(null, products);
		},
		function(error){
			callback(error);
		}
	)
}

function renderMenu(container, storeInstance){
	while (container.lastChild) container.removeChild(container.lastChild);
	if (!container._filters) {
		container._filters = {
			minPrice: null,
			maxPrice: null,
			category: ''
		};
		container._refresh = function(){
			storeInstance.queryProducts(container._filters, function(err, products){
					if (err){
						alert('Error occurred trying to query products');
						console.log(err);
					}
					else {
						displayed = Object.keys(products);
						renderProductList(document.getElementById('productView'), storeInstance);
					}
				});
		}
	}

	var box = document.createElement('div'); container.appendChild(box);
		box.id = 'price-filter';
		var input = document.createElement('input'); box.appendChild(input);
			input.type = 'number';
			input.value = container._filters.minPrice;
			input.min = 0;
			input.placeholder = 'Min Price';
			input.addEventListener('blur', function(event){
				container._filters.minPrice = event.target.value;
				container._refresh();
			});

		input = document.createElement('input'); box.appendChild(input);
			input.type = 'number';
			input.value = container._filters.maxPrice;
			input.min = 0;
			input.placeholder = 'Max Price';
			input.addEventListener('blur', function(event){
				container._filters.maxPrice = event.target.value;
				container._refresh();
			});

	var list = document.createElement('ul'); container.appendChild(list);
		list.id = 'menu';
		var listItem = document.createElement('li'); list.appendChild(listItem);
			listItem.className = 'menuItem' + (container._filters.category === '' ? ' active': '');
			listItem.appendChild(document.createTextNode('All Items'));
			listItem.addEventListener('click', function(event){
				container._filters.category = '';
				container._refresh()
			});
	var CATEGORIES = [ 'Clothing', 'Technology', 'Office', 'Outdoor' ];
	for (var i in CATEGORIES){
		var listItem = document.createElement('li'); list.appendChild(listItem);
			listItem.className = 'menuItem' + (container._filters.category === CATEGORIES[i] ? ' active': '');
			listItem.appendChild(document.createTextNode(CATEGORIES[i]));
			listItem.addEventListener('click', (function(i){
				return function(event){
					container._filters.category = CATEGORIES[i];
					container._refresh();
				}
			})(i));
	}
}

const storeUrl = "https://cpen400a-bookstore.herokuapp.com";
// const storeUrl = "http://localhost:3000"
var store = new Store(storeUrl);
var displayed = []; 
// store the keys of products that should be displayed in the view


store.syncWithServer(
	//not sure the way to update display
	function(delta){
		displayed = Object.keys(delta);
		renderProductList(document.getElementById("productView"), store);
	}
);

var inactiveTime = 0;

store.onUpdate = function(itemName){
	renderMenu(document.getElementById("menuView"), store);
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
