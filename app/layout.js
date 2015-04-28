var w = 960, h = 500;

var labelDistance = 0;

//this appends the SVG element to the body
var vis = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);
var force = d3.layout.force();


var createMap = function(data){
	console.log('create map called');

	var nodes = [];
	console.log('nodes ', nodes);
	var links = [];
	console.log('links', links);
	console.log('data ', data);
	//this fills the nodes array and links array with the connections for the submitted artist
	//this is what needs to be changed on update

	for (var key in data){
		var node = {
			label: key,
			id: data[key].id,
			popularity: data[key].popularity,
			weight: 20
		}
		nodes.push(node);

		data[key].related.forEach(function(artist){
			var node = {
				label: artist.name,
				id: artist.id,
				popularity: artist.popularity,
				weight: 1
			}
			nodes.push(node);
		})
	}


	for(var i = 0; i < nodes.length; i++) {
		links.push({
			source : nodes[0],
			target : nodes[i],
			weight : Math.random()
		});
	};



	//this code instantiates the force layout with nodes and links as defined above 
	//he general pattern for constructing force-directed layouts is to set all the 
	//configuration properties, and then call start:
		force
				.size([w, h])
				.nodes(nodes)
				.links(links)
				.gravity(1)
				.linkDistance(150) //distance between nodes
				.charge(-8000)
				.linkStrength(function(x) {
						return x.weight * 10
				});

	// force.start() starts the simulation; this method must be called when the layout is first created, 
	//after assigning the nodes and links. 
	//In addition, it should be called again whenever the nodes or links change.
	force.start();

	var link = vis.selectAll("line.link").data(links)
			link
				.enter()
				.append("svg:line")
				.attr("class", "link")
				.style("stroke", "#CCC");


//puts the nodes in a g element and gives the nodes class of node
	var node = vis.selectAll("g.node").data(force.nodes(), function(d){return d.label});
			node
				.enter()
				.append("svg:g")
				.attr("class", "node");



	var size = [];
	force.nodes().forEach(function(d){
    console.log('pop ', d.popularity);
    size.push(d.popularity);
  });
  console.log('size ', size);
  var min = Math.min.apply(null, size);
  var max = Math.max.apply(null, size);
  console.log('min ', min, 'max ', max);
  var range = max - min; 			

	node.append("svg:circle")
			.attr("r", function(d){return 10 + ((d.popularity - min)*(range*.6))/range})
			.style("fill", "#555")
			.style("stroke", "#FFF")
			.style("stroke-width", 3)
			
	var text = vis.selectAll('text').data(force.nodes(), function(d){return d.label});
			text.enter()
			node.append('text')
		      .attr("dy", ".5em")
		      .text(function(d) { return d.label;})
		      .style('font-family', 'arial');

	console.log('text', text);
  node.exit().remove();
  text.exit().remove();
	link.exit().remove();
	
	// node.call(force.drag); //makes nodes draggable

	var updateLink = function() {
		this.attr("x1", function(d) {
			return d.source.x;
		}).attr("y1", function(d) {
			return d.source.y;
		}).attr("x2", function(d) {
			return d.target.x;
		}).attr("y2", function(d) {
			return d.target.y;
		});

	}

	force.on("tick", function() {
		var updateNode = d3.transition(node)
				.attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"; });
		link.call(updateLink);
	});


	node.on('click', function(clickedNode){
		console.log(clickedNode.label);
		var newArtist = clickedNode.label; 
		app.getArtist(newArtist);
	});
}

// var updateLayout = function ()