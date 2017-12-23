let svg = d3.select('svg.chart')

const margin = {
      top: 30,
      right: 8,
      bottom: 80,
      left: 8},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    //timeFormat = d3.timeFormat('%d. %b %Y %H:%M'),
    timeFormat = d3.timeFormat('%H:%M');

let g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

let xAxis = d3.scaleTime().rangeRound([0, width]),
    xBar = d3.scaleBand().range([0, width]).padding(0.1),
    yAxis = d3.scaleLinear().rangeRound([height, 0]);

const area = d3.area()
    .x((d) => {return xAxis(d.time)})
    .y1((d) => {return yAxis(d.price)});

const maxPrice = function(d) {
  return d3.max(d, (d) => {return d.price})
}

const minPrice = function(data) {
  return d3.min(data, (d) => {return d.price})
}

d3.tsv('js/data999.tsv', (d) => {
  d.timestamp = +d.timestamp;
  d.time = new Date(d.timestamp * 1000);
  d.price = +d.price;
  d.volume = +d.volume;
  return d;
}, (error, data) => {
  if (error) throw error;

  let yAxisSafeArea = (maxPrice(data) - minPrice(data)) * 0.1;

  yAxis.domain([minPrice(data) - yAxisSafeArea, maxPrice(data) + yAxisSafeArea]);
  xAxis.domain(d3.extent(data, (d) => {return d.time}));

  area.y0(yAxis(minPrice(data) - yAxisSafeArea));

  g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis)
        .ticks(12)
        .tickFormat(timeFormat)
      );

  g.append('g')
    .attr('class', 'steamgraph')
    .append('path')
    .attr('d', area(data));

  g.append("g")
      .attr("class", "grid grid--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xAxis)
          .ticks(8)
          .tickSize(-height)
          .tickFormat("")
      );

  g.append("g")
      .attr("class", "grid grid--y")
      .call(d3.axisLeft(yAxis)
          .ticks(4)
          .tickSize(-width)
          .tickFormat("")
      );

  g.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${width - 30}, -10)`)
      .call(d3.axisRight(yAxis)
        .ticks(4)
      );
});

d3.tsv('js/data50.tsv', (d) => {
  d.timestamp = +d.timestamp;
  d.time = new Date(d.timestamp * 1000);
  d.price = +d.price;
  d.volume = +d.volume;
  return d;
}, (error, data) => {
  if (error) throw error;

  let yAxisSafeArea = (maxPrice(data) - minPrice(data)) * 4;

  xBar.domain(data.map((d) => {return d.time}));
  yAxis.domain([minPrice(data), maxPrice(data) + yAxisSafeArea]);

  g.append('g')
    .attr('class', 'bar')
    .selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('x', function(d) {return xBar(d.time)})
      .attr('y', function(d) {return yAxis(d.price)})
      .attr('width', xBar.bandwidth())
      .attr('height', function(d) {return height - yAxis(d.price)});
});
