/*
game.js for Perlenspiel 3.3.x
Last revision: 2020-03-24 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-20 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

var grid_size_x = 5;
var grid_size_y = 5;

var is_player_drawing_line = false; // Is the player actively drawing a line?

var background_color = 0x8888FF;
var traversable_bead_color = 0x222266;
var non_traversable_bead_color = background_color;
var line_color = PS.COLOR_WHITE; // Color of the line the player draws.
var empty_color = traversable_bead_color; // Color when there's no line.

var grid_image; // Image object that contains the initial state of the grid.
var path_map; // Map containing the traversable paths that the line can make.
var found_path; // Path from the starting point to the bead that is closest to the mouse position.

var debug_mode = false; // Enable this to see the navigation map, not the final colors.
var puzzle_solved = false; // Did player find the solution?

var audio_options = {
	lock: true,
	path: "audio/",
	fileTypes: ["mp3"],
	onLoad: audioLoaded
}

var fx_PuzzleStart = PS.audioLoad("PuzzleStart", audio_options); // audio_channels["PuzzleStart"]
var fx_PuzzleAbort = PS.audioLoad("PuzzleAbort", audio_options); // audio_channels["PuzzleAbort"]
var fx_PuzzleFail = PS.audioLoad("PuzzleFail", audio_options); // audio_channels["PuzzleFail"]
var fx_PuzzleSuccess = PS.audioLoad("PuzzleSuccess", audio_options); // audio_channels["PuzzleSuccess"]

var audio_channels = {}

/* A Cell is a position on the grid. */
function Cell(x, y)
{
	this.x = x;
	this.y = y;
}

var starting_point = new Cell(0, 4);
var starting_point_color = PS.COLOR_BLUE;

var ending_point = new Cell(4, 0);
var ending_point_color = PS.COLOR_ORANGE;

var line = []; // This is an array of cells that describe the line that has been drawn so far.

// TO DO: Make sure the line doesn't break in different segments.
// TO DO: Make sure the game doesn't freeze as a consequence of redefining the line again and again, as I believe that's happening at the moment.

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.init() event handler:



PS.init = function(system, options)
{
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize(grid_size_x, grid_size_y);
	PS.gridColor(background_color); // set background color to dark gray.

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText("Witness Me");
	PS.statusColor(0xFFFFFF);

	// Add any other initialization code you need here.

	is_player_drawing_line = false;
	line = [];

	//PS.scale(starting_point.x, starting_point.y, 0.5);
	//PS.bgColor(starting_point.x, starting_point.y, 0xFF0000);

	path_map = calculateMap()
	clearGrid();
};



/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.touch() event handler:



PS.touch = function(x, y, data, options)
{
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.

	// Player starts drawing a line. Or stops, if it's already doing so.
	if(x === starting_point.x && y === starting_point.y)
	{
		enableColorFade(false);
		is_player_drawing_line = true;
		PS.color(x, y, line_color);
		line[0] = [starting_point.x, starting_point.y];
		PS.audioPlayChannel(audio_channels["PuzzleStart"]);
	}
	else
	{
		is_player_drawing_line = false;
	}

	if(!is_player_drawing_line)
	{
		puzzle_solved = checkWinningCondition()

		if(puzzle_solved)
		{
			// Next puzzle. Also, let player know he won.
		}
		else
		{
			// TO DO: Change to empty color slowly.
			clearLine()
			clearGrid(true) // with_fade = true
			PS.audioPlayChannel(audio_channels["PuzzleAbort"]);
		}
	}
};



/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:



PS.enter = function(x, y, data, options)
{
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
	if(is_player_drawing_line)
	{
		path_map = calculateMap();
		clearGrid();

		PS.color(starting_point.x, starting_point.y, line_color);
		found_path = calculatePath(line[line.length - 1][0], line[line.length - 1][1], x, y);

		for(var i = 0; i < found_path.length; i++)
		{
			var next_bead = [found_path[i][0], found_path[i][1]];
			var index = getFirstOccurrenceInArray(next_bead, line);

			if(index < 0)
			{
				line.push(next_bead);
			}
			else
			{
				var line_copy = [];

				for(var j = 0; j <= index; j++)
				{
					line_copy.push(line[j]);
				}

				line = line_copy;
			}
		}

		//PS.debugClear();
		//PS.debug("FOUND_PATH: [" + found_path + "]\n");
		//PS.debug("LINE: [" + line + "]\n");
		//PS.debug("LINE_COPY: [" + line_copy + "]\n");
		//PS.debug("LINE_LENGTH: [" + line.length + "]\n");

		for(var i = 0; i < line.length; i++)
		{
			PS.color(line[i][0], line[i][1], line_color);
		}
	}

	//PS.debug( "On PS.enter() @ " + x + ", " + y + "\n" );
};



/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:



PS.exit = function( x, y, data, options )
{
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};



/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:

/*

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

*/

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*
PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};
*/


/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/

function isBeadTraversable(x, y)
{
	var can_be_fill = true;

	// If both coordinates are an odd number, this bead shouldn't be traversable.
	if(x % 2 === 1 && y % 2 === 1)
	{
		can_be_fill = false;
	}

	return can_be_fill;
}

function calculateMap()
{
	var map_id = "";

	// First we create a map from the traversable beads.
	for(var i = 0; i < grid_size_x; i++)
	{
		for(var j = 0; j < grid_size_y; j++)
		{
			if(isBeadTraversable(i, j))
			{
				PS.color(i, j, PS.COLOR_WHITE);
			}
			else
			{
				PS.color(i, j, PS.COLOR_BLACK);
			}
		}
	}

	grid_image = PS.imageCapture(1);
	grid_image.pixelSize = 1;
	// PS.debug(grid_image.source + "\n");
	// PS.debug(grid_image.id + "\n");
	// PS.debug(grid_image.width + "\n");
	// PS.debug(grid_image.height + "\n");
	// PS.debug(grid_image.pixelSize + "\n");
	//PS.debug("GRID DATA: " + grid_image.data + "\n");

	map_id = PS.pathMap(grid_image);

	return map_id;
}

function calculatePath(start_x, start_y, target_x, target_y)
{
	// PS.debug("PATH_MAP_ID: " + path_map + "\n");
	// PS.debug("START: [" + start_x + ", " + start_y + "]\n");
	// PS.debug("TARGET: [" + target_x + ", " + target_y + "]\n");
	var options = {"no_diagonals": true};
	return PS.pathFind(path_map, start_x, start_y, target_x, target_y, options);
}

function clearLine()
{
	line = [];
}

function clearGrid(with_fade = false)
{
	enableColorFade(with_fade)

	if(!debug_mode)
	{
		//PS.debug(map_path + "\n");

		// Next, we color the map, as we want it the player to see.
		for(var i = 0; i < grid_size_x; i++)
		{
			for(var j = 0; j < grid_size_y; j++)
			{
				if(isBeadTraversable(i, j))
				{
					PS.color(i, j, traversable_bead_color);
				}
				else
				{
					PS.color(i, j, non_traversable_bead_color);
				}
			}
		}

		/*found_path = PS.pathFind(path_map, starting_point.x, starting_point.y, ending_point.x, ending_point.y);
		PS.debug(found_path + "\n");*/

		// TO DO: make the starting point a circle and make everything look like the witness, if possible.
		PS.color(starting_point.x, starting_point.y, starting_point_color);
		PS.color(ending_point.x, ending_point.y, ending_point_color);
	}
}

function getFirstOccurrenceInArray(value, array)
{
	var index = -1;

	for(var i = 0; i < array.length; i++)
	{
		if(array[i][0] === value[0] && array[i][1] === value[1])
		{
			index = i;
			break;
		}
	}

	return index;
}

function checkWinningCondition()
{
	// PS.debugClear();
	var won = false;

	if(line.length > 0)
	{
		var line_start = new Cell(line[0][0], line[0][1]);
		var line_end = new Cell(line[line.length - 1][0], line[line.length - 1][1]);

		// PS.debug("LINE_START: " + line_start.x + "," + line_start.y + "\n");
		// PS.debug("LINE_END: " + line_end.x + "," + line_end.y + "\n");
		// PS.debug("START: " + starting_point.x + "," + starting_point.y + "\n");
		// PS.debug("END: " + ending_point.x + "," + ending_point.y + "\n");

		if(line_start.x === starting_point.x && line_start.y === starting_point.y
			&& line_end.x === ending_point.x && line_end.y === ending_point.y)
		{
			won = true;
			PS.audioPlayChannel(audio_channels["PuzzleSuccess"]);
		}
	}
	// TO DO: when player is able to fail giving a solution, do PS.audioPlayChannel(audio_channels["PuzzleFail"]);

	// PS.debug("WIN: " + won + "\n");

	return won;
}

function audioLoaded(audio_object)
{
	audio_channels[audio_object.name] = audio_object.channel
}

function enableColorFade(fade_enabled)
{
	if(fade_enabled)
	{
		PS.fade(PS.ALL, PS.ALL, 180);
	}
	else
	{
		PS.fade(PS.ALL, PS.ALL, 1);
	}
}