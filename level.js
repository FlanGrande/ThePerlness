class Level {
	constructor(w, h, sp, ep, options)
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
			}
		}

		console.log(this);
	}

	options()
	{
		return this.level_options;
	}

	// This function adds a puzzle element to the grid in the specified (x, y)
	// TO DO: add mandatory dot behaviors.
	addPuzzleWidget(x, y, type)
	{
		switch(type)
		{
			case "mandatoryDot":
				// Place a mandatory dot. Must be placed in a traversable (x, y);
				break;
			case "BandW":
				// Place a black or white block. Must be placed in a non traversable (x, y);
				break;
			default:
				// Do nothing;
		}
	}
}