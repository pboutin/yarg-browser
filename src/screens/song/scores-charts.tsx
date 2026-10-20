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
import { useEffect, useMemo, useRef } from "react";

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
  pointHoverRadius: 7,
  pointHoverBorderWidth: 2,
  pointHoverBorderColor: "#ffffff",
  pointHitRadius: 8,
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
      grid: { ...AXIS_GRID, drawOnChartArea: false },
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
  showXAxis: boolean;
  onHover: (index: number | null) => void;
}

const buildChartConfig = ({
  label,
  dataPoints,
  formatValue,
  showXAxis,
  onHover,
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
    interaction: { mode: "nearest", intersect: true },
    onHover: (_event, elements) => onHover(elements[0]?.index ?? null),
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
        ticks: {
          ...COMMON_OPTIONS.scales.x.ticks,
          display: showXAxis,
        },
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
        position: "left",
        ticks: {
          ...COMMON_OPTIONS.scales.y.ticks,
          callback: (value) => formatValue(Number(value)),
        },
      },
      yRight: {
        type: "linear",
        position: "right",
        grid: {
          drawOnChartArea: false,
          drawTicks: true,
        },
        afterDataLimits: (axis) => {
          axis.min = axis.chart.scales.y.min;
          axis.max = axis.chart.scales.y.max;
        },
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
  hoveredScoreId: string | null;
  onScoreHover: (scoreId: string | null) => void;
}

const ScoresCharts = ({ scores, hoveredScoreId, onScoreHover }: Props) => {
  const scoreCanvasRef = useRef<HTMLCanvasElement>(null);
  const percentCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartsRef = useRef<Chart<"line">[]>([]);
  const chronological = useMemo(
    () => [...scores].sort((a, b) => a.date.getTime() - b.date.getTime()),
    [scores],
  );

  useEffect(() => {
    const canvases = [scoreCanvasRef.current, percentCanvasRef.current];
    if (canvases.some((canvas) => !canvas)) return;

    const onHover = (index: number | null) =>
      onScoreHover(index === null ? null : chronological[index].id);

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
        showXAxis: false,
        onHover,
      }),
      buildChartConfig({
        label: "Percent",
        dataPoints: toDataPoints("percent"),
        formatValue: formatPercent,
        showXAxis: true,
        onHover,
      }),
    ].map(
      (config, index) =>
        new Chart(canvases[index] as HTMLCanvasElement, config),
    );
    chartsRef.current = charts;

    return () => {
      charts.forEach((chart) => chart.destroy());
      chartsRef.current = [];
    };
  }, [chronological, onScoreHover]);

  useEffect(() => {
    const index = chronological.findIndex(
      (score) => score.id === hoveredScoreId,
    );
    const activeElements = index < 0 ? [] : [{ datasetIndex: 0, index }];

    chartsRef.current.forEach((chart) => {
      chart.setActiveElements(activeElements);
      const point = index < 0 ? null : chart.getDatasetMeta(0).data[index];
      chart.tooltip?.setActiveElements(
        activeElements,
        point ? { x: point.x, y: point.y } : { x: 0, y: 0 },
      );
      chart.update("none");
    });
  }, [chronological, hoveredScoreId, onScoreHover]);

  return (
    <div
      className="flex-1 min-w-0 min-h-0 flex flex-col gap-4 p-4"
      onMouseLeave={() => onScoreHover(null)}
    >
      <div className="relative flex-1 min-h-0 min-w-0">
        <canvas ref={scoreCanvasRef} />
      </div>
      <div className="relative flex-1 min-h-0 min-w-0">
        <canvas ref={percentCanvasRef} />
      </div>
    </div>
  );
};

export default ScoresCharts;
