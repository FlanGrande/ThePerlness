class Solution {
	constructor(l, lvl)
	{
		this.line = l;
		this.level = lvl;
	}

	checkWinningCondition()
	{
		// PS.debugClear();
		var won = false;

		// TO DO: Parse polygons for solution checks.

		if(this.line.length > 0)
		{
			var line_goes_from_A_to_B = this.isLineFromAToB();

			if(line_goes_from_A_to_B)
			{
				detectPolygonsMadeByLine();
			}

			var line_is_on_all_hexagon_dots = this.isLineOnAllHexagonDots();

			if(line_goes_from_A_to_B && line_is_on_all_hexagon_dots)
			{
				won = true;
				PS.audioPlayChannel(audio_channels.PuzzleSuccess);
			}
			else
			{
				won = false;
				PS.audioPlayChannel(audio_channels.PuzzleFail);
			}
		}

		// PS.debug("WIN: " + won + "\n");

		return won;
	}

	// Does line start at the starting point of the level and end at the ending point of the level?
	isLineFromAToB()
	{
		var line_start = new Cell(this.line[0][0], this.line[0][1]);
		var line_end = new Cell(this.line[this.line.length - 1][0], this.line[this.line.length - 1][1]);

		// PS.debug("LINE_START: " + line_start.x + "," + line_start.y + "\n");
		// PS.debug("LINE_END: " + line_end.x + "," + line_end.y + "\n");
		// PS.debug("START: " + starting_point.x + "," + starting_point.y + "\n");
		// PS.debug("END: " + ending_point.x + "," + ending_point.y + "\n");
			
		return line_start.x === this.level.starting_point.x && line_start.y === this.level.starting_point.y && line_end.x === this.level.ending_point.x && line_end.y === this.level.ending_point.y;
	}

	// Is the line covering all Hexagon Dots?
	isLineOnAllHexagonDots()
	{
		var is_it = true;

		if(this.level.puzzle_widgets.hexagon_dots.length > 0)
		{
			for(var hexagonDot in this.level.puzzle_widgets.hexagon_dots)
			{
				var tmp_cell = new Cell(
						this.level.puzzle_widgets.hexagon_dots[hexagonDot].x,
						this.level.puzzle_widgets.hexagon_dots[hexagonDot].y
					);
				var index = getFirstOccurrenceInArray([tmp_cell.x, tmp_cell.y], this.line);

				if(index < 0)
				{
					is_it = false;
				}
			}
		}

		return is_it;
	}

	// Are all Black and White Cells separated?
	areBlackAndWhiteCellsSeparated()
	{
		var are_they = true;

		if(this.level.puzzle_widgets.blacks_and_whites.length > 0)
		{
			for(var BandWCell in this.level.puzzle_widgets.blacks_and_whites)
			{
				var tmp_cell = new Cell(
						this.level.puzzle_widgets.blacks_and_whites[BandWCell].x,
						this.level.puzzle_widgets.blacks_and_whites[BandWCell].y
					);

				// TO DO: for all polygons, which one does this cell belong to?
				//doLineSegmentsIntersect(new Cell(-1, -1), tmp_cell, )

				//var index = getFirstOccurrenceInArray([tmp_cell.x, tmp_cell.y], this.line);

				if(index < 0)
				{
					are_they = false;
				}
			}
		}

		return are_they;
	}
}