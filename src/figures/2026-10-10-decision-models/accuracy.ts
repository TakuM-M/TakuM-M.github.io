import { barChart } from '../../lib/bar-chart';
import { models, tasks } from './_benchmark';

/** タスクごとの各モデルの値。順番は models と同じ */
const accuracy = [
  [0.95, 0.92, 0.96, 0.94],
  [0.844, 0.906, 0.832, 0.784],
  [0.856, 0.862, 0.85, 0.766],
  [0.768, 0.382, 0.758, 0.662],
];

export default barChart({
  title: 'タスク別の正解率（n=500）',
  unit: 'Accuracy',
  max: 1,
  formatTick: (value) => value.toFixed(1),
  series: models,
  groups: tasks.map((task, i) => ({ ...task, values: accuracy[i] })),
});
