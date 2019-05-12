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
		addBtn.appendChild(document.createTextNode("Add"));
		div2.appendChild(addBtn);
		addBtn.addEventListener("click", function(){storeInstance.addItemToCart(itemName)}, false);
	}else{
		if(storeInstance.cart[itemName] == undefined){
			var divStock = document.createElement("button");
			divStock.appendChild(document.createTextNode("Out of Stock"));
			div2.appendChild(divStock);
		}
	}

	if(storeInstance.cart != undefined && storeInstance.cart[itemName] > 0){
		var removeBtn = document.createElement("button");
		removeBtn.classList.add("btn-remove");
		removeBtn.appendChild(document.createTextNode("Remove"));
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
	// var items = Object.keys(storeInstance.stock);
	for(var item of displayed){
	// for(var i = 0; i < items.length; i++){
		let itemDiv = document.createElement("li");
		itemDiv.classList.add("product");
		itemDiv.id = "product-" + item;

		container.appendChild(itemDiv);
		renderProduct(itemDiv, storeInstance, item)
	}
}