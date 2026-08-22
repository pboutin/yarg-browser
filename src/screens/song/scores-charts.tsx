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
  CategoryScale,
  Tooltip,
  Filler,
  TooltipItem,
} from "chart.js";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
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
  tension: 0.25,
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
  values: number[];
  formatValue: (value: number) => string;
}

const buildChartConfig = (
  dateLabels: string[],
  { label, values, formatValue }: ChartSpec,
): ChartConfiguration<"line"> => ({
  type: "line",
  data: {
    labels: dateLabels,
    datasets: [
      {
        label,
        data: values,
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
          label: (context: TooltipItem<"line">) =>
            formatValue(Number(context.raw)),
        },
      },
    },
    scales: {
      ...COMMON_OPTIONS.scales,
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
    const dateLabels = chronological.map((score) =>
      format(score.date, "MMM d, yyyy"),
    );

    const charts = [
      buildChartConfig(dateLabels, {
        label: "Score",
        values: chronological.map((score) => score.score),
        formatValue: formatScore,
      }),
      buildChartConfig(dateLabels, {
        label: "Percent",
        values: chronological.map((score) => score.percent),
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
    <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
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
