

var axisX = undefined;
var axisY = undefined;
window.g_explore = false

export function plotSyslog(current_time, explore) {
    window.current_time = current_time;
    g_explore = explore;
    if(axisX == undefined){
        createSyslogTimeline();
    }
    if(current_time != undefined){
        update_slider(current_time);
        plotHeatMap(current_time);
        toggleIntro(false);
    }

};
window.plotSyslog = plotSyslog;



async function createSyslogTimeline() {

    Promise.all([
        d3.csv("./syslog-fault.csv"),
        d3.csv("./changes.csv")
    ]).then(
        ([data, changesCsv]) => {
            console.log(data);
            axisX = d3.scaleTime().domain([new Date("2020-07-20T09:00:00"), new Date("2020-07-20T09:10:00")])
                .range([0, chart_width]);
            axisX.clamp(true);
        
            axisY = d3.scaleLinear().domain([0,1])
                .range([50, 25]);
        
            const svg =  d3.select(".timeline").append("svg")
                    .attr("width", "100%")
                    .attr("height", "100px");

            // currently just plotting single error at one time instant
            svg.append("g")
                .attr("transform", "translate(50,24)").append("line")
                .attr("x1", axisX.range()[0])
                .attr("x2", axisX.range()[1])
                .attr("stroke", "#C0C0C0")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("3, 3"));   

            svg.append("g").attr("transform", "translate(50,0)")
            .selectAll("circle").data(data).enter()
            .append("circle")
                .attr("cx", function (d, i) { return axisX(new Date(d.time)); })
                .attr("cy", function (d, i) { return axisY(1); })
                .attr("r", function (d, i) { return 6; })
            .append("title")
                .text(function(d) { return d.source + " - " + d.description;});
        
            svg.append("g")
                .attr("transform", "translate(5,28)").append("text")
                .text("Faults")
                .attr("font-size", "11px");  
                
            svg.append("g")
                .attr("transform", "translate(50,43)").append("line")
                .attr("x1", axisX.range()[0])
                .attr("x2", axisX.range()[1])
                .attr("stroke", "#C0C0C0")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("3, 3"));   

            d3.select("svg").append("g")
                .attr("transform", "translate(5,46)").append("text")
                .text("Changes")
                .attr("font-size", "11px");      
                

            // let bottomAxis = d3.axisBottom(axisX).tickValues([new Date("2020-07-20T09:00:00Z"), new Date("2020-07-20T09:10:00Z")]);
            let bottomAxis = d3.axisBottom(axisX).ticks(10);
            // let leftAxis = d3.axisLeft(axisY).tickValues(["TOROONA1C01", "OTWAONA1C01"]);
        
            // d3.select("svg").append("g")
            //     .attr("transform", "translate(150,50)")
            //     .call(leftAxis);

            d3.select("svg").append("g")
                .attr("transform", "translate(50,0)")
                .attr("class", "changes")
                .selectAll(".changes").data(changesCsv).enter()
                .append("rect")   
                    .attr("x", function (d, i) { return axisX(new Date(d.start_time)); })
                    .attr("y", function (d, i) { return axisY(0.5); })
                    .attr("width", function (d, i) { return  axisX(new Date(d.end_time)) - axisX(new Date(d.start_time)); })
                    .attr("height", "10")
                    .attr("rx", "2")
                    .attr("ry", "2")
                    .attr("fill", "#669900")
                    .attr("opacity", "1")
                    .attr("stroke", "black")
                    .attr("stroke-width", "1")
                .append("title")
                    .text(function(d) { return d.target + " - " + d.description;});
        
            d3.select("svg").append("g")
                .attr("transform", "translate(50,70)")
                .attr("class", "slider")
                .call(bottomAxis);
        
            var slider =  d3.select("svg").append("g")
                        .attr("transform", "translate(50,70)");    
            
            slider.append("line")
                .attr("x1", axisX.range()[0])
                .attr("x2", axisX.range()[1])
                .attr("stroke", "#C0C0C0")
                .attr("stroke-width", 10)
                .call(d3.drag()
                    .on("start.interrupt", function() { console.log("interrupt!"); slider.interrupt(); })
                    .on("start drag", function() {
                        let currentValue = d3.event.x;
                        console.log("Dragging going on = " + d3.event.x)
                        // Only in explore mode - update slider
                        if(g_explore){
                            update_slider(axisX.invert(currentValue)); 
                        }
  
                      }));


        
        });
    // const data = await d3.csv("./syslog-fault.csv");
  
    // d3.select(".slider") 
    // .call(d3.drag()
    // .on("start", function() {console.log("started drag!")})
    // .on("start.interrupt", function() {  console.log("drag interrupt being called.") ;  })
    // .on("start drag", function() {
    //   let currentValue = d3.event.x;
    //   console.log("Dragging going on = " + d3.event.x)
    //   update_slider(axisX.invert(currentValue)); 
    // }));  
};

function update_slider(slider_time){

    d3.select(".time_slider").remove();

    // Only in explore - provide slider. In non-explore mode, provide a pointer
    if(g_explore){
        d3.select("svg").append("g")
            .attr("transform", "translate(50,20)")
            .selectAll(".time_slider").data([slider_time])
            .enter()
            .append("rect")   
            .attr("class", "time_slider time_slider_explore")
            .attr("x", function (d, i) { return (axisX(new Date(d)) - 14); })
            .attr("y", function (d, i) { return (axisY(0) - 7); })
            .attr("width", "30")
            .attr("height", "14")
            .attr("rx", "4")
            .attr("ry", "4")
            .attr("fill", "#E8E8E8")
            .attr("opacity", "1")
            .attr("stroke", "black")
            .attr("stroke-width", "1")
        .append("title")
            .text(function(d) { return d;});
    }else{
        d3.select("svg").append("g")
            .attr("transform", "translate(50,20)")
            .selectAll(".time_slider").data([slider_time])
            .enter()
            .append("rect")   
            .attr("class", "time_slider")
            .attr("x", function (d, i) { return (axisX(new Date(d)) - 14); })
            .attr("y", function (d, i) { return (axisY(0) - 7); })
            .attr("width", "14")
            .attr("height", "14")
            .attr("rx", "4")
            .attr("ry", "4")
            .attr("fill", "#E8E8E8")
            .attr("opacity", "1")
            .attr("stroke", "black")
            .attr("stroke-width", "1")
        .append("title")
            .text(function(d) { return d;});
    }
 
    plotHeatMap(slider_time);    

}
window.update_slider = update_slider;
