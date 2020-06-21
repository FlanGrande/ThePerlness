class Level {
	constructor(level_id)
	{
		return this.loadLevel(level_id);
	}

	generateLevel(w, h, sp, ep, options)
	{
		this.width = w;
		this.height = h;
		this.starting_point = sp;
		this.ending_point = ep;
		this.level_options = options;

		if(typeof this.level_options === 'undefined')
		{
			this.level_options = {
				background_color: 0x8888FF,
				traversable_bead_color: 0x222266,
				non_traversable_bead_color: 0x8888FF, //background_color
				line_color: PS.COLOR_WHITE,
				empty_color: 0x222266, //traversable_bead_color
				starting_point_color: PS.COLOR_BLUE,
				ending_point_color: PS.COLOR_ORANGE
			};
		}

		this.puzzle_widgets = {
			hexagon_dots: [],
			blacks_and_whites: []
		};

		console.log(this);
		return this;
	}

	// The statements written here are, at the moment, the levels in the game.
	// TO DO: externalize level generation.
	loadLevel(id)
	{
		var level_to_return = this.generateLevel(7, 7, new Cell(0, 4), new Cell(4, 0));

		switch(id)
		{
			case 1:
				// Level 1
				level_to_return = this.generateLevel(7, 7, new Cell(0, 4), new Cell(4, 0));

				PS.gridSize(level_to_return.width, level_to_return.height);
				PS.gridColor(level_to_return.options().background_color);

				return level_to_return;
			// case 2:
			// 	// Level 2
			// 	var level_options = {
			// 		background_color: 0x00C942,
			// 		traversable_bead_color: 0x004D1A,
			// 		non_traversable_bead_color: 0x00C942, //background_color
			// 		line_color: 0xA5FC14,
			// 		empty_color: 0x004D1A, //traversable_bead_color
			// 		starting_point_color: PS.COLOR_BLUE,
			// 		ending_point_color: PS.COLOR_ORANGE
			// 	}

			// 	level_to_return = this.generateLevel(5, 5, new Cell(0, 4), new Cell(4, 0), level_options);

			// 	PS.gridSize(level_to_return.width, level_to_return.height);
			// 	PS.gridColor(level_to_return.options().background_color);
			// 	level_to_return.addPuzzleWidget(0, 0, "hexagonDot");
			// 	level_to_return.addPuzzleWidget(4, 4, "hexagonDot");

			// 	return level_to_return;
			// case 3:
			// 	// Level 3
			// 	var level_options = {
			// 		background_color: 0x00C942,
			// 		traversable_bead_color: 0x004D1A,
			// 		non_traversable_bead_color: 0x00C942, //background_color
			// 		line_color: 0xA5FC14,
			// 		empty_color: 0x004D1A, //traversable_bead_color
			// 		starting_point_color: PS.COLOR_BLUE,
			// 		ending_point_color: PS.COLOR_ORANGE
			// 	}

			// 	level_to_return = this.generateLevel(7, 7, new Cell(0, 6), new Cell(6, 0), level_options);

			// 	PS.gridSize(level_to_return.width, level_to_return.height);
			// 	PS.gridColor(level_to_return.options().background_color);
			// 	level_to_return.addPuzzleWidget(2, 0, "hexagonDot");
			// 	level_to_return.addPuzzleWidget(4, 2, "hexagonDot");
			// 	level_to_return.addPuzzleWidget(0, 4, "hexagonDot");
			// 	level_to_return.addPuzzleWidget(2, 4, "hexagonDot");
			// 	level_to_return.addPuzzleWidget(6, 6, "hexagonDot");

			// 	return level_to_return;
			case 2:
				// Level 4
				var level_options = {
					background_color: 0x00C942,
					traversable_bead_color: 0x004D1A,
					non_traversable_bead_color: 0x00C942, //background_color
					line_color: 0xA5FC14,
					empty_color: 0x004D1A, //traversable_bead_color
					starting_point_color: PS.COLOR_BLUE,
					ending_point_color: PS.COLOR_ORANGE
				};

				level_to_return = this.generateLevel(3, 5, new Cell(0, 4), new Cell(2, 0), level_options);

				PS.gridSize(level_to_return.width, level_to_return.height);
				PS.gridColor(level_to_return.options().background_color);
				level_to_return.addPuzzleWidget(1, 1, "BandWCell", {color: PS.COLOR_BLACK});
				level_to_return.addPuzzleWidget(1, 3, "BandWCell", {color: PS.COLOR_WHITE});

				return level_to_return;
			default:
				level_id = 1;
				level_to_return = this.generateLevel(7, 7, new Cell(0, 4), new Cell(4, 0)); // Load Level 1 by default.

				PS.gridSize(level_to_return.width, level_to_return.height);
				PS.gridColor(level_to_return.options().background_color);

				return level_to_return;
		}
	}

	options()
	{
		return this.level_options;
	}

	// This function adds a puzzle element to the grid in the specified (x, y)
	// TO DO: add hexagon dot behaviors.
	addPuzzleWidget(x, y, type, args)
	{
		switch(type)
		{
			case "hexagonDot":
				PS.glyph(x, y, 0x2B23);
				PS.glyphColor(x, y, PS.COLOR_BLACK);
				this.puzzle_widgets.hexagon_dots.push(new Cell(x, y));
				// Place a hexagon dot. Must be placed in a traversable (x, y);
				break;
			case "BandWCell":
				PS.glyph(x, y, 0x25A2);

				if(typeof args !== 'undefined')
				{
					PS.glyphColor(x, y, args.color);
					this.puzzle_widgets.blacks_and_whites.push(new Cell(x, y));
				}


				// Place a black or white block. Must be placed in a non traversable (x, y);
				break;
			default:
				// Do nothing;
		}
	}
}