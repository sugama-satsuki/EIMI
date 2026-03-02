import type { NutrientInfo } from '../types/nutrient.ts';

export const nutrientMap: NutrientInfo[] = [
  { key: 'water', label: '水分', unit: 'g' },
  { key: 'protcaa', label: 'アミノ酸組成によるたんぱく質', unit: 'g' },
  { key: 'prot', label: 'たんぱく質', unit: 'g' },
  { key: 'fatnlea', label: '脂肪酸のトリアシルグリセロール当量', unit: 'g' },
  { key: 'chole', label: 'コレステロール', unit: 'mg' },
  { key: 'fat', label: '脂質', unit: 'g' },
  { key: 'choavlm', label: '利用可能炭水化物（単糖当量）', unit: 'g' },
  { key: 'choavl', label: '利用可能炭水化物（質量計）', unit: 'g' },
  { key: 'choavldf', label: '差引き法による利用可能炭水化物', unit: 'g' },
  { key: 'fib', label: '食物繊維総量', unit: 'g' },
  { key: 'polyl', label: '糖アルコール', unit: 'g' },
  { key: 'chocdf', label: '炭水化物', unit: 'g' },
  { key: 'oa', label: '有機酸', unit: 'g' },
  { key: 'ash', label: '灰分', unit: 'g' },
  { key: 'na', label: 'ナトリウム', unit: 'mg' },
  { key: 'k', label: 'カリウム', unit: 'mg' },
  { key: 'ca', label: 'カルシウム', unit: 'mg' },
  { key: 'mg', label: 'マグネシウム', unit: 'mg' },
  { key: 'p', label: 'リン', unit: 'mg' },
  { key: 'fe', label: '鉄', unit: 'mg' },
  { key: 'zn', label: '亜鉛', unit: 'mg' },
  { key: 'cu', label: '銅', unit: 'mg' },
  { key: 'mn', label: 'マンガン', unit: 'mg' },
  { key: 'id', label: 'ヨウ素', unit: '\u00b5g' },
  { key: 'se', label: 'セレン', unit: '\u00b5g' },
  { key: 'cr', label: 'クロム', unit: '\u00b5g' },
  { key: 'mo', label: 'モリブデン', unit: '\u00b5g' },
  { key: 'retol', label: 'レチノール', unit: '\u00b5g' },
  { key: 'carta', label: '\u03b1-カロテン', unit: '\u00b5g' },
  { key: 'cartb', label: '\u03b2-カロテン', unit: '\u00b5g' },
  { key: 'crypxb', label: '\u03b2-クリプトキサンチン', unit: '\u00b5g' },
  { key: 'cartbeq', label: '\u03b2-カロテン当量', unit: '\u00b5g' },
  { key: 'vitaRae', label: 'ビタミンA（RAE）', unit: '\u00b5g' },
  { key: 'vitD', label: 'ビタミンD', unit: '\u00b5g' },
  { key: 'tocphA', label: '\u03b1-トコフェロール', unit: 'mg' },
  { key: 'tocphB', label: '\u03b2-トコフェロール', unit: 'mg' },
  { key: 'tocphG', label: '\u03b3-トコフェロール', unit: 'mg' },
  { key: 'tocphD', label: '\u03b4-トコフェロール', unit: 'mg' },
  { key: 'vitK', label: 'ビタミンK', unit: '\u00b5g' },
  { key: 'thia', label: 'ビタミンB1', unit: 'mg' },
  { key: 'ribf', label: 'ビタミンB2', unit: 'mg' },
  { key: 'nia', label: 'ナイアシン', unit: 'mg' },
  { key: 'ne', label: 'ナイアシン当量', unit: 'mg' },
  { key: 'vitB6A', label: 'ビタミンB6', unit: 'mg' },
  { key: 'vitB12', label: 'ビタミンB12', unit: '\u00b5g' },
  { key: 'fol', label: '葉酸', unit: '\u00b5g' },
  { key: 'pantac', label: 'パントテン酸', unit: 'mg' },
  { key: 'biot', label: 'ビオチン', unit: '\u00b5g' },
  { key: 'vitC', label: 'ビタミンC', unit: 'mg' },
  { key: 'alc', label: 'アルコール', unit: 'g' },
  { key: 'naclEq', label: '食塩相当量', unit: 'g' },
];

const nutrientKeySet = new Set(nutrientMap.map((n) => n.key));

export function isValidNutrientKey(key: string): boolean {
  return nutrientKeySet.has(key);
}

export function getNutrientInfo(key: string): NutrientInfo | undefined {
  return nutrientMap.find((n) => n.key === key);
}
