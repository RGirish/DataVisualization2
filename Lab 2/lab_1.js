//Visualization elements in D3 has to be inside svg element
var my_svg = d3.select("#my_div").append('svg')
    .attr('width', 600)
    .attr('height', 600);

//a g element is an unit of visualization
var my_g = my_svg.append('g');

//draw a rectangle in g
var my_rect = my_g.append('rect')
    .attr('width', 400)
    .attr('height', 300)
    .attr('fill', "#ff0000");

//draw a circle
var my_circle = my_g.append('circle')
    .attr('cx', 500)
    .attr('cy', 150)
    .attr('r', 150)
    .attr('fill', "#00ff00")
    //set click event: change stroke color
    .on('click',function(d){
        var status = d3.select(this).style("stroke");
        if(status == "rgb(0, 0, 255)"){
            d3.select(this).attr("stroke", "#ff0000");
        }
        else
            d3.select(this).attr("stroke", "#0000ff");

    })

//append text in g
my_g.append("text")
    .attr("fill", "#000000")
    .attr("dy", ".3em")
    .text("this is text")
    .attr("transform", "translate(" + 100 + "," + 50 + ")");


//draw x axis and y axis
var xAxisScale = d3.scale.linear()
        .range([0, 200])
        .domain([0, 1]),
    formatPercent = d3.format(".0%"),
    xAxis = d3.svg.axis()
        .orient('bottom')
        .ticks(5)
        .tickFormat(formatPercent)
        .scale(xAxisScale),
    yAxisScale = d3.scale.linear()
        .range([0, 100])
        .domain([0, 24]),
    yAxis = d3.svg.axis()
        .orient('left')
        .ticks(5)
        .tickFormat(d3.format('02d'))
        .scale(yAxisScale);

my_svg.append('g')
          .attr('transform', 'translate(' + 100 + ',' + 400 + ')')
          .attr('class', 'y axis')
          .call(yAxis)
my_svg.append('g')
          .attr('transform', 'translate(' + 100 + ',' + 500 + ')')
          .attr('class', 'x axis')
          .call(xAxis)


