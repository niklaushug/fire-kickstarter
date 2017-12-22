let svg = d3.select('svg')

const margin = {
      top: 0,
      right: 0,
      bottom: 30,
      left: 40},
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom,
    //timeFormat = d3.timeFormat('%d. %b %Y %H:%M'),
    timeFormat = d3.timeFormat('%H:%M');

let g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

let xAxis = d3.scaleTime().rangeRound([0, width]),
    xBar = d3.scaleBand().range([0, width]).padding(0.1),
    yAxis = d3.scaleLinear().rangeRound([height, 0]);

console.log(height);

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

  let yAxisSafeArea = (maxPrice(data) - minPrice(data)) / 10;

  xBar.domain(data.map((d) => {return d.time}));

  yAxis.domain([minPrice(data) - yAxisSafeArea, maxPrice(data) + yAxisSafeArea]);
  xAxis.domain(d3.extent(data, (d) => {return d.time}));

  area.y0(yAxis(minPrice(data) - yAxisSafeArea));

  g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis).tickFormat(timeFormat));

  g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(yAxis));

  g.append('g')
    .attr('class', 'bar')
    .selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('x', function(d) {return xBar(d.time)})
      .attr('y', function(d) {return yAxis(d.price)})
      .attr('width', xBar.bandwidth())
      .attr('height', function(d) {return height - yAxis(d.price)});

  g.append('g')
    .attr('class', 'steamgraph')
    .append('path')
    .attr('d', area(data))
    .attr('fill', 'red');
});
