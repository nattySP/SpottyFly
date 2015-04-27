var w = 1000, h = 1000;

var labelDistance = 0;

//this appends the SVG element to the body
var vis = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);
var createMap = function(data){
	console.log(data);

	var nodes = [];
	var labelAnchors = [];
	var labelAnchorLinks = [];
	var links = [];
	
	for (var key in data){
		var node = {
			label: key,
			id: data[key].id,
			popularity: data[key].popularity,
			weight: 20
		}
		nodes.push(node);
		labelAnchors.push({
			node : node
		}); 
		labelAnchors.push({
			node : node
		});
		data[key].related.forEach(function(artist){
			var node = {
				label: artist.name,
				id: artist.id,
				popularity: artist.popularity,
				weight: 1
			}
			nodes.push(node);
			labelAnchors.push({
				node : node
			}); 
			labelAnchors.push({
				node : node
			});
		})
	}


	for(var i = 0; i < nodes.length; i++) {
		links.push({
			source : nodes[0],
			target : nodes[i],
			weight : Math.random()
		});
		labelAnchorLinks.push({
			source : i * 2,
			target : i * 2 + 1,
			weight : 1
		});
	};



	//this code instantiates the force layout with nodes and links as defined above 
	//he general pattern for constructing force-directed layouts is to set all the 
	//configuration properties, and then call start:
	var force = d3.layout.force()
							.size([w, h])
							.nodes(nodes)
							.links(links)
							.gravity(1)
							.linkDistance(150) //distance between nodes
							.charge(-5000)
							.linkStrength(function(x) {
									return x.weight * 10
							});

	// force.start() starts the simulation; this method must be called when the layout is first created, 
	//after assigning the nodes and links. 
	//In addition, it should be called again whenever the nodes or links change.
	force.start();

	// this generates a second force layout for the labels
	var force2 = d3.layout.force()
							.nodes(labelAnchors)
							.links(labelAnchorLinks)
							.gravity(0)
							.linkDistance(50) // puts the labels right on the node
							.linkStrength(8)
							.charge(-100)
							.size([w, h]);

	force2.start();

	var link = vis.selectAll("line.link").data(links)
								.enter()
								.append("svg:line")
								.attr("class", "link")
								.style("stroke", "#CCC");

//puts the nodes in a g element and gives the nodes class of node
	var node = vis.selectAll("g.node").data(force.nodes())
								.enter()
								.append("svg:g")
								.attr("class", "node");

	node.append("svg:circle")
			.attr("r", function(d){return 10 + ((d.popularity - 75)*49)/40})
			.style("fill", "#555")
			.style("stroke", "#FFF")
			.style("stroke-width", 3);
	
	node.call(force.drag); //makes nodes draggable


	var anchorLink = vis.selectAll("line.anchorLink")
											.data(labelAnchorLinks)
											.enter()
											.append("svg:line")
											.attr("class", "anchorLink")
											.style("stroke", "#999");

	var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes())
											.enter()
											.append("svg:g")
											.attr("class", "anchorNode");

	anchorNode.append("svg:circle")
						.attr("r", 0)
						.style("fill", "#FFF");
	
	anchorNode.append("svg:text").text(function(d, i) {
		return i % 2 == 0 ? "" : d.node.label
		return d.node.label
	}).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

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

	var updateNode = function() {
		this.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	}


	force.on("tick", function() {

		force2.start();

		node.call(updateNode);

	//commenting out this code gets rid of the node labels 
		anchorNode.each(function(d, i) {
			if(i % 2 == 0) {
				d.x = d.node.x;
				d.y = d.node.y;
			} else {
				var b = this.childNodes[1].getBBox();

				var diffX = d.x - d.node.x;
				var diffY = d.y - d.node.y;

				var dist = Math.sqrt(diffX * diffX + diffY * diffY);

				var shiftX = b.width * (diffX - dist) / (dist * 2);
				shiftX = Math.max(-b.width, Math.min(0, shiftX));
				var shiftY = 5;
				this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
			}
		});


		anchorNode.call(updateNode);
		link.call(updateLink);
		anchorLink.call(updateLink);

	});
}