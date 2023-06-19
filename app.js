document.addEventListener("DOMContentLoaded", function () {
  const url =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

  d3.json(url).then((data) => {
      const width = document.documentElement.clientWidth * 0.8;
      const height = 570;

      const svg = d3
          .select("#tree-map")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("display", "block")
          .style("margin", "0 auto");

      const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.height - a.height || b.value - a.value);

      d3.treemap().size([width, height]).paddingInner(1)(root);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const tile = svg
          .selectAll("g")
          .data(root.leaves())
          .enter()
          .append("g")
          .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      const tooltip = d3.select("#tooltip");

      tile
          .append("rect")
          .attr("class", "tile")
          .attr("width", (d) => d.x1 - d.x0)
          .attr("height", (d) => d.y1 - d.y0)
          .attr("fill", (d) => color(d.data.category))
          .attr("data-name", (d) => d.data.name)
          .attr("data-category", (d) => d.data.category)
          .attr("data-value", (d) => d.data.value)
          .on("mousemove", function (event, d) {
              tooltip.style("opacity", 1);
              tooltip.html(
                  `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
              );
              tooltip.attr("data-value", d.data.value);
              tooltip.style("top", event.pageY - 30 + "px");
              tooltip.style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", () => {
              tooltip.style("opacity", 0);
          });

      tile
          .append("text")
          .attr("x", 5)
          .attr("y", 15)
          .style("font-size", "12px")
          .text((d) => d.data.name);

      const categories = root.leaves().map((d) => d.data.category);
      const uniqueCategories = [...new Set(categories)];

      const legend = d3
          .select("#legend")
          .append("svg")
          .attr("width", 400)
          .attr("height", 120);

      legend
          .selectAll("rect")
          .data(uniqueCategories)
          .enter()
          .append("rect")
          .attr("class", "legend-item")
          .attr("x", (d, i) => (i % 6) * 60)
          .attr("y", (d, i) => Math.floor(i / 6) * 30)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", (d) => color(d));

      legend
          .selectAll("text")
          .data(uniqueCategories)
          .enter()
          .append("text")
          .attr("x", (d, i) => (i % 6) * 60 + 25)
          .attr("y", (d, i) => Math.floor(i / 6) * 30 + 15)
          .style("font-size", "12px")
          .text((d) => d);
  });
});
