const QUANTITY = "quantity";
const PRICE = "price";

function Store(initialStock){
	// constructor
	this.stock = initialStock;
	this.cart = {}; //associate array - an object
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

	//re-render product item view
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

	//re-render product item view
	this.onUpdate(itemName);
}

var renderProductModal = function(container, item, count, unitPrice){
	if(count == undefined)
		count = 0;
	var price = count * unitPrice;

	var itemText = document.createTextNode(item + ": " + count + " = $" + price + "   ");
	container.replaceChild (itemText, container.firstChild);
}

var updateModalPrice = function(price){
	var priceDiv = document.getElementById("modal-price");
	priceDiv.innerHTML = "$" + price;
	console.log(price);
}
	

function renderCart(container, storeInstance){
	var cart = storeInstance.cart;
	container.innerHTML = "";
	var price = 0;

	for (let item of Object.keys(cart)) {
		console.log(item);
		console.log(storeInstance.stock[item]);
		var unitPrice = storeInstance.stock[item].price;
		var label = storeInstance.stock[item].label;
		price += cart[item] * unitPrice;
		// var productModal =  document.getElementById("product-modal-" + item);
		// if(productModal == undefined){
	  		let itemInfo = document.createElement("div");
	  		
	  		// let itemText = document.createTextNode(item + ": "+ cart[item] + "   ");
	  		let itemSpan = document.createElement("span");
	  		itemSpan.appendChild(document.createTextNode(""));
	  		itemSpan.id = "product-modal-" + item;
	  		renderProductModal(itemSpan, label, cart[item], unitPrice)
	  		itemInfo.appendChild(itemSpan);

	  		let addItem = document.createElement("button")
	  		addItem.appendChild(document.createTextNode("+"));
	  		addItem.addEventListener("click", function(){store.addItemToCart(item)}, false);
	  		itemInfo.appendChild(addItem);

	  		let deleteItem = document.createElement("button")
	  		deleteItem.appendChild(document.createTextNode("-"));
	  		deleteItem.addEventListener("click", function(){store.removeItemFromCart(item)}, false);
	  		itemInfo.appendChild(deleteItem);
	  		
	  		container.appendChild(itemInfo);
	  	// }
	}
	container.appendChild(document.createTextNode(price));
	updateModalPrice(price);
}

var store = new Store(products);
var inactiveTime = 0;

function showCart(cart){
	document.getElementById('modal').style.display = "block";
	renderCart(document.getElementById("modal-content"), store);
	inactiveTime = 0;
}

store.onUpdate = function(itemName){
	renderProduct( document.getElementById("product-" + itemName), store, itemName);
	// var productModal =  document.getElementById("product-modal-" + itemName);
	// if(productModal != undefined){
	// 	renderProductModal( productModal, itemName, store.cart );
	// }
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


var renderProduct = function(container, storeInstance, itemName){
	if(storeInstance.stock == undefined || storeInstance.stock[itemName] == undefined){
		console.log("Cannot find item in store.");
		return;
	}
	container.innerHTML = "";
	var div1 = document.createElement("div");

	var name = document.createTextNode(storeInstance.stock[itemName]["label"]);
	var image = document.createElement("img");
	image.setAttribute("src", storeInstance.stock[itemName]["imageUrl"]);
	image.classList.add("itemImage");

	var div2 = document.createElement("div");
	div2.classList.add("overlay");

	var price = document.createElement("div");
	price.appendChild(document.createTextNode("$" + storeInstance.stock[itemName].price));
	div2.appendChild(price);

	if (storeInstance.stock[itemName].quantity > 0){
		var addBtn = document.createElement("button");
		addBtn.classList.add("btn-add");
		addBtn.appendChild(document.createTextNode("Add to Cart"));
		div2.appendChild(addBtn);
		addBtn.addEventListener("click", function(){storeInstance.addItemToCart(itemName)}, false);
	}

	if(storeInstance.cart[itemName] > 0){
		var removeBtn = document.createElement("button");
		removeBtn.classList.add("btn-remove");
		removeBtn.appendChild(document.createTextNode("Remove from Cart"));
		div2.appendChild(removeBtn);
		removeBtn.addEventListener("click", function(){storeInstance.removeItemFromCart(itemName)}, false);
	}

	div1.appendChild(image);
	div1.appendChild(name);
	div1.appendChild(div2);
	container.appendChild(div1);
}


var renderProductList = function (container, storeInstance){
	container.id = "productView";
	container.innerHTML = "";
	var items = Object.keys(storeInstance.stock);

	for(var i = 0; i < items.length; i++){
		let itemDiv = document.createElement("li");
		itemDiv.classList.add("product");
		itemDiv.id = "product-" + items[i];

		container.appendChild(itemDiv);
		renderProduct(itemDiv, storeInstance, items[i])
	}
}

var hideCart = function() {
	var modal = document.getElementById('modal');
	modal.style.display = "none";
}

window.onload = function() {
	renderProductList(document.getElementById("productView"), store);
	
	// Get the button that opens the modal
	var cartModal = document.getElementById('modal');
	var showCartbtn = document.getElementById("btn-show-cart");
	var closeSpan = document.getElementById("btn-hide-cart");

	// When the user clicks on the button, open the modal 
	showCartbtn.onclick = function() {
	  	showCart(store.cart);
	}

	closeSpan.onclick = function() {
	  	hideCart();
	}

	// When the user clicks anywhere outside of the modal, close it
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
