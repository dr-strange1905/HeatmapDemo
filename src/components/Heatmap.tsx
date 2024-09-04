"use client"
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapProps {
  datasets: { [key: string]: { data: HeatmapData[], xLabels: string[], yLabels: string[] } };

  
  color?: string;
  yAxisTitle?: string;
}
const Heatmap = ({ datasets, color = '#00008B', yAxisTitle = 'This is a Title' }: HeatmapProps) => {
  const [selectedDataset, setSelectedDataset] = useState(Object.keys(datasets)[0]);
  const svgRef = useRef<SVGSVGElement>(null);
  const { data, xLabels, yLabels } = datasets[selectedDataset] || {};
  const maxValue = d3.max(data, d => d.value) || 0;
  const minValue = d3.min(data, d => d.value) || 0;

  useEffect(() => {
    const cellWidth = 60;
    const cellHeight = 40;
    const width = xLabels.length * cellWidth + 40;
    const height = yLabels.length * cellHeight + 40;
    const margin = { top: 100, right: 100, bottom: 100, left: 200 };

    d3.select('body').selectAll('div.tooltip').remove();
    

    if (svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove();
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right + 100)
        .attr('height', height + margin.top + margin.bottom + 100)
        .append('g')
        .attr('transform', `translate(${margin.left },${margin.top})`);

      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(xLabels)
        .padding(0.08);

      const yScale = d3.scaleBand()
        .range([height, 0])
        .domain(yLabels)
        .padding(0.08);

      // const colorScale = d3.scaleSequential<string>()
      //   .interpolator(d3.interpolateRgb(`${color}`, d3.rgb(color).darker(4)))
      //   .domain([0, maxValue]);


        const colorScale = d3
        .scaleSequential<string>()
        .interpolator(d3.interpolateRgb(`${color}`, d3.rgb(color).darker(6)))
        .domain([0, maxValue]) 
        .range(["#ADD8E6", "#0000FF", "#00008B"]);
    
        const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', 'rgba(0, 0, 0, 0.7)') 
        .style('color', 'white') 
        .style('padding', '5px')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0);



      svg.selectAll()
        .data(data, d => `${d?.x}:${d?.y}`)
        .enter()
        .append('rect')
        .attr('x', d => {
          const x = xScale(d.x);
          return x !== undefined ? x : 0;
        })
        .attr('y', d => {
          const y = yScale(d.y);
          return y !== undefined ? y : 0;
        })
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('rx', 3)  // Set rounded corners
        .attr('ry', 3)
        .style('fill', d => colorScale(d.value))
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip.html(`x: ${d.x}<br/>y: ${d.y}<br/>Value: ${d.value}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
        });

        

        const isColorLight = (color: string) => {
          const rgb = d3.rgb(color);
          const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          return brightness > 128;
        };

        svg.selectAll()
        .data(data, d => `${d?.x}:${d?.y}`)
        .enter()
        .append('text')
        .attr('x', d => {
          const x = xScale(d.x);
          return x !== undefined ? x + cellWidth / 2 : 0;
        })
        .attr('y', d => {
          const y = yScale(d.y);
          return y !== undefined ? y + cellHeight / 2 : 0;
        })
        .attr('dy', '.35em') // Adjust vertical alignment
        .style('text-anchor', 'middle')
        .style('fill', d => isColorLight(colorScale(d.value)) ? 'black' : 'white')  // Adjust text color for better visibility
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '12px')
        .text(d => d.value);

      svg.append('g')
        .attr('transform', `translate(0,-20)`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll('text')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '14px')
       
      svg.selectAll('.domain').remove();

      svg.append('g')
      .attr('transform', `translate(-${20},0)`)
        .call(d3.axisLeft(yScale).tickSize(0))
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '14px')
        
      svg.selectAll('.domain').remove();

      const yAxisLabelWidth = d3.select(svgRef.current)
      .selectAll('.tick text')
      .nodes()
      .reduce((maxWidth, node) => {
        const svgNode = node as SVGGraphicsElement;
        return Math.max(maxWidth, svgNode?.getBBox()?.width || 0);
      }, 0);

      svg.append('text')
      .attr('x', -margin.left + yAxisLabelWidth + 160) // Position it to the left of the y-axis
      .attr('y', -margin.top/4) // Position it above the y-axis
      .attr('dy', '1em') // Adjust vertical alignment
      .style('text-anchor', 'end') // Align text to the start
      .style('font-family', 'Arial, sans-serif')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(yAxisTitle);
    }
  }, [data, xLabels, yLabels, color, yAxisTitle]);

  return (
    <div>
      <select onChange={(e) => setSelectedDataset(e.target.value)} value={selectedDataset}>
        {Object.keys(datasets).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Heatmap;
