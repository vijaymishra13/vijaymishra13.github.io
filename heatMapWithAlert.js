
export function plotHeatMap() {
    createMap();
};


function createMap() {
    console.log("Creating a Heat map - 11!");
    var width = 1200,
        height = 800;

    // http://www.statcan.gc.ca/pub/92-195-x/2011001/other-autre/mapproj-projcarte/m-c-eng.htm

    var groupElement = d3.select("body").append("g")
        .attr("width", width)
        .attr("height", height);

    width = +groupElement.attr("width");
    height = +groupElement.attr("height");

    var svg = groupElement.append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.call(d3.zoom().scaleExtent([1, 2]).on('zoom', () => {
        svg.attr('transform', d3.event.transform);
    }))
    console.log("d3.json - " + d3.json);

    var canadaprov = d3.json("./canadaprovjson/canadaprov.json");

    Promise.all([
        d3.json("./canadaprovjson/canadaprovtopo.json"),
        d3.csv("./syslog-fault.csv"),
        d3.csv("./office-info.csv")
    ]).then(
        ([canada, faultCsv, officeCsv]) => {
            console.log("canadadata - " + canada);
            console.log("faultCsv - " + faultCsv);
            console.log("officeCsv - " + officeCsv);
            var projection = d3.geoConicConformal()
                .rotate([91, 0])
                .center([0, 63])
                .parallels([49, 77])
                .scale(1000)
                .translate([width / 2, height / 2])
                .precision(.1);

            var path = d3.geoPath(projection);
            var transform = topojson.transform(canada);

            svg.append("path")
                .datum(topojson.mesh(canada))
                .attr("d", path);

            svg.selectAll("circle")
                .data(canada.arcs)
                .enter().append("circle")
                .attr("transform", function (d) {
                    // console.log("d[0] - " + d[0]);
                    return "translate(" + transform(d[0]) + ")";
                })
                .attr("r", 0.25);

                var faultCount = {};
                faultCsv.forEach( d => {
                    if(faultCount[d.location])
                    {
                        faultCount[d.location] = faultCount[d.location] + 1; 
                    }
                    else{
                        faultCount[d.location] = 1;
                    }
                })


            console.log(faultCount);

            svg.selectAll("office")
                .data(officeCsv)
                .enter()
                .append("circle")
                    .attr("r", function(d) {
                        return faultCount[d.office] * 2;
                    })
                    .attr("cx", function (d) {
                        var coords = projection([d.long, d.lat]);
                        return coords[0];
                    })
                    .attr("cy", function (d) {
                        var coords = projection([d.long, d.lat]);
                        return coords[1];
                    })
                    .attr("transform", function (d) {
                        var coords = projection([d.long, d.lat]);
                        console.log("Print - " + JSON.stringify(d) + " - Coords - " + coords);
                        // return "translate(" + transform(d[0]) + ")"; 
                    })
                .append('title')
                    .text(d => d.office);

        }
    )


    //     svg.append("path")
    //         .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    //         .attr("fill", "none")
    //         .attr("stroke", "white")
    //         .attr("stroke-linejoin", "round")
    //         .attr("d", path);

    //     const legend = svg.append("g")
    //         .attr("fill", "#777")
    //         .attr("transform", "translate(915,608)")
    //         .attr("text-anchor", "middle")
    //         .style("font", "10px sans-serif")
    //       .selectAll("g")
    //         .data(radius.ticks(4).slice(1))
    //       .join("g");

    //     legend.append("circle")
    //         .attr("fill", "none")
    //         .attr("stroke", "#ccc")
    //         .attr("cy", d => -radius(d))
    //         .attr("r", radius);

    //     legend.append("text")
    //         .attr("y", d => -2 * radius(d))
    //         .attr("dy", "1.3em")
    //         .text(radius.tickFormat(4, "s"));

    //     svg.append("g")
    //         .attr("fill", "brown")
    //         .attr("fill-opacity", 0.5)
    //         .attr("stroke", "#fff")
    //         .attr("stroke-width", 0.5)
    //       .selectAll("circle")
    //       .data(data
    //           .filter(d => d.position)
    //           .sort((a, b) => d3.descending(a.value, b.value)))
    //       .join("circle")
    //         .attr("transform", d => `translate(${d.position})`)
    //         .attr("r", d => radius(d.value))
    //       .append("title")
    //         .text(d => `${d.title}
    //   ${format(d.value)}`);

    return svg.node();
};
