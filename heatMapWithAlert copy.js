
export function plotHeatMap() {
    createMap();
};

async function createMap() {
    console.log("Creating a Heat map - 9!");
    var width = 900,
        height = 500;

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    // http://www.statcan.gc.ca/pub/92-195-x/2011001/other-autre/mapproj-projcarte/m-c-eng.htm
    var projection = d3.geoConicConformal()
        .rotate([91, 0])
        .center([0, 63])
        .parallels([49, 77])
        .scale(650)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geoPath(projection);


    console.log("d3.json - " + d3.json);

    var canadaprov = d3.json("./canadaprovjson/canadaprov.json");

    d3.json("./canadaprovjson/canadaprovtopo.json").then(
        function (canada) {
            console.log("Inside other d3.json - " + JSON.stringify(canada));
            var path = d3.geoPath(),
            mesh = topojson.mesh(canada);

            var transform = canada.transform,
            scalex = transform.scale[0],
            scaley = transform.scale[1],
            transx = transform.translate[0],
            transy = transform.translate[1];

        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 0.25)
            .attr("stroke-linejoin", "round")
            .attr("d", path(mesh));

        svg.selectAll("circle")
            .data(canada.arcs)
            .enter().append("circle")
            .attr("transform", function(d) {
                    return "translate(" + projection([d[0][0] * scalex + transx, d[0][1] * scaley + transy]) + ")"; })
            .attr("r", 1.25);




   

        // svg.append("path")
        //     .datum(topojson.mesh(canada))
        //     .attr("d", path);

        // svg.selectAll("circle")
        //     .data(canada.arcs)
        //     .enter().append("circle")
        //     .attr("transform", function(d) {
        //         return "translate(" + projection([d[0][0] * scalex + transx, d[0][1] * scaley + transy]) + ")"; })
        //     .attr("r", 1.5);
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
}
