"use client"
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  xLabels: string[];
  yLabels: string[];
  color?: string;
  
}
const Heatmap = ({ data, xLabels, yLabels, color = '#00008B' }: HeatmapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const maxValue = d3.max(data, d => d.value) || 0;
  const minValue = d3.min(data, d => d.value) || 0;

  useEffect(() => {
    const cellWidth = 60;
    const cellHeight = 40;
    const width = xLabels.length * cellWidth + 40;
    const height = yLabels.length * cellHeight + 40;
    const margin = { top: 50, right: 30, bottom: 30, left: 50 };
    

    if (svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove();
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

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

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll('text')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '14px')
        .style('font-weight', 'bold');
      svg.selectAll('.domain').remove();

      svg.append('g')
        .call(d3.axisLeft(yScale).tickSize(0))
        .selectAll('text')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '14px')
        .style('font-weight', 'bold');
      svg.selectAll('.domain').remove();
    }
  }, [data, xLabels, yLabels, color]);

  return <svg ref={svgRef}></svg>;
};

export default Heatmap;
