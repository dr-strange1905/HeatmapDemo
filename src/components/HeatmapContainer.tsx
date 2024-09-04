'use client'
import React, { useEffect, useState } from 'react';
import Heatmap from './Heatmap';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface Datasets {
  [key: string]: {
    data: HeatmapData[];
    xLabels: string[];
    yLabels: string[];
  };
}

const HeatmapContainer = () => {
  const [datasets, setDatasets] = useState<Datasets>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const jsonData = await response.json();
        setDatasets(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div>
      {Object.keys(datasets).length > 0 ? (
        <Heatmap datasets={datasets} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default HeatmapContainer;
