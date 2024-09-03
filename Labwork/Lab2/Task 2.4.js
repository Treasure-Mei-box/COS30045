function init(){
    //reading the data from csv file
    d3.csv("Task 2.4data.csv").then(function(data){
        console.log(data);
        wombatSightings = data;

        barChart(wombatSightings);
    })
    
    var w = 500;
    var h = 150;
    var barPadding = 4;

    document.addEventListener("DOMContentLoaded", function() {
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", 500)
            .attr("height", 500);
            
    });
    //D3 block
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

    

    function barChart(wombatSightings)
    {
        svg.selectAll("rect")
        .data(wombatSightings)
        .enter()
        .append("rect")
        //x coordinate and y coordinate
        .attr("x",function(d,i){
            return i * (w/wombatSightings.length);
        })
        .attr("y",function(d){
            return h - (d.wombats*4)
        })
        //width and height of the bar chart
        .attr("width",function(d){
            return (w/wombatSightings.length-barPadding);
        })
        .attr("height",function(d){
            return d.wombats*4;
        })
        //colour of the bar changes depending on the value of the data
        .attr("fill", function(d) {
                return "rgb(135,206, " + (d.wombats * 8) + ")";
        });

        svg.selectAll("text")
        .data(wombatSightings)
        .enter()
        .append("text")
        .text(function(d) {
            return d.wombats;
        })
        .attr("fill","black")
        .attr("x", function(d, i) {
            return i * (w / wombatSightings.length) +10.5;
        })
        .attr("y",function(d){
            return h - (d.wombats *4.5)
        })
    }
}
window.onload = init;
