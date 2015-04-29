var w = 900, h = 600;

var labelDistance = 0;

//this appends the SVG element to the body
var vis = d3.select('body').select("#svg-container").append("svg:svg").attr("width", w).attr("height", h);
var force = d3.layout.force();



var createMap = function(data, mode){
	console.log('create map called');
	console.log('mode: ', mode);
  //clear out the list
  console.log("div.list-items: ", d3.select('#list-container').selectAll('li'))
  d3.select('#list-container').selectAll('li').remove();
  d3.select('#list-container').select('#artist2').text('')

	var nodes = [];
	var links = [];
	//this fills the nodes array and links array with the connections for the submitted artist
	//this is what needs to be changed on update

	for (var key in data){
		d3.select('#list-container').select('#artist1').text('Artists similar to ' + key);
		var node = {
			label: key,
			id: data[key].id,
			popularity: data[key].popularity,
			weight: data[key].related.length
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
				.gravity(2)
				.linkDistance(100) //distance between nodes
				.charge(-11000)
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
    size.push(d.popularity);
  });
  var min = Math.min.apply(null, size);
  var max = Math.max.apply(null, size);
  var range = max - min; 			

	node.append("svg:circle")
			.attr("r", function(d){return 10 + ((d.popularity - min)*(range*.6))/range})
			.style("fill", "#727272")
			.style("stroke", "#FFF")
			.style("stroke-width", 3)
			
	var text = vis.selectAll('text').data(force.nodes(), function(d){return d.label});
			text.enter()
			node.append('text')
		      .attr("dy", ".25em")
		      .attr("dx", "-.5em")
		      .text(function(d) { return d.label;})
		      .style('font-family', 'arial');

  node.exit().remove();
  text.exit().remove();
  link.exit().remove();


  d3.select('#Spotty').on('click', function(){
  	mode = 'Spotty';
  });
  d3.select('#Fly').on('click', function(){
  	mode = 'Fly';
  });
  

  var drag = force.drag()
  .on("dragstart",
    function(dragNode){
      var newArtist = dragNode.label;
      d3.select('#list-container').select('#artist2').text(' & ' + newArtist);
      app.getArtist(newArtist, compareNodes);
    })
  .on('dragend', function(dragNode){
  	if (mode === 'Spotty'){
  		return
  	}else{
  		d3.select('#list-container').select('#artist2').text('');
      var newArtist = dragNode.label; 
      app.getArtist(newArtist, createMap);
  	}
  })


  node.call(drag); //makes nodes draggable

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

}

var compareNodes = function(data){
	console.log('compareNodes called');
  var currNodes = _.map(force.nodes(), function(obj){return obj.label}); 
  var newData; 
  for (var key in data){
    newData = _.map(data[key].related, function(obj){return obj.name});
  }
  var intersection = _.intersection(currNodes, newData);
  console.log('intersection: ', intersection);
  var colorNodes = _.map(force.nodes(), function(obj){
    if (_.contains(intersection, obj.label)){
      return obj;
    }
  });
  colorNodes = _.filter(colorNodes, function(obj){
    return !!obj
  });

  var selection = d3.selectAll('g.node').data(colorNodes, function(d){
    return d.label; 
  });

  selection.exit()
           .style('fill', "#000" )

  selection
    .style("fill", "#00CF00")
    .style("stroke-width", 0.25)
    .style("stroke", "#009100");

  var list = d3.select('#list-container').select('ul').selectAll('li').data(intersection, function(d){return d});
      console.log('enter selection: ', list.enter());
      list
        .enter()
        .append('li')
        .text(function(d){return d})
        .style('font-family', 'Arial');
      console.log('exit selection: ', list.exit());  
      list.exit().remove();   

}

