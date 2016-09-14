
var data = [];

//define row information
function row(d) {
  return {
    year: +d.year, // convert "Year" column to number
    gender: d.gender,
    winner_ace: +d.winner_ace,
    winner: d.winner,
    winner_country: d.winner_country
  };
}

//load csv file
d3.csv("USOpenFinals_2016.csv", row, function(error, csv_data){
    csv_data.forEach(function (d) {
        data.push({ winner_country: d.winner_country, year: d.year, gender: d.gender, winner_ace: d.winner_ace, winner: d.winner });
    });
    console.log(data);

       var margin = {top: 20, right: 30, bottom: 30, left: 40},
       width = 700 - margin.left - margin.right,
       height = 400 - margin.top - margin.bottom;

    var scale = d3.scale.linear()
                    .domain([0, d3.max(csv_data, function(d) { return d.winner_ace; })])
                    .range([0, height - 50]);

    var scale_year = d3.scale.linear()
                    .domain([2006, 2015])
                    .range([30, width - 120]);

    var xAxisScale = d3.scale.linear()
                    .domain([2006, 2015])
                    .range([50, width - 95]);

    var xAxis = d3.svg.axis()
       .scale(xAxisScale)
       .orient("bottom");

    var yLabels = d3.scale.linear()
    .domain([0, d3.max(csv_data, function(d) { return d.winner_ace; })])
    .range([height - 40, 0]);

    var yAxis = d3.svg.axis()
    .scale(yLabels)
    .orient("left");

    var data_svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data_svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(20," + (height+10) + ")")
    .call(xAxis);

     data_svg.append("g")
     .attr("transform", "translate(20,40)")
     .attr("class", "axis")
     .call(yAxis)
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .text("Winner - Ace");


    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .filter(function(d) { return d.gender =="w"; });

    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return 50 + scale_year(d.year);
        })
        .attr("cy", function(d) {
            return 350 - scale(d.winner_ace);
        })
        .attr("r", 20)
        .style("fill", "#ff0000")
        .on("click", function(){
            if(this.style.fill == "rgb(255, 0, 0)"){
                d3.select(this).style("fill","#00ff00");
            } else{
                d3.select(this).style("fill","#ff0000");
            }
        })
        .on("mouseenter", function(d,i){
            d3.select(this.parentNode).select("text").text(d.winner_country);
        })
        .on("mouseleave", function(d,i){
            d3.select(this.parentNode).select("text").text(d.winner);
        });

    var data_text = data_g.append("text")
        .text(function(d){return d.winner;})
        .attr("x", function(d) {
            return 50 + scale_year(d.year);
        })
        .attr("y", function(d) {
            return 350 - scale(d.winner_ace);
        });
    
});



