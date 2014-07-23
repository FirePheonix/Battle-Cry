$(function () {
  setInterval(function(){
    if (game.startGame == true && game.currentlyFalling == false) {
      game.checkGravity();
    }
  }, 10)
  /*
  function setMaterial(node, materialVal) {
    node.material = materialVal;
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        setMaterial(node.children[i], material);
      }
    }
  }
  */
  //$.ajax({ url: 'http://localhost:3000', success: function (data, status, xhr) { console.log(data); }});
  game.money();
  container = document.getElementById( 'canvas' );
  document.body.appendChild( container );
  container.appendChild( renderer.domElement );
  document.addEventListener('pointerlockchange', game.lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', game.lockChangeAlert, false);
  document.addEventListener('webkitpointerlockchange', game.lockChangeAlert, false);
  //$('body').on('click', game.startGame);
  function fovTrue() {game.changingFov = true; console.log('fov = true'); $('body').addClass('cursor-move');}
  function fovFalse() {game.changingFov = false; console.log('fov = false'); $('body').removeClass('cursor-move');}
  // $('body').on('mousedown', fovTrue);
  // $('body').on('mouseup', fovFalse);
  $('#armory-mover').mousedown(game.startMoveArmory);
  $('#attack-storage-mover').mousedown(game.startMoveAttackStorage);
  $('body').on('keydown', game.move); 
  $('#signed-in').toggle(); 
  $('#sign-up').toggle();
  $('#sign-up-password-message').toggle();
  $('#sign-up-email-message').toggle(); 
  $('#sign-up-username-message').toggle();  
  $('#game-guide').toggle(); 
  $('#link1').addClass('selected-link'); 
  $('#community').toggle(); 
  $('#join').toggle(); 
  $('#game-start').toggle(); 
  $('#prep').toggle(); 
  $('#canvas').toggle(); 
  $('#war').toggle(); 
  $('#armory').toggle(); 
  $('#attack-storage').toggle(); 
  $('#makePlayer').toggle();
  function handleMouseMove(event) {
    event = event || window.event; // IE-ism
    mousePos = {
        x: event.clientX,
        y: event.clientY
    };
    game.moveArmory();
    game.moveAttackStorage();
    game.rotatePrep();
    changex = mousePos.x - pasx;
    changey = pasy - mousePos.y;
    //game.changeFov(changex, changey);
    pasx = mousePos.x;
    pasy = mousePos.y;
  }
  window.onmousemove = handleMouseMove;
});
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/platform.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

var currentSelectedPlayer = '';
var pasx, pasy, changex, changey = 0;
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
var preNum, preImg = '';
var emailBug = false; var passBug = false; var usernameBug = false; var fnameBug = false;
var renderer, camera, scene, loader;
var a = 0;
var axis, angle = 0;
var axis2, angle2 = 0;
var dae, skin;
var container;
var mesh1, mesh;
var makingClass, makingGender = 'b';
var meshTop, meshBottom;
var editing = '';
loader   = new THREE.ColladaLoader();
scene    = new THREE.Scene();
renderer = new THREE.WebGLRenderer();
renderer.setSize(screen.width, screen.height);
camera   = new THREE.PerspectiveCamera(100, window.screen.availWidth / window.screen.availHeight, 0.1, 1000);
var game = {
  changingFov       : false,
  captureCursor     : false,
  armoryLetgo       : true,
  attackStorageLetgo: true,
  signUpBugs        : false,
  signedIn          : false,
  startedWar        : false,
  prep              : false,
  moving            : false,
  currentlyFalling  : false,
  gameStarted       : false,
  makingPlayer      : false,

  fov               : 1,
  sensitivity       : 40,
  timeToFall        : 20,
  playerHeight      : 20,

  gold              : 0,
  credits           : 100,

  PasX              : 0,
  PasY              : 0,
  CurX              : 0,
  CurY              : 0,

  session           : {},
  characters        : [],

  currentPage       : '#play',
  currentLinkAr     : ['nothing', '#link1', '#link2', '#link3', '#link4'],
  currentLink       : '#link1',

  attacks           : [],

  signIntoGame : function() { 
    if (localStorage.remember == 'true' && $('#remember-me').is(':checked') == false) {
      $('#remember-me').prop('checked', true);
    }
    if (localStorage.password != 'null' && localStorage.username != 'null' && localStorage.remember != 'false') {
      $('#sign-in-password').val(localStorage.password);
      $('#sign-in-username').val(localStorage.username);
    } 
    $('#main').toggle();
    game.toggleFullScreen();
    $('#game-start').toggle();
  },

  changeFov : function(posx, posy) {
    var y = posy;
    if (game.changingFov == false) return;
    if (game.prep == true || game.war == true) {
      console.log('return failed ', y);
      if (y < 0 && game.fov >= 0) {
        camera.position.z += y*30;
        game.fov--; 
      } else if (y > 0 && game.fov <= 0) {
        camera.position.z += y*30;
        game.fov++; 
      }
    }
  },

  startPrep : function() {
    $('#game-start').toggle();
    $('#canvas').toggle();
    $('#prep').toggle();
    game.setUpCamera();
    game.makeScene();  
    setTimeout(function () { 
      game.setUpPlayerSelector(); 
      game.selectPlayer(0);
      game.prep = true;
    }, 100);
    if (localStorage.remember == true && $('#remember-me').is(':checked') == false) {
      console.log('localStorage.remember true');
    }
  },  

  rotatePrep : function() {
    if (game.prep == true) {
      changex = mousePos.x - pasx;
      changey = pasy - mousePos.y;
      mesh1.rotation.y += (changex/1000);
      mesh.rotation.y += (changex/1000);
      pasx = mousePos.x;
      pasy = mousePos.y;
    }
  },

  setUpPlayerSelector : function() {
    var a = 10;
    var result = '';
    console.log('calc the result')
    for (var i = 0; i< game.characters.length; i++) {
      if (i != 0) {
        a = a + 90;
      }
      console.log('befoe result clac');
      result += '<div id="player' + i + '" class="player" style="top:' + a + 'px; left:10px; right:10px" onclick="game.selectPlayer(' + i + ')">'
        +         '<div class="block" style="top:10px; left:10px">'
        +           '<div id="character' + i + 'name">' + game.characters[i].characterName + '</div>'
        +         '</div>'
        +         '<div class="block" style="top:10px; right:10px; left:135px">'
        +           '<div id="character' + i + 'name">' + game.characters[i].class + '</div>'
        +         '</div>'
        +         '<div class="block" style="top:40px; right:10px; left:135px">'
        +            '<div id="character' + i + 'lvl">lvl ' + game.characters[i].lvl + '</div>'
        +         '</div>'
        +         '<div class="block" style="top:40px; left:10px; right:135px">'
        +           '<div id="character' + i + 'health">hp ' + game.characters[i].health + '</div>'
        +         '</div>'
        +       '</div>';
    }
    $('#players-scroller').html(result);
  },

  war : function() {
    if (currentSelectedPlayer == '') return;
    $('.ingame-attack-slot').css({ 'width':((screen.width-600)/10)-13+'px', 'height':((screen.width-600)/10)-15+'px' });
    $('#prep').toggle();
    game.captureCursor();
    game.startedWar = true;
    game.prep = false;
    $('#war').toggle();
    camera.position.set(0, 15, 75);
    camera.rotation.set(0, 0, 0);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.025;
    mesh1.scale.x = mesh1.scale.y = mesh1.scale.z = 0.025;
    mesh.position.y = 10;
    mesh1.position.y = 15;
    game.makeWarScene();
  },

  makePlayer : function() {
    $('#prep').toggle();
    $('#makePlayer').toggle();
    scene.remove(mesh);
    scene.remove(mesh1);
    if (game.makingPlayer == false) {
      game.makingPlayer = true
      game.renderPlayer('img/WarriorIcon.png', 'img/boy.png');
    }
    
  },

  renderPlayer : function(imgTop, imgBottom) {
      var map;
      if (imgBottom != '') {
        scene.remove(mesh);
      }
      if (imgTop != '') {
        scene.remove(mesh1);
      }   
      if (imgTop != '') {
        map = THREE.ImageUtils.loadTexture(imgTop);
        geometry = new THREE.CubeGeometry(200, 200, 200);
        material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xdcdcdc, map: map});
        mesh1 = new THREE.Mesh(geometry, material);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 1, 1 );
        mesh1.position.y = 200;
        scene.add( mesh1 );
      }
      
      if (imgBottom != '') {
        map = THREE.ImageUtils.loadTexture(imgBottom);
        geometry = new THREE.CubeGeometry(200, 200, 200);
        material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xdcdcdc, map: map});
        mesh = new THREE.Mesh(geometry, material);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set( 1, 1 );
        scene.add( mesh );
      }
  },

  money : function() {
    $('#totalGold').html(game.gold);
    $('#totalCredits').html(game.credits);
  },

  setUpCamera : function() {
    //$(renderer.domElement).css('border', '1px solid red');
    camera.position.set(0, 100, 500);
    camera.rotation.set(0, 0, 0);
  },

  captureCursor : function() {
    captureCursor = true;
    canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;
    canvas.requestPointerLock()
  },

  moveArmory : function() {
    if (game.armoryLetgo == false) {
      $('#armory').css({ 'left':mousePos.x+'px', 'top':mousePos.y+'px' });
    }
  },

  startMoveArmory : function() {
    if (game.armoryLetgo == true) {
      game.armoryLetgo = false;
    } else {
      game.armoryLetgo = true
    }  
  },

  moveAttackStorage : function() {
    if (game.attackStorageLetgo == false) {
      $('#attack-storage').css({ 'left':mousePos.x+'px', 'top':mousePos.y+'px' });
    }
  },

  startMoveAttackStorage : function() {
    if (game.attackStorageLetgo == true) {
      game.attackStorageLetgo = false;
    } else {
      game.attackStorageLetgo = true
    }
    
  },

  toggleFullScreen : function() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  },

  armory : function() {
    $('#armory').toggle();
  },

  attackStorage : function() {
    $('#attack-storage').toggle();
  },

  makeWarScene : function() {
    loader.options.convertUpAxis = true;
    loader.load("../Battle Cry/daes/Strong.dae", function ( collada ) {
      dae = collada.scene;
      skin = collada.skins[ 0 ];

      dae.scale.x = dae.scale.y = dae.scale.z = 10;// done like this to keep ratio

      dae.rotation.x = 0;
      dae.rotation.y = 0;
      dae.rotation.z = 0;

      dae.position.x = 0;
      dae.position.y = 10;
      dae.position.z = 0;

      dae.updateMatrix();
      scene.add( dae );

    });
    camera.position.z = mesh.position.z + 20;
  },

  makeScene : function() {
     
    //setMaterial(dae, new THREE.MeshBasicMaterial({color: 0xff0000}));

    //js3.makeJSONshape(square, 10, 0, 0, 0);

    game.renderLights();
    game.render();
  },

  renderLights : function() {
    var light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
    light.position.set( 0, 100, 0 );
    scene.add( light );
    var light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
    light.position.set( -200, 100, -200 );
    scene.add( light );
    var light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
    light.position.set( 200, 100, 200 );
    scene.add( light );

    var light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
    light.position.set( 300, 300, 0 );
    scene.add( light );
  },

  render : function() {
    window.requestAnimationFrame(game.render);
    renderer.render(scene, camera);
  },

  checkGravity : function() {
    if (mesh.position.y > game.playerHeight && game.currentlyFalling == false) { game.currentlyFalling = true; // determine whether needs to fall
      var fallsNeeded = mesh.position.y - game.playerHeight/2; // amount of falls needed to get to goal
      fallMot();
      function fallMot() {    
        setTimeout(function(){
          mesh.position.y--;
          mesh1.position.y--;
          fallsNeeded--;
          if (fallsNeeded == 0) { } else { fallMot(); }
        }, 10)
      } game.currentlyFalling = false;
    }
  },

  jump: function() {
    if (camera.position.y < game.playerHeight * 1.25) { game.currentlyFalling = true;// determines whether to start the jumping proccess
      var jumpsNeeded = (game.playerHeight * 1.25) - mesh.position.y; // amount of jumps needed to get to goal
      jumpMot();
      function jumpMot() {    
        setTimeout(function(){
          mesh.position.y++;
          mesh1.position.y++;
          jumpsNeeded--;
          if (jumpsNeeded == 0) { game.checkGravity(); } else { jumpMot(); }
        }, 15)
      } game.currentlyFalling = false;
    }   
  },

  lockChangeAlert : function() {
    if(document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas ||
    document.webkitPointerLockElement === canvas) {
      document.addEventListener("mousemove", game.canvasLoop, false);
    } else {
      document.removeEventListener("mousemove", game.canvasLoop, false);
    }
  },

  rotateScreen : function() {
    var dy = '';
    var dx = '';
    if (game.CurY < game.PasY) {dy = 'down';} else if (game.CurY > game.PasY) {dy = 'up';}
    if (game.CurX < game.PasX) {dx = 'right';} else if (game.CurX > game.PasX) {dx = 'left';}
    //if (dy == 'down') {camera.rotation.x -= game.sensitivity/1000;} else if (dy == 'up') {camera.rotation.x += game.sensitivity/1000;}
    if (dx == 'right') {camera.rotation.y -= game.sensitivity/1000;} else if (dx == 'left') {camera.rotation.y += game.sensitivity/1000;}
    js3.checkForAxis();
  },

  move : function(e) { 
  if (game.startedWar == true) {
    //game.sendPlayerCord(mesh.position.x, mesh.position.y, mesh.position.z, mesh.rotation.y);
      if (e.keyCode == 87) {
        js3.positionOnAxis('+', 10, mesh.rotation.y);
      } 
      if (e.keyCode == 83) {
        game.moveMot('z', '+');
      } 
      if (e.keyCode == 32) {
        game.jump();
      } 
      if (e.keyCode == 65) { 
        mesh.rotation.y = mesh.rotation.y + 0.05;
        mesh1.rotation.y = mesh1.rotation.y + 0.05;
        if (mesh.rotation.y >= 2*Math.PI) {
          mesh.rotation.y = 0;
        }
      } 
      if (e.keyCode == 68) {
        mesh.rotation.y = mesh.rotation.y - 0.05;
        mesh1.rotation.y = mesh1.rotation.y - 0.05;
        if (mesh.rotation.y >= 2*Math.PI) {
          mesh.rotation.y = 0;
        }
      }
      if (e.keyCode == 82) {
        if (captureCursor == true) {
          game.releaseCursor();
        } else {
          game.captureCursor();
        }
      }
      if (e.keyCode == 192) {
        game.releaseCursor();
        if ($('#w2ui-popup').length == 0) {
          w2popup.open({
            title: 'Options',
            body: '<div class="options">Sensitivity <input type="number" id="sensitivity" value=game.sensitivity></div>',
            onClose : function (event) {
              game.updateSensitivity();
              game.captureCursor();
            },
          })
        }
      }
      if (e.keyCode == 13) {
        w2popup.close();
      }
    }
  },

  moveMot : function(direction, f) {    
    if (game.moving == false) {
      game.moving = true;
      var needed = 20;
      mot();
      function mot() {
        setTimeout(function(){
          if (f == '-') {mesh.position[direction] = mesh.position[direction] - 0.5; mesh1.position[direction] = mesh1.position[direction] - 0.5; camera.position[direction] = camera.position[direction] - 0.5;
          } else {mesh.position[direction] = mesh.position[direction] + 0.5; mesh1.position[direction] = mesh1.position[direction] + 0.5; camera.position[direction] = camera.position[direction] + 0.5;}
          needed--;
          if (needed == 0) { game.moving = false; } else { mot(); }
        },1)
      }
    }
  },

  canvasLoop : function( e ) {
    var movementX = e.movementX ||
        e.mozMovementX          ||
        e.webkitMovementX       ||
        0;

    var movementY = e.movementY ||
        e.mozMovementY      ||
        e.webkitMovementY   ||
        0;
    //game.PasX = game.CurX;
    //game.PasY = game.CurY; 
    game.CurX = game.PasX;
    game.CurY = game.PasY;

    game.PasX += movementX / 10;
    game.PasY += movementY / 10; 
    console.log();

    game.rotateScreen();
  },

  selectPlayer : function(num) {
    var str = num.toString();
    var divId = '#player' + str;
    $(currentSelectedPlayer).removeClass( 'highlighted-player' );
    $(divId).addClass( 'highlighted-player' );
    currentSelectedPlayer = divId;
    game.renderPlayerPreview(num);
  },

  renderPlayerPreview : function(num) {
    scene.remove(mesh);
    scene.remove(mesh1);
    var clas = 'img/' + game.characters[num].class + 'Icon.png';
    var gender = 'img/' + game.characters[num].gender + '.png';
    game.renderPlayer(clas, gender);
  },

  updateSensitivity : function() {
    var a = $('#sensitivity').val();
    game.sensitivity = a;
  },

  releaseCursor : function() {
    captureCursor = false;
    document.exitPointerLock = document.exitPointerLock    ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock;
    document.exitPointerLock();
  },

  signIn : function() {
    var usernameVal = $('#sign-in-username').val();
    var password = $('#sign-in-password').val();
    console.log(usernameVal, password);

    if (password != '' && usernameVal != '') {
      $.ajax({ 
        url: 'http://localhost:8888/users', 
        success: function (data, status, xhr) { 
          users = $.parseJSON(data);
          for (var i=0; i<users.length; i++) {
            if (users[i].username == usernameVal && users[i].pass == password) {         
              game.session.user = users[i];
            }
          }
          // wrong login
          if (game.session.user == null) {
            $('#sign-in-password').addClass("wrong-sign-in");
            $('#sign-in-username').addClass("wrong-sign-in");
          } else {
            console.log(game.session.user.fname, 'signed in.' );
            game.signedIn = true;
            sign();
            game.startPrep();
          }
        }
      });
    }
    function sign() {
      if (game.signedIn == true) {
        $('#sign-in-username').val('');
        $('#sign-in-password').val('');
        $('#sign-in').toggle();
        $('#signed-in').toggle();

        $.ajax({ 
          url: 'http://localhost:8888/characters',
          method: 'POST',
          success: function (data, status, xhr) {
          var a = -1; 
            var characters = $.parseJSON(data);
            for (var i=0; i<characters.length; i++) {
              if (characters[i].UserID == game.session.user.id) {
                a++;
                game.characters[a] = characters[i];
              }
            }
          }
        }); 
      }
    }
  },

  signOut : function() {
    game.session = {};
    $('#sign-in').toggle();
    $('#signed-in').toggle();
    game.signedIn = false;
  },

  link : function(gotoo) {
    var go = gotoo;
    if (go == game.currentPage) return;
    $(game.currentPage).toggle( "slow" );
    setTimeout(function(){
      $(gotoo).toggle( "slow" );
    },600)
    game.currentPage = go;
  },

  highlightLink : function(num) {
    var number = num;
    var link = game.currentLinkAr[number];
    $(game.currentLink).removeClass('selected-link');//removes highlight from previos link
    $(link).addClass('selected-link');// link going to   
    game.currentLink = link;
    game.enlargeImg(number);
  },

  enlargeImg : function(num) {
    var number = '#'+num;
    var img = number+num;
    $(number).toggle();
    $(img).addClass('enlarge', {duration:600});
    if (preNum != '') {
      $(preNum).toggle();
      $(preImg).removeClass('enlarge', {duration:600}); 
    }
    preNum = number;
    preImg = img;
  },

  sendPlayerCord : function(x, y, z, rot) {
    $.ajax({ 
      url: 'http://localhost:8888/sendPositions',
      method: 'POST',
      data: {
        posx  : x,
        posy  : y,
        posz  : z,
        rot: rot,
        // req: "INSERT INTO people SET `id` = 7, `fname` = 'Hello MySQL', `email` = 'vlad2', `pass` = 'sawd', `username` = '12edas14d'",
      },
      success: function (data, status, xhr) {  

      }
    }); 
  },

  signUp : function() {
    var id;
    var fname = $('#sign-up-fname').val();
    var emailVal = $('#sign-up-email').val();
    var usernameVal = $('#sign-up-username').val();
    var password = $('#sign-up-password').val();
    var conPassword = $('#sign-up-confirm-password').val();

    if (password == '' || conPassword == '') {
      alert('Error: didnt fill out password');
    } 

    if (password == conPassword) {
      if (passBug == true) {
        $('#sign-up-password-message').toggle();
      }
      passBug = false;
    } else { 
      $('#sign-up-password').val('');
      $('#sign-up-confirm-password').val('');
      if (passBug == false) {
        $('#sign-up-password-message').toggle();
        passBug = true;   
      }
      game.signUpBugs = true;
    }
    
    if (fname == '') {
      fnameBug = true;
      alert('Error: Forgot to fill out first name')
    } else {
      fnameBug = false;
    }
    if (emailVal == '') {
      emailBug = true;
      alert('Error: Forgot to fill out email');
    } else {
      emailBug = false;
    }
    if (usernameVal == '') {
      usernameBug = true;
      alert('Error: Forgot to fill out username')
    } else {
      usernameBug = false;
    }

    $.ajax({ 
      url: 'http://localhost:8888/users', 
      success: function (data, status, xhr) { 
        users = $.parseJSON(data);
        for (var i=0; i<users.length; i++) {
          if (users[i].email == emailVal) { 
            if (emailBug == false) {       
              $('#sign-up-email-message').toggle();
            }
            game.signUpBugs = true;
            $('#sign-up-email').val('');
          } else {
            emailBug = false;
          }
          if (users[i].usernameVal == usernameVal) {  
            if (usernameBug == false) {
              $('#sign-up-username-message').toggle();
            }
            game.signUpBugs = true;
            $('#sign-up-username').val('');
          } else {
            usernameBug = false;
          }
        }
      }
    });

    if (emailBug == true || usernameBug == true || passBug == true || fnameBug == true) {
      return;
    }

    $.ajax({ 
      url: 'http://localhost:8888/update',
      method: 'POST',
      data: {
        idVal   : id,
        fname   : fname,
        username: usernameVal,
        pass    : password,
        email   : emailVal
        // req: "INSERT INTO people SET `id` = 7, `fname` = 'Hello MySQL', `email` = 'vlad2', `pass` = 'sawd', `username` = '12edas14d'",
      },
      success: function (data, status, xhr) {  

      }
    }); 
    if (emailBug == false && passBug == false && usernameBug == false) {
      fname = $('#sign-up-fname').val('');
      emailVal = $('#sign-up-email').val('');
      usernameVal = $('#sign-up-username').val('');
      password = $('#sign-up-password').val('');
      conPassword = $('#sign-up-confirm-password').val('');
    }
  },

  makeCharacter : function(making, clas, gender) {
    if (making == true) {
      game.sendCharacter(makingClass, makingGender);
    } else {
      if (clas != makingClass) { // tests whether the class changed  
        if (clas != '') {
          var changing = '#make-' + clas;
          $('#make-'+makingClass).removeClass( 'highlighted-class' );
          $(changing).addClass( 'highlighted-class' );
          makingClass = clas;
        }  
      }
      if (gender != makingGender) { // tests whether the gender changed
        if (gender != '') {
          var changing = '#make-' + gender;
          $('#make-'+makingGender).removeClass( 'highlighted-class' );
          $(changing).addClass( 'highlighted-class' );
          makingGender = gender;
          console.log(makingGender);
        } 
      }
    }
  },
  sendCharacter : function(clas, gender) {
    var name = $('#character-name').val();
    if (name == '' || makingClass == '' || makingGender == '') {
      return;
    } 
    var characterID = 0;
    console.log(makingClass + makingGender);
    if (makingClass != '' && makingGender != '') {
      console.log('making player ' + name)
      $.ajax({ 
        url: 'http://localhost:8888/characters', 
        success: function (data, status, xhr) { 
          var characters = $.parseJSON(data);
          for (var i=0; i<characters.length; i++) {
            if (name == characters.characterName) {
              alert('name taken');
              return;
            }
          }
        }
      });
      $.ajax({ 
        url: 'http://localhost:8888/makeCharacters',
        method: 'POST',
        data: {
          characterName   : name,
          characterClass  : makingClass,
          characterGender : makingGender,
          userId          : game.session.user.id,
          characterId     : characterID,
          level           : 1,
          health          : 1000,
          stamina         : 100,
          characterCode   : game.characterCode,
          posx            : null,
          posy            : null,
          posz            : null,
          rot             : null,
        
          // req: "INSERT INTO people SET `id` = 7, `fname` = 'Hello MySQL', `email` = 'vlad2', `pass` = 'sawd', `username` = '12edas14d'",
        },
        success: function (data, status, xhr) {  
          $('#character-name').val('');
          console.log('player made');
        }
      });
      $.ajax({ 
        url: 'http://localhost:8888/characters',
        method: 'POST',
        success: function (data, status, xhr) {
        var a = -1; 
        game.characters = [];
          var characters = $.parseJSON(data);
          for (var i=0; i<characters.length; i++) {
            if (characters[i].UserID == game.session.user.id) {
              a++;
              game.characters[a] = characters[i];
            }
          }
          game.setUpPlayerSelector();
          $('#prep').toggle();
          $('#makePlayer').toggle();
        }
      });
    }
  },

  rememberMe : function() {
    console.log('reached remember me function');
    var a = $('#remember-me').is(':checked');
    if (a == false && game.prep == false) {
      console.log('return');
      localStorage.username = null;
      localStorage.password = null;
      localStorage.remember = false;
      return;
    }
    if (game.prep == true) {
      return;
    }
    console.log('a' + a + 'local' + localStorage.remember);
    if (a == true) {
      localStorage.username = $('#sign-in-username').val();
      localStorage.password = $('#sign-in-password').val();
      localStorage.remember = true;
    } else {
      localStorage.remember = false;
    }
    console.log(localStorage.remember, localStorage.password, localStorage.username);
  },

  moveArmorySlider : function(e, tf) {
    editing = '#armory-slider-' + e;
    $( editing ).on('mouseup', stop);
    function stop() {
      tf = 'false';
    }
    if (tf == 'true') {
      $(editing).css({ 'left':mousePos.x+'px' });
      console.log(editing, mousePos.x);
      setTimeout(function() {
        game.moveArmorySlider(e, 'true');
      }, 1)  
      return;
    }
    $( editing ).mousedown(function() {
      $(editing).css({ 'right':mousePos.x+'px' });
      console.log(editing, mousePos.x);
      setTimeout(function() {
        game.moveArmorySlider(e, 'true');
      }, 1)  
    });
  },
};





