var http  = require("http");
var qs 	  = require('querystring');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host	: '127.0.0.1',
    port	: 3306,
    user	: 'root',
    password: '',
    database : 'BC-Users'
});
connection.connect();

var reqed = false;
var req;


function start(route) {
	console.log("Server has started...");
	console.log('Server waiting for request...');
	http.createServer(onRequest).listen(8888);
	checkReqest();

 	function onRequest(request, response) {
	    response.writeHead(200, {'Access-Control-Allow-Origin': '*' });    
	    response.writeHead(200, {"Content-Type": "text/plain"});

 		switch (request.url) {

 			case '/users' :
		 		reqed = true;
				var queryString = 'SELECT * FROM users';

				connection.query(queryString, function(err, rows, fields) {
				    if (err) {throw err;} else {

				    }

				    response.write(JSON.stringify(rows));
				    response.end();  
				    console.log('Request = ', queryString, '...');
				    //console.log(JSON.stringify(rows));
				});
				break;

			case '/attacks' :
		 		reqed = true;
				var queryString = 'SELECT * FROM Attacks';

				connection.query(queryString, function(err, rows, fields) {
				    if (err) {throw err;} else {

				    }

				    response.write(JSON.stringify(rows));
				    response.end();  
				    console.log('Request = ', queryString, '...');
				    //console.log(JSON.stringify(rows));
				});
				break;

			case '/characters' :
		 		reqed = true;
				var queryString = 'SELECT * FROM characters';

				connection.query(queryString, function(err, rows, fields) {
				    if (err) {throw err;} else {

				    }

				    response.write(JSON.stringify(rows));
				    response.end();  
				    console.log('Request = ', queryString, '...');
				    //console.log(JSON.stringify(rows));
				});
				break;

			case '/makeCharacters' :
				if (request.method == 'POST') {
			        console.log("POST");
			        var body = '';
			        request.on('data', function (data) {
			            body += data;
			        });
			        request.on('end', function () {
			        	var data = qs.parse(body);
			        	var sql  = "INSERT INTO characters (characterName, class, gender, lvl, characterID, userID, health, stamina) "+
			        			   "VALUES ('"
			        			   	+ data.characterName 
			        			   	+"', '"
			        			   	+ data.characterClass
			        			   	+"', '"
			        			   	+ data.characterGender
			        			   	+"', '"
			        			   	+ data.level
			        			   	+"', '"
			        			   	+ data.characterId
			        			   	+"', '"
			        			   	+ data.userId
			        			   	+"', '"
			        			   	+ data.health
			        			   	+"', '"
			        			   	+ data.stamina
			        			   	+"');"
			        	var secondsql = "INSERT INTO Positions (characterName, class, gender, characterID, health, stamina, x, y, z, rot) "
			        			+"VALUES ('"
			        			   	+ data.characterName 
			        			   	+"', '"
			        			   	+ data.characterClass
			        			   	+"', '"
			        			   	+ data.characterGender
			        			   	+"', '"
			        			   	+ data.characterId
			        			   	+"', '"
			        			   	+ data.health
			        			   	+"', '"
			        			   	+ data.stamina
			        			   	+"', '"
			        			   	+ data.posx
			        			   	+"', '"
			        			   	+ data.posy
			        			   	+"', '"
			        			   	+ data.posz
			        			   	+"', '"
			        			   	+ data.rot
			        			   	+"');";
						connection.query(sql, function(err) {
						    if (err) {
						    	throw err;
						    } else {
						    	console.log('Working...');
						    }
						    response.write('saved');
						    response.end();  
						});
						// connection.query(secondsql, function(err) {
						//     if (err) {
						//     	throw err;
						//     } else {
						//     	console.log('Working...');
						//     }
						//     response.write('saved');
						//     response.end();  
						// });

			        });
			    }
			    response.write('dfdf');
			    response.end();
			break;

			case '/sendPositions':
				if (request.method == 'POST') {
			        console.log("POST");
			        var body = '';
			        request.on('data', function (data) {
			            body += data;
			        });
			        request.on('end', function () {
			        	var data = qs.parse(body);
			        	var sql  = "UPDATE positions SET"
						  			+"x = '"
						  			+ data.posx
						  			+"'" 
							  		+"y  = '"
							  		+ data.posy
							  		+"'"
							  		+"z  = '"
							  		+ data.posz
							  		+"'"
									+"WHERE CharacterID = '"
									+ data.PositionId
									+"'";
			        			   
						connection.query(sql, function(err) {
						    if (err) {
						    	throw err;
						    } else {
						    	console.log('Working...');
						    }
						    response.write('saved');
						    response.end();  
						});
			        });
			    }
			    response.write('dfdf');
			    response.end();
			break

			case '/update':
				// console.log(request);
				if (request.method == 'POST') {
			        console.log("POST");
			        var body = '';
			        request.on('data', function (data) {
			            body += data;
			        });
			        request.on('end', function () {
			        	var data = qs.parse(body);
			        	var sql  = "INSERT INTO users (fname, email, username, pass) "+
			        			   "VALUES ('"
			        			   	+ data.fname 
			        			   	+"', '"
			        			   	+ data.email
			        			   	+"', '"
			        			   	+ data.username 
			        			   	+"', '"
			        			   	+ data.pass
			        			   	+"');";
						connection.query(sql, function(err) {
						    if (err) {
						    	throw err;
						    } else {
						    	console.log('Working...');
						    }
						    response.write('saved');
						    response.end();  
						});

			        });
			    }				// connection.query(req,  function(err) {
				//     if (err) {
				//         console.log('BUGGZ, they are everywhere', err, ' ...')
				//     } else {
				//     	console.log('Inserted data...');
				//     	console.log('Data inserted = ', req);
				//     	req = null;
				//     	checkReqest();
				//     }
				// });
			    response.write('dfdf');
			    response.end();  
				break;

			default: 
			    response.write('Wrong request!');
			    response.end();  
			    break;

		}
		checkReqest();
  	}

  	function checkReqest() {
	  	if (reqed == false) {
	  		console.log('No incoming reqests...');
	  		console.log('...........');
	  	} else {
	  		reqed = false;
	  		console.log('Incoming requests...');
	  	}
	  	console.log('req = ', req);
	}
}

var post = {
	id  	 : 9,
    username : 'fatterPand2a',
    fname    : 'Vladim2ir',
    email	 : 'cool@gma22il.com',
    pass 	 : 'vladIzAw2esome',
};

exports.start = start;