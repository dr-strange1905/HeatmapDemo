'use client'
import React, { useEffect, useState } from 'react';
import Heatmap from './Heatmap';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}



const HeatmapContainer = () => {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [yLabels, setYLabels] = useState<string[]>([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json' );
        const jsonData = await response.json();

        
        setData(jsonData.data);
        setXLabels(jsonData.xLabels);
        setYLabels(jsonData.yLabels);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} />
  );
};

export default HeatmapContainer;
