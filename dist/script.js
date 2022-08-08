var edu_data = {};
var county_data;

document.addEventListener('DOMContentLoaded', function () {
  req = new XMLHttpRequest();

  req.open("GET", 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json', true);
  req.send();

  req.onload = function () {

    edu_data = JSON.parse(req.responseText);


    req.open("GET", 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json', true);
    req.send();
    req.onload = function () {
      county_data = JSON.parse(req.responseText);
      // console.log(county_data)

      var grad = [];

      for (var i = 0; i < edu_data.length; i++) {
        grad.push(edu_data[i].bachelorsOrHigher);

      };

      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1024 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      //colorscale
      /*  var myColor = d3.scaleLinear()
      .range(["#F4EDEA","#2CEAA3","06BCC1","#12263A"])
      .domain([d3.min(grad),20,50, d3.max(grad)]);//d3.max(temperature)])*/

      var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
      "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63",
      "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];

      var heatmapColour = d3.scaleLinear().
      domain(d3.range(0, 1, 1.0 / (colours.length - 1))).
      range(colours);

      // dynamic bit...
      var c = d3.scaleLinear().domain(d3.extent(grad)).range([0, 1]);




      var svg = d3.select("a").
      append("svg").
      attr("width", width + margin.left + margin.right).
      attr("height", height + margin.top + margin.bottom + 200).
      append("g").
      attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

      const path = d3.geoPath(); //the method that does the actual drawing, which you'll call later

      svg.
      selectAll("path").
      data(topojson.feature(county_data, county_data.objects.counties).features).
      enter().
      append("path").
      attr("d", path).
      attr('class', 'county').
      attr('data-fips', function (d) {
        return d.id;
      }).
      attr('data-education', function (d) {
        return edu_data.filter(e => e.fips == d.id)[0].bachelorsOrHigher;
      }).

      attr('fill', function (d) {return heatmapColour(c(
        parseFloat(edu_data.filter(e => e.fips == d.id)[0].bachelorsOrHigher)));
      });


      console.log();
      //tooltip
      //tooltip

      var tooltip = d3.select(".graph").
      append("div").
      style("position", "absolute").
      style("visibility", "hidden").
      attr("id", "tooltip");



      d3.selectAll("path").
      on("mouseover", (d, idx) => {
        // console.log(idx);
        tooltip.style("visibility", "visible");
        tooltip.html(
        edu_data.filter(a => a.fips == idx.id)[0].area_name + " " + edu_data.filter(a => a.fips == idx.id)[0].state + "<br> " + edu_data.filter(a => a.fips == idx.id)[0].bachelorsOrHigher).

        attr("data-education", edu_data.filter(a => a.fips == idx.id)[0].bachelorsOrHigher).
        style("top", event.pageY - 2 + "px").
        style("left", event.pageX + 2 + "px").
        style("opacity", 0.9).

        style("transform", "translateX(60px)");
      }).on('mouseout', (d, idx) => {
        // console.log(idx);
        tooltip.style("visibility", "hidden");});

      //legend

      const legend = svg.append("g").
      classed('legend', true).
      attr('id', 'legend').
      attr("transform", (d, i) => "translate( 0," + i * 20 + ")");

      legend.
      append('g').
      selectAll('rect').
      data(heatmapColour.range()).
      enter().
      append("rect")
      //    .attr("id", "legend")
      .attr("x", (d, i) => i * 10 + 500).
      attr("y", height + 200).
      attr("width", 15).
      attr("height", 15).
      attr("fill", d => d);


      legend.
      append('g').
      selectAll('rect').
      data(heatmapColour.range()).
      enter().
      append("text")
      //    .attr("id", "legend")
      .attr("x", (d, i) => i * 10 + 500).
      attr("y", height + 195).
      attr("font-size", "65%").
      attr("font-family", "arial").
      text((d, idx) => {
        // console.log(d);
        if (idx == 0) {
          return d3.min(c.domain());
        }

        if (idx == 16) {
          return d3.max(c.domain());
        }
      });


      //

    };


  };});