"use client";

import { CompleteScore } from "@/types";
import formatPercent from "@/utilities/format-percent";
import formatScore from "@/utilities/format-score";
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
  TooltipItem,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Filler,
);

const TICK_COLOR = "oklch(97.807% 0.029 256.847)";
const GRID_COLOR = "rgba(255, 255, 255, 0.06)";
const LINE_COLOR = "#01b8e2";
const LINE_FILL = "rgba(1, 184, 226, 0.15)";

const DATASET_STYLE = {
  borderColor: LINE_COLOR,
  backgroundColor: LINE_FILL,
  pointBackgroundColor: LINE_COLOR,
  pointBorderColor: LINE_COLOR,
  tension: 0,
  fill: true,
} as const;

const AXIS_TICKS = {
  color: TICK_COLOR,
} as const;

const AXIS_GRID = {
  color: GRID_COLOR,
} as const;

const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      ticks: { ...AXIS_TICKS, maxRotation: 45 },
      grid: AXIS_GRID,
    },
    y: {
      ticks: AXIS_TICKS,
      grid: AXIS_GRID,
    },
  },
} as const;

interface ChartSpec {
  label: string;
  dataPoints: { x: number; y: number }[];
  formatValue: (value: number) => string;
}

const buildChartConfig = ({
  label,
  dataPoints,
  formatValue,
}: ChartSpec): ChartConfiguration<"line"> => ({
  type: "line",
  data: {
    datasets: [
      {
        label,
        data: dataPoints,
        ...DATASET_STYLE,
      },
    ],
  },
  options: {
    ...COMMON_OPTIONS,
    plugins: {
      ...COMMON_OPTIONS.plugins,
      tooltip: {
        callbacks: {
          title: (items) =>
            format(new Date(Number(items[0].parsed.x)), "MMM d, yyyy"),
          label: (context: TooltipItem<"line">) =>
            formatValue(Number(context.parsed.y)),
        },
      },
    },
    scales: {
      ...COMMON_OPTIONS.scales,
      x: {
        type: "time",
        ...COMMON_OPTIONS.scales.x,
        time: {
          displayFormats: {
            day: "MMM d, yyyy",
            week: "MMM d, yyyy",
            month: "MMM yyyy",
            year: "yyyy",
          },
        },
      },
      y: {
        ...COMMON_OPTIONS.scales.y,
        ticks: {
          ...COMMON_OPTIONS.scales.y.ticks,
          callback: (value) => formatValue(Number(value)),
        },
      },
    },
  },
});

interface Props {
  scores: CompleteScore[];
}

const ScoresCharts = ({ scores }: Props) => {
  const scoreCanvasRef = useRef<HTMLCanvasElement>(null);
  const percentCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvases = [scoreCanvasRef.current, percentCanvasRef.current];
    if (canvases.some((canvas) => !canvas)) return;

    const chronological = [...scores].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    const toDataPoints = (field: "score" | "percent") =>
      chronological.map((score) => ({
        x: score.date.getTime(),
        y: score[field],
      }));

    const charts = [
      buildChartConfig({
        label: "Score",
        dataPoints: toDataPoints("score"),
        formatValue: formatScore,
      }),
      buildChartConfig({
        label: "Percent",
        dataPoints: toDataPoints("percent"),
        formatValue: formatPercent,
      }),
    ].map(
      (config, index) =>
        new Chart(canvases[index] as HTMLCanvasElement, config),
    );

    return () => {
      charts.forEach((chart) => chart.destroy());
    };
  }, [scores]);

  return (
    <div className="flex-1 flex flex-col gap-8 p-4 overflow-y-auto">
      <div className="relative flex-1">
        <canvas ref={scoreCanvasRef} />
      </div>
      <div className="relative flex-1">
        <canvas ref={percentCanvasRef} />
      </div>
    </div>
  );
};

export default ScoresCharts;
