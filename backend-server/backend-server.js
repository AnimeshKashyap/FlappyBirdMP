var ws = require("nodejs-websocket")
// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text",function (data) {
		if(data=="TAP"){
			server.connections.forEach(function(obj){
				if(obj.key!=conn.key){
					obj.send("TAP");
				}
			});
		}
		else
		if(data=="SCORED"){
			server.connections.forEach(function(obj){
				if(obj.key!=conn.key){
					obj.send("SCORED");
				}
			});	
		}
		else
		if(data=="OUT"){
			server.connections.forEach(function(obj){
				if(obj.key!=conn.key){
					obj.send("OUT");
				}
			});	
		}
		else
		if(data=="RESTART"){
			server.connections.forEach(function(obj){
				if(obj.key!=conn.key){
					obj.send("RESTART");
				}
			});	
		}
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    });
}).listen(9998)
/*
WSKey
UniqueCode
WSKeyM
allConnected={
	asdlashd:{
		wsKey:"WSKey1",
		connectedMobiles:{
						WSKeM1:name1,
						WSKeyM2:name2
						}
	},
	qwerwewr:{
		wsKey:"WSKey2",
		connectedMobiles:{
						WSKeM3:name3,
						WSKeyM4:name4
						}
	}
}
*/

/*
WSKey
UniqueCode
WSKeyM
allConnected={
	WSKey1:{
		uniqueCode:"asdlashd",
		connectedMobiles:["WSKeM1","WSKeyM2"]
	},
	WSKey2:{
		uniqueCode:"qwerwewr",
		connectedMobiles:["WSKeM1","WSKeyM2"]
	}
}
*/








