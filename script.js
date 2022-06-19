let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let dataArr = [];

async function getData() {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        dataArr = data.data;
        setCanvas();
         })
};

let yScale
let xScale
let xAxisScale
let yAxisScale

let w = window.innerWidth * 0.8;
let h = window.innerHeight * 0.8;
let padding = 40;

let title = d3.select("text")
let svg = d3.select("svg")

let setCanvas = () => {
    svg.attr('width', w)
        .attr ('height', h)
    title.attr("x", '50%')
        .attr("y", (h - (h*0.90)))
        .attr('text-anchor', 'middle')
        .attr('font-size', h/10)
    setScales();
    xAndY();
    setBars();
}

let setScales = () => {
    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataArr, x => {
            return x[1];
        })])
        .range([0, h - (2 * padding)])

    xScale = d3.scaleLinear()
        .domain([0, dataArr.length - 1])
        .range([padding, w-padding])

    let datesArr = dataArr.map((x) => {
        return new Date(x[0]);
    });

    
    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArr), d3.max(datesArr)])
        .range([padding, w-padding]);

    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(dataArr, x => {
            return x[1];
        })])
        .range([h - padding, padding]);
}
   
let setBars = () => {

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto')

    svg.selectAll('rect')
        .data(dataArr)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', ((w - (2 * padding)) / dataArr.length))
        .attr('data-date', x =>{
            return x[0];
        })
        .attr('data-gdp', x=> {
            return x[1];
        })
        .attr('height', x => {
            return yScale(x[1]);
        })
        .attr('x', (item, index) => {
            return xScale(index);
        })
        .attr('y', x => {
            return ((h-padding)-yScale(x[1]))
        } )
        .on('mouseover', x => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.text("Date: " + x[0] + " GDP: " + x[1] + " Billion USD")
            document.getElementById('tooltip').setAttribute('data-date', x[0])
        })
        .on('mouseout', x => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

let xAndY = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (h - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}
getData();
    