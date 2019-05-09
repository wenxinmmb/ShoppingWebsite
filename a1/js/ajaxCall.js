var getDiff = function(obj1, obj2){
				var res = {}
				let obitem = Object.keys(obj1);
				for(var i = 0; i< obitem.length; i++){
					if(obj1[obitem[i]] !== obj2[obitem[i]]){
						if(typeof(obj1[obitem[i]]) === "number"){
							res[obitem[i]] = obj1[obitem[i]] - obj2[obitem[i]];
						}else{
							res[obitem[i]] = obj1[obitem[i]];
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
				if(serverStock[itemName] !== context.stock[itemName]){
					delta[itemName] = getDiff(serverStock[itemName], context.stock[itemName]);
				}
				stockCopy.splice(index, 1)
			}
		}

		for(var i = 0; i < stockCopy.length; i++){
			let itemName = stockCopy[i];
			delta[itemsName] = -context.stock[itemsName];
		}
		console.log("Delta");
		console.log(delta)
		return delta;
	}

var ajaxGet = function (url, onSuccess, onError, context){
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
	            	onSuccess(respJson, context);
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