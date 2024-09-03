function init(){
    //reading the data from csv file
    d3.csv("2019 pets.csv").then(function(data){
        console.log(data);
        pets19 = data;

        barChart(pets19);
    })
    
    var w = 500;
    var h = 150;
    var barPadding = 3;

    //D3 block
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

    function barChart(pets19)
    {
        svg.selectAll("rect")
        .data(pets19)
        .enter()
        .append("rect")
        //x coordinate and y coordinate
        .attr("x",function(d,i){
            return i * (w/pets19.length);
        })
        .attr("y",function(d){
            return h - (d.Quantity*4)
        })
        //width and height of the bar chart
        .attr("width",function(d){
            return (w/pets19.length-barPadding);
        })
        .attr("height",function(d){
            return d.Quantity*4;
        })
        //colour of the bar changes depending on the value of the data
        .attr("fill", function(d) {
                return "rgb(135,206, " + (d.Quantity * 8) + ")";
        });

        svg.selectAll("text")
        .data(pets19)
        .enter()
        .append("text")
        .text(function(d) {
            return d.Quantity;
        })
        .attr("fill","black")
        .attr("x", function(d, i) {
            return i * (w / pets19.length) +10.5;
        })
        .attr("y",function(d){
            return h - (d.Quantity *4)
        })
    }
}
window.onload = init;
