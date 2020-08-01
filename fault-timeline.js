
export function plotSyslog() {
    createSyslogTimeline();
};
window.plotSyslog = plotSyslog;

async function createSyslogTimeline() {

    
    const data = await d3.csv("./syslog-fault.csv");
    console.log(data);
    let axisX = d3.scaleTime().domain([new Date("2020-07-20T09:00:00Z"), new Date("2020-07-20T09:10:00Z")])
        .range([0, chart_width]);
    let axisY = d3.scaleLinear().domain([0,1])
        .range([50, 25]);


    // currently just plotting single error at one time instant
    d3.select(".timeline").append("svg")
            .attr("width", "100%")
            .attr("height", "100px")
        .append("g").attr("transform", "translate(50,0)")
        .selectAll("circle").data(data).enter()
        .append("circle")
            .attr("cx", function (d, i) { return axisX(new Date(d.time)); })
            .attr("cy", function (d, i) { return axisY(1); })
            .attr("r", function (d, i) { return 5; })
        .append("title")
            .text(function(d) { return d.source + " - " + d.description;});
      


    // let bottomAxis = d3.axisBottom(axisX).tickValues([new Date("2020-07-20T09:00:00Z"), new Date("2020-07-20T09:10:00Z")]);
    let bottomAxis = d3.axisBottom(axisX).ticks(10);
    // let leftAxis = d3.axisLeft(axisY).tickValues(["TOROONA1C01", "OTWAONA1C01"]);

    // d3.select("svg").append("g")
    //     .attr("transform", "translate(150,50)")
    //     .call(leftAxis);

    d3.select("svg").append("g")
        .attr("transform", "translate(50,50)")
        .call(bottomAxis);

};

