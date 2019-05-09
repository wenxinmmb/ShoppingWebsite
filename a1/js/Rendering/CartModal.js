var renderProductModal = function(container, item, count, unitPrice){
	if(count == undefined)
		count = 0;
	var price = count * unitPrice;

	var itemText = document.createTextNode(item + ": " + count + " = $" + price + "   ");
	container.replaceChild (itemText, container.firstChild);
}

var renderCart = function(container, storeInstance){
	var cart = storeInstance.cart;
	container.innerHTML = "";
	var price = 0;

	for (let item of Object.keys(cart)) {
		var unitPrice = storeInstance.stock[item].price;
		var label = storeInstance.stock[item].label;
		price += cart[item] * unitPrice;

	  	let itemInfo = document.createElement("div");
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
	}
	// add total price
	var totalPrice = document.createElement("div");
	totalPrice.appendChild(document.createTextNode("Total Price : $" +	price));
	container.appendChild(totalPrice);

	var checkOut = document.createElement("button");
	checkOut.innerHTML ="Check out";
	container.appendChild(checkOut);

}

var hideCart = function() {
	var modal = document.getElementById('modal');
	modal.style.display = "none";
}

var showCart = function(){
	document.getElementById('modal').style.display = "block";
	renderCart(document.getElementById("modal-content"), store);
	inactiveTime = 0;
}