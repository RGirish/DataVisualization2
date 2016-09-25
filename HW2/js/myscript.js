var names = [],
    nodes = [],
    links = [],
    matrixData = {};
d3.csv("data/data.csv", function(data) {
    /* Get the list of all names */
    data.map(function(d) {
        if (names.indexOf(d.player1) === -1) {
            names.push(d.player1);
        }
        if (names.indexOf(d.player2) === -1) {
            names.push(d.player2);
        }
    });
    names.sort();

    /* Create the Nodes and Links, imagining the data to be a graph of sorts */
    /* The Nodes */
    for (var i = 0; i < names.length; i++) {
        var node = {};
        node["name"] = names[i];
        node["group"] = "2";
        nodes.push(node);
    }

    /* The Links */
    data.map(function(d) {
        var player1 = d.player1,
            player2 = d.player2;
        var player1Index = names.indexOf(player1);
        var player2Index = names.indexOf(player2);
        var link = {};
        link["source"] = player1Index;
        link["target"] = player2Index;
        link["value"] = 1;
        links.push(link);
    });

    /* Combining the Nodes and Links together to pass on as the data to D3 to construct the Matrix Diagram. */
    matrixData["nodes"] = nodes;
    matrixData["links"] = links;



    /*********************/

    /* Set up the Modal Dialog Box */
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    /* Construct the Matrix diagram */
    var margin = {
            top: 140,
            right: 650,
            bottom: 200,
            left: 140
        },
        width = 3600,
        height = 3600;

    var x = d3.scale.ordinal().rangeBands([0, width]),
        z = d3.scale.linear().domain([0, 4]).clamp(true),
        c = d3.scale.category10().domain(d3.range(10));

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", -margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var matrix = [],
        n = nodes.length;

    nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) {
            return {
                x: j,
                y: i,
                z: 0
            };
        });
    });

    links.forEach(function(link) {
        matrix[link.source][link.target].z += link.value;
        nodes[link.source].count += link.value;
        nodes[link.target].count += link.value;
    });

    // Precompute the orders.
    var orders = {
        name: d3.range(n).sort(function(a, b) {
            return d3.ascending(nodes[a].name, nodes[b].name);
        }),
        count: d3.range(n).sort(function(a, b) {
            return nodes[b].count - nodes[a].count;
        })
    };

    // The default sort order.
    x.domain(orders.count);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);

    var row = svg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) {
            return "translate(0," + x(i) + ")";
        })
        .each(row);

    row.append("line")
        .attr("x2", width);

    row.append("text")
        .attr("x", -6)
        .attr("y", x.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) {
            return nodes[i].name;
        });

    var column = svg.selectAll(".column")
        .data(matrix)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) {
            return "translate(" + x(i) + ")rotate(-90)";
        });

    column.append("line")
        .attr("x1", -width);

    column.append("text")
        .attr("x", 6)
        .attr("y", x.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) {
            return nodes[i].name;
        });

    function row(row) {
        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function(d) {
                return d.z;
            }))
            .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d) {
                return x(d.x);
            })
            .attr("width", x.rangeBand())
            .attr("height", x.rangeBand())
            .style("fill-opacity", function(d) {
                return z(d.z);
            })
            .style("fill", function(d) {
                return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null;
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("click", click);
    }

    /* The div that shows when you hover on a cell in the Matrix */
    var tooltip = d3.select("body")
        .append("div")
        .style("background", "#fff")
        .style("border", "2px black")
        .style("padding", "20px")
        .style("position", "absolute")
        .style("display", "table")
        .style("box-shadow", "0px 3px 2px #ccc")
        .style("z-index", "10")
        .style("visibility", "hidden");

    /* Set the mouse over, move and out interactions to display / hide the tooltip */
    function mouseover(p) {
        tooltip.style("visibility", "visible");
        tooltip.html(names[p.y] + " vs " + names[p.x] + " - Total Meetings: " + (matrix[p.x][p.y].z + matrix[p.y][p.x].z) + ". <br/>" + names[p.y] + " has won " + p.z + " of them.");
        d3.selectAll(".row text").classed("active", function(d, i) {
            return i == p.y;
        });
        d3.selectAll(".column text").classed("active", function(d, i) {
            return i == p.x;
        });
    }

    function mousemove() {
        tooltip.style("top", (event.pageY) + "px").style("left", (event.pageX) + "px");
    }

    function mouseout() {
        tooltip.style("visibility", "hidden");
        d3.selectAll("text").classed("active", false);
    }

    /* Set the mouse click interaction to display the Modal Dialog Box */
    function click(p) {
        tooltip.style("visibility", "hidden");
        d3.selectAll("text").classed("active", false);
        modal.style.display = "block";
        var winner = document.getElementsByName("winner");
        var loser = document.getElementsByName("loser");
        var winner_times = document.getElementsByName("winner_times");
        var total_times = document.getElementsByName("total_times");
        for (var i = 0; i < winner.length; i++) {
            winner[i].innerHTML = names[p.y];
        }
        loser[0].innerHTML = names[p.x];
        winner_times[0].innerHTML = matrix[p.y][p.x].z;
        total_times[0].innerHTML = matrix[p.y][p.x].z + matrix[p.x][p.y].z;

        d3.csv("data/data.csv", function(data) {
            data = data.filter(function(d) {
                return (d.player1 == names[p.y] && d.player2 == names[p.x]);
            });
            console.log(JSON.stringify(data));
            var encounters = document.getElementById("encounters");
            var years = [];
            if (data.length > 1) {
                data.map(function(d) {
                    years.push("<a href=\"#yo\" style=\"color:black;font-size:1.5em\">" + d.year + "</a>");
                });
            } else {
                years.push("<font style=\"color:black;font-size:1.5em\">" + data[0].year + "</font>");
            }
            encounters.innerHTML = years.sort();
            var total_f_1 = 0,
                total_f_2 = 0,
                total_s_1 = 0,
                total_s_2 = 0;
            data.map(function(d) {
                total_f_1 += +(d.firstPointWon1.substring(0, 2));
                total_f_2 += +(d.firstPointWon2.substring(0, 2));
                total_s_1 += +(d.secPointWon1.substring(0, 2));
                total_s_2 += +(d.secPointWon2.substring(0, 2));
            });
            var values1 = [(total_f_1 / data.length).toFixed(2), (total_s_1 / data.length).toFixed(2)];
            var values2 = [(total_f_2 / data.length).toFixed(2), (total_s_2 / data.length).toFixed(2)];
            drawBarChart(names[p.y], names[p.x], values1, values2);
        });
    }

    /* Draws the firstPointWon vs secPointWon grouped bar chart within the Modal Dialog Box */
    function drawBarChart(name1, name2, values1, values2) {
        var data = {};
        var labels = ["First Point won", "Second Point Won"];
        data["labels"] = labels;
        var series = [];
        var winnerData = {};
        winnerData["label"] = name1;
        var loserData = {};
        loserData["label"] = name2;
        winnerData["values"] = values1;
        loserData["values"] = values2;
        series.push(winnerData);
        series.push(loserData);
        data["series"] = series;

        var chartWidth = 300,
            barHeight = 20,
            groupHeight = barHeight * data.series.length,
            gapBetweenGroups = 10,
            spaceForLabels = 150,
            spaceForLegend = 150;

        // Zip the series data together (first values, second values, etc.)
        var zippedData = [];
        for (var i = 0; i < data.labels.length; i++) {
            for (var j = 0; j < data.series.length; j++) {
                zippedData.push(data.series[j].values[i]);
            }
        }

        // Color scale
        var color = d3.scale.category10();
        var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

        var x = d3.scale.linear()
            .domain([0, d3.max(zippedData)])
            .range([0, chartWidth]);

        var y = d3.scale.linear()
            .range([chartHeight + gapBetweenGroups, 0]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickFormat('')
            .tickSize(0)
            .orient("left");

        // Remove all elements inside the chart, to redraw it. 
        d3.select(".chart").selectAll("*").remove();

        // Specify the chart area and dimensions
        var chart = d3.select(".chart")
            .attr("width", spaceForLabels + chartWidth + spaceForLegend)
            .attr("height", chartHeight);

        // Create bars
        var bar = chart.selectAll("g")
            .data(zippedData)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
            });

        // Create rectangles of the correct width
        bar.append("rect")
            .attr("fill", function(d, i) {
                return color(i % data.series.length);
            })
            .attr("class", "bar")
            .attr("width", x)
            .attr("height", barHeight - 1);

        // Add text label in bar
        bar.append("text")
            .attr("x", function(d) {
                return x(d) - 3;
            })
            .attr("y", barHeight / 2)
            .attr("fill", "red")
            .attr("dy", ".35em")
            .text(function(d) {
                return d;
            });

        // Draw labels
        bar.append("text")
            .attr("class", "label")
            .attr("x", function(d) {
                return -10;
            })
            .attr("y", groupHeight / 2)
            .attr("dy", ".35em")
            .text(function(d, i) {
                if (i % data.series.length === 0)
                    return data.labels[Math.floor(i / data.series.length)];
                else
                    return ""
            });

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
            .call(yAxis);

        // Draw legend
        var legendRectSize = 18,
            legendSpacing = 4;

        var legend = chart.selectAll('.legend')
            .data(data.series)
            .enter()
            .append('g')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = -gapBetweenGroups / 2;
                var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', function(d, i) {
                return color(i);
            })
            .style('stroke', function(d, i) {
                return color(i);
            });

        legend.append('text')
            .attr('class', 'legend')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                return d.label;
            });
    }

    /* Move the rows and columns according to the order selected in the dropdown list. */
    d3.select("#order").on("change", function() {
        order(this.value);
    });

    function order(value) {
        x.domain(orders[value]);
        var t = svg.transition().duration(1000);

        t.selectAll(".row")
            .delay(function(d, i) {
                return x(i) * 4;
            })
            .attr("transform", function(d, i) {
                return "translate(0," + x(i) + ")";
            })
            .selectAll(".cell")
            .delay(function(d) {
                return x(d.x) * 4;
            })
            .attr("x", function(d) {
                return x(d.x);
            });

        t.selectAll(".column")
            .delay(function(d, i) {
                return x(i) * 4;
            })
            .attr("transform", function(d, i) {
                return "translate(" + x(i) + ")rotate(-90)";
            });
    }
});