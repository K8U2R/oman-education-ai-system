import React from 'react';

interface ChartDataset {
  label: string;
  data: number[];
  color: string;
}

interface LineChartProps {
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  title?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, height = 200 }) => {
  const maxValue = Math.max(
    ...data.datasets.flatMap((dataset) => dataset.data)
  );

  return (
    <div>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div
        className="relative"
        style={{ height: `${height}px` }}
      >
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-ide-text-secondary pr-2">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="mr-8 h-full flex items-end gap-2">
          {data.labels.map((label, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Bars for each dataset */}
              <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '90%' }}>
                {data.datasets.map((dataset, datasetIndex) => {
                  const value = dataset.data[index] || 0;
                  const percentage = (value / maxValue) * 100;
                  return (
                    <div
                      key={datasetIndex}
                      className="w-full rounded-t transition-all hover:opacity-80"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: dataset.color,
                        opacity: 0.8,
                      }}
                      title={`${dataset.label}: ${value}`}
                    />
                  );
                })}
              </div>
              {/* X-axis label */}
              <span className="text-xs text-ide-text-secondary mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;

