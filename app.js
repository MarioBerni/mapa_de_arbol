document.addEventListener("DOMContentLoaded", function () {

  const defaultUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

  function loadTreeMap(url) {
      d3.json(url).then((data) => {
          d3.select("#tree-map svg").remove();
          d3.select("#legend svg").remove();

          const containerWidth = document.getElementById("container").offsetWidth;
          const svgWidth = containerWidth < 600 ? containerWidth : Math.min(containerWidth, 960);
          const svgHeight = (svgWidth / 960) * 570;
          const fontSize = Math.max(8, svgWidth / 120);

          const svg = d3.select("#tree-map")
              .append("svg")
              .attr("width", svgWidth)
              .attr("height", svgHeight);

          const root = d3.hierarchy(data)
              .sum((d) => d.value)
              .sort((a, b) => b.height - a.height || b.value - a.value);

          d3.treemap().size([svgWidth, svgHeight]).paddingInner(1)(root);

          const color = d3.scaleOrdinal(d3.schemeCategory10);

          const tile = svg.selectAll("g")
              .data(root.leaves())
              .enter()
              .append("g")
              .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

          const tooltip = d3.select("#tooltip");

          tile.append("rect")
              .attr("class", "tile")
              .attr("width", (d) => d.x1 - d.x0)
              .attr("height", (d) => d.y1 - d.y0)
              .attr("fill", (d) => color(d.data.category))
              .attr("data-name", (d) => d.data.name)
              .attr("data-category", (d) => d.data.category)
              .attr("data-value", (d) => d.data.value)
              .on("mousemove", function (event, d) {
                  tooltip.style("opacity", 1);
                  tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`);
                  tooltip.attr("data-value", d.data.value);
                  tooltip.style("top", event.pageY - 30 + "px");
                  tooltip.style("left", event.pageX + 10 + "px");
              })
              .on("mouseout", () => {
                  tooltip.style("opacity", 0);
              });

          tile.append("text")
              .attr("pointer-events", "none")
              .style("font-size", fontSize + "px")
              .selectAll("tspan")
              .data((d) => {
                  const words = d.data.name.split(" ");
                  const width = d.x1 - d.x0;
                  let line = [];
                  let lines = [line];
                  words.forEach((word) => {
                      if (line.join(" ").length + word.length < width / 5) {
                          line.push(word);
                      } else {
                          line = [word];
                          lines.push(line);
                      }
                  });
                  return lines.map(line => line.join(" "));
              })
              .enter()
              .append("tspan")
              .attr("x", 5)
              .attr("y", (d, i) => 15 + i * 12)
              .text((d) => d);

          const categories = root.leaves().map((d) => d.data.category);
          const uniqueCategories = [...new Set(categories)];

          const legend = d3.select("#legend")
          .append("svg")
          .attr("width", 400)
          .attr("height", 200);
      
      const legendItem = legend.selectAll("g")
          .data(uniqueCategories)
          .enter()
          .append("g")
          .attr("transform", (d, i) => `translate(${i % 3 * 160}, ${Math.floor(i / 3) * 30})`);
      
      legendItem.append("rect")
          .attr("class", "legend-item")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", (d) => color(d))
          .on("mousemove", function (event, d) {
              const games = root.leaves().filter(leaf => leaf.data.category === d).map(leaf => leaf.data.name).join(", ");
              tooltip.style("opacity", 1);
              tooltip.html(`Games: ${games}`);
              tooltip.style("top", event.pageY - 30 + "px");
              tooltip.style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", () => {
              tooltip.style("opacity", 0);
          });
      
      legendItem.append("text")
          .attr("x", 25)
          .attr("y", 15)
          .style("font-size", "12px")
          .text((d) => d);      
      });
  }
  document.querySelectorAll("nav ul li a").forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          loadTreeMap(this.getAttribute("data-url"));
      });
  });

  loadTreeMap(defaultUrl);
  window.addEventListener("resize", () => {
      loadTreeMap(defaultUrl);
  });
  
});