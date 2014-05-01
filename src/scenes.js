// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {




	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}



	
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter').atPixels(88, 95);
	this.occupied[1][1] = true;


	this.player = Crafty.e('Bomb').at(0, 0);
	this.player = Crafty.e('Bomb').at(1, 0);
	this.player = Crafty.e('Bomb').at(2, 0);
	



	this.player = Crafty.e('FrameTop').atPixels(0, 0);
	this.player = Crafty.e('FrameBottom').atPixels(0, 459);
	this.player = Crafty.e('FrameLeft').atPixels(0, 63);
	this.player = Crafty.e('FrameRight').atPixels(620, 63);
	




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
				this.occupied[x][y] = true;
			}
		}
	}











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