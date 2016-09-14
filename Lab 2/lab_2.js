
var data = [];

//define row information
function row(d) {
  return {
    year: +d.year, // convert "Year" column to number
    gender: d.gender,
    winner_ace: +d.winner_ace,
    winner: d.winner,
  };
}

//load csv file
d3.csv("USOpenFinals_2016.csv", row, function(error, csv_data){
    csv_data.forEach(function (d) {
        data.push({ year: d.year, gender: d.gender, winner_ace: d.winner_ace, winner: d.winner });
    });

    var scale = d3.scale.linear()
                    .domain([0, 20])
                    .range([0, 350]);
    var scale_year = d3.scale.linear()
                    .domain([2006, 2016])
                    .range([0, 550]);
    var data_svg = d3.select("body")
    .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .filter(function(d) { return d.gender =="m"; });
    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return 50 + scale_year(d.year);
        })
        .attr("cy", function(d) {
            return 350 - scale(d.winner_ace);
        })
        .attr("r", 20)
        .attr("fill", "#ff0000");
    var data_text = data_g.append("text")
        .text(function(d){return d.winner;})
        .attr("x", function(d) {
            return 50 + scale_year(d.year);
        })
        .attr("y", function(d) {
            return 350 - scale(d.winner_ace);
        });
    
});



