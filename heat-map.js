

export function plotHeatMap(time_of_view) {
    if (mapSvg == undefined){
        console.log("Map is not present. Creating map for first time");
        createMap(time_of_view);
    }
    plotDataPoints(time_of_view)
};
window.plotHeatMap = plotHeatMap;
var chartScale = 1.5;
var mapSvg = undefined;
var mapGrp = undefined;
var projection = undefined;
var initial = true;

function createMap() {
    console.log("Creating a Heat map - 11!");
    var width = chart_width,
        height = 800;

    d3.select(".chart").select("svg").remove();            

    // width = +groupElement.attr("width");
    // height = +groupElement.attr("height");

    mapSvg = d3.select(".chart").append("svg")
        .attr("width", "100%")
        .attr("height", height);

    mapGrp = mapSvg.append("g");

    mapSvg.call(d3.zoom().scaleExtent([1, 3]).on('zoom', () => {
        mapGrp
        .attr('transform', d3.event.transform);
    })
    )
    console.log("d3.json - " + d3.json);
    Promise.all([
        d3.json("./canadaprovjson/canadaprovtopo.json")
    ]).then(
        ([canada]) => {
            console.log("canadadata - " + canada);

            // 1.0 - Setup the maps
            projection = d3.geoConicConformal()
                .rotate([91, 0])
                .center([0, 63])
                .parallels([49, 77])
                .scale(1000)
                .translate([width / 2, height / 2])
                .precision(.1);

            var path = d3.geoPath(projection);
            var transform = topojson.transform(canada);

            mapGrp.append("path")
                .datum(topojson.mesh(canada))
                .attr("d", path);
          //      .attr("transform", "translate(-144.437731225285,-407.0192715927378) scale(1.3122112545919633)");
        }
    )
    return mapSvg.node();
};


function plotDataPoints(time_of_view_str) {
    console.log("Creating a Heat map - 11!");
    var width = chart_width,
        height = 800;

    // var time_of_view = Date.parse("2020-07-20T09:05:00Z");    
    var time_of_view = Date.parse(time_of_view_str);  
    var time_window = 120;
    // http://www.statcan.gc.ca/pub/92-195-x/2011001/other-autre/mapproj-projcarte/m-c-eng.htm

    var linkColor = d3.scaleLinear().domain([100,0])
                .range(["green", "red"])


    d3.select(".data-points").remove();            

    // // width = +groupElement.attr("width");
    // // height = +groupElement.attr("height");

    // const svg = d3.select(".chart").append("svg")
    //     .attr("width", "100%")
    //     .attr("height", height);

    // const g = svg.append("g");

    // svg.call(d3.zoom().scaleExtent([1, 3]).on('zoom', () => {
    //     g
    //     .attr('transform', d3.event.transform);
    // })
    // )
    // console.log("d3.json - " + d3.json);

    // var canadaprov = d3.json("./canadaprovjson/canadaprov.json");
    const g = mapGrp.append("g").attr("class", "data-points");


    Promise.all([
        d3.csv("./syslog-fault.csv"),
        d3.csv("./office-info.csv"),
        d3.csv("./devices.csv"),
        d3.csv("./links.csv"),
        d3.csv("./annotations.csv"),
    ]).then(
        ([faultCsvIn, officeCsv, devicesCsvIn, linksCsvIn, annotationsCsvIn]) => {

            // Filter records for duration we are interested in
            var faultCsv = filter_by_time(faultCsvIn, time_of_view, time_window);
            var devicesCsv = filter_by_time(devicesCsvIn, time_of_view, time_window);
            var linksCsv = filter_by_time(linksCsvIn, time_of_view, time_window);
            var annotationsCsv = filter_by_time(annotationsCsvIn, time_of_view, time_window);
            // console.log("faultCsv - " + faultCsv);
            // console.log("officeCsv - " + officeCsv);
            // console.log("devices - " + devicesCsv);
            // console.log("links - " + linksCsv);

            var devices = {};
            devicesCsv.forEach(d => {
                var device = {
                    name: d.name,
                    location: d.location,
                    healthscore: d.healthscore
                }
                devices[d.name] = device;
            });

            var faultCount = {};
            faultCsv.forEach(d => {
                console.log("source - " + d.source);
                var device = devices[d.source];
                if (faultCount[device.location]) {
                    faultCount[device.location] = faultCount[device.location] + 1;
                }
                else {
                    faultCount[device.location] = 1;
                }
            });



            var offices = {};
            officeCsv.forEach(d => {
                var office = {
                    name: d.name,
                    lat: d.lat,
                    long: d.long
                }
                offices[d.name] = office;
            })

            // Add all offices on the map. If no faults, show them as green. If fauls present, show them as
            // amber with size of circle based on number of faults.
            // TODO - eventually, need to limit size of circle
            const officeLegend = g.selectAll("office")
                .data(officeCsv)
                .enter()
                .append("circle")
                .attr("r", function (d) {
                    var count = faultCount[d.name];
                    if (count || count > 0) {
                        return count * 4;
                    } else {
                        return 5;
                    }
                })
                .attr("cx", function (d) {
                    var coords = projection([d.long, d.lat]);
                    return coords[0];
                })
                .attr("cy", function (d) {
                    var coords = projection([d.long, d.lat]);
                    return coords[1];
                })
                .style("fill", function (d) {
                    var count = faultCount[d.name];
                    if (count || count > 0) {
                        return "lightcoral";
                    } else {
                        return "green";
                    }
                });

            officeLegend.append("path")
                .attr("fill", "red")
                .attr("fill-opacity", 0.3)
                .attr("stroke", "red")
                .attr("d", d => spike(100));   

            // Add constant label for offices    
            g.selectAll("text")
                .data(officeCsv)
                .enter()
                .append("text")
                .attr("x", function (d) {
                    var coords = projection([d.long, d.lat]);
                    return coords[0];
                })
                .attr("y", function (d) {
                    var coords = projection([d.long, d.lat]);
                    return coords[1] + 12;
                })
                .text( function(d) { return d.name; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "8px")
                .attr("fill", "black");

            
                
            g.selectAll("line")
                .data(linksCsv)
                .enter()
                .append("line")
                .attr("x1", function (d) {
                    var device = devices[d.device_a];
                    var office = offices[device.location];
                    var coords = projection([office.long, office.lat]);
                    return coords[0];
                })
                .attr("y1", function (d) {
                    var device = devices[d.device_a];
                    var office = offices[device.location];
                    var coords = projection([office.long, office.lat]);
                    return coords[1];
                })
                .attr("x2", function (d) {
                    var device = devices[d.device_z];
                    var office = offices[device.location];
                    var coords = projection([office.long, office.lat]);
                    return coords[0];
                })
                .attr("y2", function (d) {
                    var device = devices[d.device_z];
                    var office = offices[device.location];
                    var coords = projection([office.long, office.lat]);
                    return coords[1];
                })
                .attr("stroke-width", 2)
                .attr("stroke", function(d){
                    return linkColor(d.healthscore);
                })
                .style("stroke-dasharray", ("3, 3")) 
                .append("title")
                    .text(function(d) { return d.link_name;});  

                // Add annotations to the chart
                const annotations = g.selectAll("notes")
                    .data(annotationsCsv)
                    .enter()
                    .append("text")
                    .attr("x", function (d) {
                        var office = offices[d.source];
                        var coords = projection([office.long, office.lat]);
                        return coords[0] - 30;
                    })
                    .attr("y", function (d) {
                        var office = offices[d.source];
                        var coords = projection([office.long, office.lat]);
                        return coords[1] + 35;
                    })
                    .style("fill", "#000080")
                    .attr("font-size", "12px")
                    .text( function (d) { return d.description; });

               if(initial){
                    mapGrp.attr("transform", "translate(-144.437731225285,-407.0192715927378) scale(1.3122112545919633)");   
                    initial = false;
               }    
               
        }
    )
    return mapSvg.node();
};

function createForcedGraphOfDevices(officeCsv, office) {
    Promise.all([
        d3.csv("./devices.csv"),
        d3.csv("./links.csv")
    ]).then(
        ([devices, links]) => {
            // find all devices for selected office
            // find all links which are between devices found in this office

        }
    )
}

function spike(length, width = 7) {
    var result = `M${-width / 2},0L0,${-length}L${width / 2},0` ;
    console.log("spike output - " + result);
    return result;
};

function filter_by_time(csvRecords, time, duration){

    return csvRecords.filter(function(el){
        var obs_time = Date.parse(el.time); 
        if( obs_time <= time && obs_time > (time - (duration*1000))){
            return el;
        }
    })
}

function zoomed() {
    g
      .selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);
  }