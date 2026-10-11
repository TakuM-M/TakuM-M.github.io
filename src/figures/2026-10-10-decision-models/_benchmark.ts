import { palette } from '../../lib/svg';

/** 精度・速さの両グラフに共通するモデルとタスク。数値は本文の表と同じ。 */
export const models = [
  { name: 'Jev', color: palette.blue },
  { name: 'Laya', color: palette.orange },
  { name: 'Claude Haiku 4.5', color: palette.green },
  { name: 'Qwen3 4B', color: palette.yellow },
];

export const tasks = [
  { label: 'SST-2', sublabel: '2 クラス' },
  { label: 'AG News', sublabel: '4 クラス' },
  { label: 'AG News v2', sublabel: '4 クラス' },
  { label: 'Banking77', sublabel: '77 クラス' },
];
