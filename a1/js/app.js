const QUANTITY = "quantity";
function Store(initialStock){
	// constructor
	this.stock = initialStock;
	this.cart = {}; //associate array - an object
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
	//re-render product list
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
	//re-render product list
}

function showCart(cart){
	var res = "";
	for (var item of Object.keys(cart)) {
  		res += item + ": "+ cart[item] + '\n';
	}
	alert(res);
	inactiveTime = 0;
}

var store = new Store(products);
var inactiveTime = 0;

// Inactivity timer
var timerIncrement = function() {
    inactiveTime ++;
    if(inactiveTime >= 1800){
    	alert( "Hey there! Are you still planning to buy something?");
    	inactiveTime = 0;
    }
}


function renderProduct(container, storeInstance,itemName){
	
	if(store.stock == undefined || store.stock[itemName] == undefined){
		console.log("Cannot find item in store.");
		return;
	}
	
	var li1 = document.createElement("li");
	li1.classList.add("product");

	var div1 = document.createElement("div");

	var name = document.createTextNode(itemName);
	var image = document.createElement("img");
	image.setAttribute("src", "images/"+ itemName + "_"+"$"+ store.stock[itemName].price+".png");
	image.classList.add("itemImage");

	var div2 = document.createElement("div");
	div2.classList.add("overlay");

	var price = document.createElement("div");
	price.appendChild(document.createTextNode("$1999"));
	div2.appendChild(price);
	
	console.log(store.stock[itemName])
	console.log(store.cart[itemName])

	if (store.stock[itemName].quantity > 0){
		var addBtn = document.createElement("button");
		addBtn.classList.add("btn-add");
		addBtn.appendChild(document.createTextNode("Add to Cart"));
		div2.appendChild(addBtn);
	}

	if(store.cart[itemName] > 0){
		var removeBtn = document.createElement("button");
		removeBtn.classList.add("btn-remove");
		removeBtn.appendChild(document.createTextNode("Remove from Cart"));
		div2.appendChild(removeBtn);
	}
	div1.appendChild(image);
	div1.appendChild(name);
	div1.appendChild(div2);
	li1.appendChild(div1);

	container.parentNode.replaceChild(li1, container);
}


// renderProductList(container, storeInstance){

// }

window.onload = function() {
	var addItembtn = document.getElementsByClassName("btn-add");
	var removeItembtn = document.getElementsByClassName("btn-remove");

	

	// event register
	for(var i = 0; i < addItembtn.length; i++){
		let k = i;
		addItembtn[i].addEventListener("click", function(){store.addItemToCart(productList[k])}, false);
		removeItembtn[i].addEventListener("click", function(){store.removeItemFromCart(productList[k])}, false);
	}

	var showCartbtn = document.getElementById("btn-show-cart");
	showCartbtn.addEventListener("click", function(){showCart(store.cart)}, false);

	setInterval(timerIncrement, 1000);

	var lists = document.getElementById("productList");
	var currentContainer = document.createElement("li");
	lists.appendChild(currentContainer);
	renderProduct(currentContainer, store, "Box1");
	
}
