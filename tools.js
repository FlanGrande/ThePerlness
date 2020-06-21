function isPositionOnEdge(position)
{
	return (position[0] === 0 || position[0] === (current_level.width - 1) || position[1] === 0 || position[1] === (current_level.height - 1));
}

function detectPolygonsMadeByLine()
{
	var line_start = new Cell(line[0][0], line[0][1]);
	var line_end = new Cell(line[line.length - 1][0], line[line.length - 1][1]);
	var last_polygon_end = [line_start.x, line_start.y];
	var current_polygon = 0;
	var next_shape_so_far = [];

	//polygons_made_by_line[current_polygon] = new Polygon(shape);

	for(var line_segment in line)
	{
		next_shape_so_far.push(line[line_segment]);

		if(line_segment - 1 >= 0)
		{
			var previous_line_segment = line[line_segment - 1];
			var current_line_segment = line[line_segment];

			console.log("previous_line_segment", previous_line_segment);
			console.log("previous_line_segment on edge", isPositionOnEdge(previous_line_segment));
			console.log("current_line_segment", current_line_segment);
			console.log("current_line_segment on further edge", current_level.width);
			console.log("current_line_segment on edge", isPositionOnEdge(current_line_segment));

			if(isPositionOnEdge(previous_line_segment) && !isPositionOnEdge(current_line_segment))
			{
				last_polygon_end = current_line_segment;
			}

			if(!isPositionOnEdge(previous_line_segment) && isPositionOnEdge(current_line_segment))
			{
				console.log("next_shape_so_far", next_shape_so_far);
				console.log("POLYGON CLOSED HERE");

				var path_to_closure = calculatePath(edges_path_map, current_line_segment[0], current_line_segment[1], last_polygon_end[0], last_polygon_end[1]);
				console.log(path_to_closure);
				for(var path__to_closure_segment in path_to_closure)
				{
					next_shape_so_far.push(path_to_closure[path__to_closure_segment]);
				}
				last_polygon_end = current_line_segment;
				polygons_made_by_line[current_polygon] = new Polygon(next_shape_so_far);
				next_shape_so_far = [];
				current_polygon++;

				console.log("POLYGONS", polygons_made_by_line);
				console.log("N OF POLYGONS", current_polygon);
			}
		}
	}
}