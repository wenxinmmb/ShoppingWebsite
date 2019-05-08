var ajaxGet = function (url, onSuccess, onError){
	var count = 0;
	
	var sendRequest = function(){ 	
				let x = new XMLHttpRequest();
				x.open("GET", url);

				// event handling
				x.onreadystatechange = function(){
			      	if (x.readyState === 4){
			         	if (x.status === 200){
			            	console.log(count + " : successfully");
			            	var resp = x.responseText;
			            	var respJson = JSON.parse(resp);
			            	console.log(respJson);
			            	onSuccess(respJson);
			         	}else{
			            	console.log( count + " : failed");
			            	count++;
			            	if(count < 3){
			            		sendRequest();
			            	}else{
			            		onError(x.status);
			            	}
			         	}
			      	}
				}
				x.send();
 	};

	// var sendRequest = function(){ 
	//  	return new Promise (
	// 		function(resolve, reject) {	
	// 			let temp = count;	
	// 			let x = new XMLHttpRequest();
	// 			x.open("GET", url);

	// 			// event handling
	// 			x.onreadystatechange = function(){
	// 		      	if (x.readyState === 4){
	// 		         	if (x.status === 200){
	// 		            	console.log(temp + " : successfully");
	// 		            	var resp = x.responseText;
	// 		            	var respJson = JSON.parse(resp);
	// 		            	console.log(respJson);
	// 		            	resolve(respJson);
	// 		         	}else{
	// 		            	console.log( temp + " : failed");
	// 		            	reject(x.status);
	// 		         	}
	// 		      	}
	// 			}
	// 			x.send();
	// 		});
 // 	};

	// var retry = function(){
	// 	count++;
	// 	console.log(count);
	// 	if(count == 3){
	// 		console.log("Failed three times");
	// 		Promise.reject();
	// 	}else{
	// 		console.log("Initalize a new promise");
	// 		return sendRequest();
	// 	}
	// }

	
	// return sendRequest(
	// 	).then(
	// 		function(val){console.log("S"); return val;},retry()
	// 	).then(
	// 		function(val){console.log("S"); return val;},retry()
	// 	).then(
	// 		function(val){
	// 			onSuccess(val)
	// 		},function(e){
	// 			onError(e);}
	// );
	
	sendRequest();
}