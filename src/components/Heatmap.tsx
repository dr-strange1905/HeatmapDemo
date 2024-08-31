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
  
}
const Heatmap = ({ data, xLabels, yLabels }: HeatmapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = 500;
    const height = 500;
    const margin = { top: 50, right: 30, bottom: 30, left: 50 };

    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(xLabels)
        .padding(0.05);

      const yScale = d3.scaleBand()
        .range([height, 0])
        .domain(yLabels)
        .padding(0.05);

      const colorScale = d3.scaleSequential<number>()
        .interpolator(d3.interpolateCool)
        .domain([0, d3.max(data, d => d.value) || 0]);

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
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .style('fill', d => colorScale(d.value));

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append('g')
        .call(d3.axisLeft(yScale));
    }
  }, [data, xLabels, yLabels]);

  return <svg ref={svgRef}></svg>;
};

export default Heatmap;
