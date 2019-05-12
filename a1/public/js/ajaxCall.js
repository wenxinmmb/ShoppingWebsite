var getDiff = function(obj1, obj2){
	var res = {}

	for(let property of Object.keys(obj1)){
		if(obj1[property] != obj2[property]){
			if(property == "price" || property == "quantity"){
				res[property] = obj1[property] - obj2[property];
			}
		}
	}
	return res;
}

var calDelta = function(serverStock, context){
	var delta = {};
	var items = Object.keys(serverStock);
	var stockCopy = Object.keys(context.stock);

	for(var i = 0; i < items.length; i++){
		let itemName = items[i];
		let index = stockCopy.indexOf(itemName);

		if( index == -1){
			delta[itemName] = serverStock[itemName];
		}else{
			if(serverStock[itemName] != context.stock[itemName]){
				let difference = getDiff(serverStock[itemName], context.stock[itemName]);
				if(Object.keys(difference).length > 0)
					delta[itemName] = difference;
			}
			stockCopy.splice(index, 1)
		}
	}

	for(var i = 0; i < stockCopy.length; i++){
		let itemName = stockCopy[i];
		delta[itemsName] = -context.stock[itemsName];
	}
	console.log("Delta");
	return delta;
}

var ajaxGet = function (url, onSuccess, onError){
	var count = 0;
	var sendRequest = function(){ 	
		let xhr = new XMLHttpRequest();
		xhr.open("GET", url);

		// event handling
		xhr.timeout = 5000;
		xhr.onreadystatechange = function(){
	      	if (xhr.readyState === 4){
	         	if (xhr.status === 200){
	            	console.log(count + " : successfully");
	            	var resp = xhr.responseText;
	            	var respJson = JSON.parse(resp);
	            	console.log(respJson);
	            	onSuccess(respJson);
	         	}else{
	            	console.log( count + " : failed " + xhr.status);
	            	count++;
	            	if(count < 3){
	            		sendRequest();
	            	}else{
	            		onError(xhr.status);
	            	}
	         	}
	      	}
		};
		xhr.send();
 	};
 	sendRequest();
}

var ajaxPost = function (url, data, onSuccess, onError){
	// data: payload of the request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	// event handling
	xhr.timeout = 5000;
	xhr.onreadystatechange = function(){
      	if (xhr.readyState === 4){
         	if (xhr.status === 200){
            	console.log("Posted successfully" + xhr.responseText) ;
            	onSuccess(xhr.responseText);
         	}else{
            	onError(xhr.status);
         	}
      	}
	};
	xhr.send(JSON.stringify(data));
}