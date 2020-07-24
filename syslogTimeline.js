
export function plotSyslog() {
    createSyslogTimeline();
};

async function createSyslogTimeline() {

    const data = await d3.csv("./syslog-fault.csv");
    console.log(data);
    let axisX = d3.scaleTime().domain([new Date("2020-07-20T09:00:00Z"), new Date("2020-07-20T09:10:00Z")])
        .range([0, 200]);
    let axisY = d3.scalePoint().domain(["TOROONA1C01", "OTWAONA1C01"])
        .range([50, 150]);

    d3.select("svg").append("g").attr("transform", "translate(150,50)")
        .selectAll("circle").data(data).enter()
        .append("circle")
        .attr("cx", function (d, i) { return axisX(new Date(d.TIME)); })
        .attr("cy", function (d, i) { return axisY(d.Source); })
        .attr("r", function (d, i) { return 5; });


    let bottomAxis = d3.axisBottom(axisX).tickValues([new Date("2020-07-20T09:00:00Z"), new Date("2020-07-20T09:10:00Z")]);


    let leftAxis = d3.axisLeft(axisY).tickValues(["TOROONA1C01", "OTWAONA1C01"]);

    d3.select("svg").append("g")
        .attr("transform", "translate(150,50)")
        .call(leftAxis);

    d3.select("svg").append("g")
        .attr("transform", "translate(150,250)")
        .call(bottomAxis);

};

