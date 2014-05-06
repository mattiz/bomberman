// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {







	
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter').atPixels(88, 95);




	Crafty.e('FrameTop').atPixels(0, 0);
	Crafty.e('FrameBottom').atPixels(0, 459);
	Crafty.e('FrameLeft').atPixels(0, 63);
	Crafty.e('FrameRight').atPixels(620, 63);
	



	



	/*
	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

			if (at_edge) {
				// Place a tree entity at the current tile
				Crafty.e('Stone').at(x, y)
				this.occupied[x][y] = true;

			} else if (Math.random() < 0.06 && !this.occupied[x][y]) {
				Crafty.e('Brick').at(x, y)
				this.occupied[x][y] = true;
			}
		}
	}





	// Generate five villages on the map in random locations
	var max_villages = 5;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.03) {
				if (Crafty('Village').length < max_villages && !this.occupied[x][y]) {
					Crafty.e('Village').at(x, y);
				}
			}
		}
	}
	*/





	var tiles = [
		[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0],
		[0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 1, 2, 1, 2, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 1],
		[1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
		[1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 1],
		[0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
		[1, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0],
		[1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1],
		[0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0],
		[0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0]
	];

	var images = [ '', 'Brick', 'Stone' ];




	for( var y = 0; y < tiles.length; y++ ) {
		for( var x = 0; x < tiles[y].length; x++ ) {
			var tile = tiles[y][x];
			var image = images[ tile ];

			if( tile != 0 ) {
				Crafty.e( image ).at(x, y)
			}
		}
	}



	function explode( x, y, length ) {
		var flameTop = true;
		var flameDown = true;
		var flameLeft = true;
		var flameRight = true;

		Crafty.e('FlameCenter').at(x, y);

		for( var i = 1; i < length; i++ ) {
			if( tileAt(x+i, y) == 0 ) {
				Crafty.e('FlameHorizontal').at(x+i, y);		// right arm
			} else {
				flameRight = false;
				break;
			}
		}

		for( var i = 1; i < length; i++ ) {
			if( tileAt(x-i, y) == 0 ) {
				Crafty.e('FlameHorizontal').at(x-i, y);		// left arm
			} else {
				flameLeft = false;
				break;
			}
		}

		for( var i = 1; i < length; i++ ) {
			if( tileAt(x, y-i) == 0 ) {
				Crafty.e('FlameVertical').at(x, y-i);		// top arm
			} else {
				flameTop = false;
				break;
			}
		}
		
		for( var i = 1; i < length; i++ ) {
			if( tileAt(x, y+i) == 0 ) {
				Crafty.e('FlameVertical').at(x, y+i);		// bottom arm
			} else {
				flameBottom = false;
				break;
			}
		}

		if( tileAt(x+length, y) == 0 && flameRight ) {
			Crafty.e('FlameRight').at(x+length, y);
		}

		if( tileAt(x-length, y) == 0 && flameLeft ) {
			Crafty.e('FlameLeft').at(x-length, y);
		}

		if( tileAt(x, y-length) == 0 && flameTop ) {
			Crafty.e('FlameTop').at(x, y-length);
		}

		if( tileAt(x, y+length) == 0 && flameBottom ) {
			Crafty.e('FlameBottom').at(x, y+length);
		}
	}


	function tileAt( x, y ) {
		if( x < 0 || y < 0 || x > (Game.map_grid.width-1) || y > (Game.map_grid.height-1) ) {
			return 2;
		} else {
			return tiles[y][x];
		}
	}



	explode( 5, 2, 3 );
	explode( 0, 6, 3 );
	explode( 11, 2, 1 );
	explode( 12, 5, 1 );
	explode( 6, 8, 4 );






	// Play a ringing sound to indicate the start of the journey
	Crafty.audio.play('ring');




	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});





}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('VillageVisited', this.show_victory);
});










// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.text('All villages visited!')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);

	// Give'em a round of applause!
	Crafty.audio.play('applause');

	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = function() {
		if (!delay) {
			Crafty.scene('Game');
		}
	};
	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});











// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
		.text('Loading; please wait...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
		.textFont($text_css);

	// Load our sprite map image
	Crafty.load([
		'assets/16x16_forest_2.gif',
		'assets/hunter.png',
		'assets/door_knock_3x.mp3',
		'assets/door_knock_3x.ogg',
		'assets/door_knock_3x.aac',
		'assets/board_room_applause.mp3',
		'assets/board_room_applause.ogg',
		'assets/board_room_applause.aac',
		'assets/candy_dish_lid.mp3',
		'assets/candy_dish_lid.ogg',
		'assets/candy_dish_lid.aac'
		], function(){
		// Once the images are loaded...

		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
			spr_tree:    [0, 0],
			spr_bush:    [1, 0],
			spr_village: [0, 1]
		});

		// Define the PC's sprite to be the first sprite in the third row of the
		//  animation sprite map
		Crafty.sprite(51, 77, 'assets/green-player.png', {
			spr_player:  [0, 0],
		}, 0, 0);

		Crafty.sprite(40, 36, 'assets/bomb.png', {
			spr_bomb:  [0, 0],
		}, 0, 0);

		Crafty.sprite(41, 37, 'assets/flame.png', {
			spr_flame_bottom:     [2, 0],
			spr_flame_center:     [2, 1],
			spr_flame_vertical:   [2, 2],
			spr_flame_left:       [2, 3],
			spr_flame_horizontal: [2, 4],
			spr_flame_right:      [2, 5],
			spr_flame_top:        [2, 7],
		});

		Crafty.sprite(40, 36, 'assets/stone.png', {
			spr_stone:  [0, 0],
		}, 0, 0);

		Crafty.sprite(40, 36, 'assets/brick.png', {
			spr_brick:  [0, 0],
		}, 0, 0);

		Crafty.sprite(640, 63, 'assets/frame-top.png', {
			spr_frame_top:  [0, 0],
		}, 0, 0);

		Crafty.sprite(640, 18, 'assets/frame-bottom.png', {
			spr_frame_bottom:  [0, 0],
		}, 0, 0);

		Crafty.sprite(20, 398, 'assets/frame-left.png', {
			spr_frame_left:  [0, 0],
		}, 0, 0);

		Crafty.sprite(20, 398, 'assets/frame-right.png', {
			spr_frame_right:  [0, 0],
		}, 0, 0);

		// Define our sounds for later use
		Crafty.audio.add({
			knock:    ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
			applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
			ring:     ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac']
		});

		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});