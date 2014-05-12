// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    });
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
    } else {
      this.attr({ x: (x * Game.map_grid.tile.width)+20, y: (y * Game.map_grid.tile.height)+63 });
      return this;
    }
  },

  atPixels: function(x, y) {
      this.attr({
        x: x,
        y: y
      });

      return this;
    },

    position: function() {
      var x = Math.floor( this.x / Game.map_grid.tile.width );
      var y = Math.floor( this.y / Game.map_grid.tile.height );
      //console.log("x: " + x + ', y: ' + y);

      return {x: x, y: y};
    },
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid, Collision');
  },
});

Crafty.c('Bomb', {
  init: function() {
    this.requires('Actor, spr_bomb, SpriteAnimation')
      .reel('Exploding', 1000, 0, 0, 20);

    this.animate('Exploding', -1);
	
  	var that = this;
  	setTimeout( function() {
  		var pos = that.position();
  		that.destroy();
  		Crafty.explode( pos.x, pos.y-1, 3 );
  	}, 2000);
  },
});

Crafty.c('Flame, SpriteAnimation', {
  init: function() {
    this.requires('Actor');
  },
});

Crafty.c('FlameTop', {
  init: function() {
    this.requires('Actor, spr_flame_top, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 7, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

Crafty.c('FlameCenter', {
  init: function() {
    this.requires('Actor, spr_flame_center, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 1, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

Crafty.c('FlameBottom', {
  init: function() {
    this.requires('Actor, spr_flame_bottom, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 0, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

Crafty.c('FlameLeft', {
  init: function() {
    this.requires('Actor, spr_flame_left, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 3, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

Crafty.c('FlameRight', {
  init: function() {
    this.requires('Actor, spr_flame_right, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 5, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

Crafty.c('FlameVertical', {
  init: function() {
    this.requires('Actor, spr_flame_vertical, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 8, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

Crafty.c('FlameHorizontal', {
  init: function() {
    this.requires('Actor, spr_flame_horizontal, Flame, SpriteAnimation')
      .reel('FlameFlicker', 1000, 0, 4, 5);

    this.animate('FlameFlicker', -1);

    var that = this;
    setTimeout( function() {
      that.destroy();
    }, 800);
  },
});

// A Tree is just an Actor with a certain sprite
Crafty.c('Stone', {
  init: function() {
    this.requires('Actor, Solid, spr_stone');
  },
});

Crafty.c('Debug', {
  init: function() {
    this.requires('Actor, spr_debug');
  },
});

// A Bush is just an Actor with a certain sprite
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, spr_bush');
  },
});

// A Rock is just an Actor with a certain sprite
Crafty.c('Brick', {
  init: function() {
    this.requires('Actor, Solid, Collision, spr_brick')
		.onHit('Actor', function() {
			console.log('Something hit this brick: ' + this._x + ', ' + this._y);
      console.log(this);
      Crafty.e('Debug').atPixels(this._x, this._y);
			this.destroy();
		});
  },
});

Crafty.c('FrameTop', {
  init: function() {
    this.requires('Actor, Solid, spr_frame_top');
  },
});

Crafty.c('FrameBottom', {
  init: function() {
    this.requires('Actor, Solid, spr_frame_bottom');
  },
});

Crafty.c('FrameLeft', {
  init: function() {
    this.requires('Actor, Solid, spr_frame_left');
  },
});

Crafty.c('FrameRight', {
  init: function() {
    this.requires('Actor, Solid, spr_frame_right');
  },
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
      .fourway(2)
      .collision([13,55], [37,55], [37,72], [13,72])
      .stopOnSolids()
      .onHit('Village', this.visitVillage)
      .bind('KeyDown', function(e) {
        if( e.key == Crafty.keys.SPACE ) {
          //Crafty.e('Bomb').atPixels(this.x, this.y);
          //console.log('test: ' + this.x + ', ' + this.y);
          var pos = this.position();
          Crafty.e('Bomb').at(pos.x, pos.y);
        }
      })
      // These next lines define our four animations
      //  each call to .animate specifies:
      //  - the name of the animation
      //  - the x and y coordinates within the sprite
      //     map at which the animation set begins
      //  - the number of animation frames *in addition to* the first one
      .reel('PlayerMovingUp',    500, 0, 1, 15)
      .reel('PlayerMovingRight', 500, 0, 0, 15)
      .reel('PlayerMovingDown',  500, 0, 2, 15)
      .reel('PlayerMovingLeft',  500, 0, 3, 15);

    // Watch for a change of direction and switch animations accordingly
    var animation_speed = 4;
    this.bind('NewDirection', function(data) {
      if (data.x > 0) {
        this.animate('PlayerMovingRight', -1);
      } else if (data.x < 0) {
        this.animate('PlayerMovingLeft', -1);
      } else if (data.y > 0) {
        this.animate('PlayerMovingDown', -1);
      } else if (data.y < 0) {
        this.animate('PlayerMovingUp', -1);
      } else {
        this.pauseAnimation();
      }
    });

    this.z = 1000;  // Hack to get the player in front of everything
  },

  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);

    return this;
  },

  // Stops the movement
  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  // Respond to this player visiting a village
  visitVillage: function(data) {
    villlage = data[0].obj;
    villlage.visit();
  }
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
  init: function() {
    this.requires('Actor, spr_village');
  },

  // Process a visitation with this village
  visit: function() {
    this.destroy();
    Crafty.audio.play('knock');
    Crafty.trigger('VillageVisited', this);
  }
});