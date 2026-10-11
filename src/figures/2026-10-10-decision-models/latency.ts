import { barChart } from '../../lib/bar-chart';
import { models, tasks } from './_benchmark';

/** タスクごとの各モデルの p50 (ms)。順番は models と同じ */
const latency = [
  [168, 102, 799, 686],
  [169, 141, 749, 990],
  [165, 178, 768, 954],
  [175, 279, 820, 1416],
];

export default barChart({
  title: 'タスク別の 1 件あたりレイテンシ p50',
  unit: 'ms',
  max: 1500,
  formatTick: (value) => value.toLocaleString('en-US'),
  series: models,
  groups: tasks.map((task, i) => ({ ...task, values: latency[i] })),
});
