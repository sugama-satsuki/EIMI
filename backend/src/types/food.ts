export interface FoodItem {
  groupId: number;
  foodId: number;
  indexId: number;
  foodName: string;
  refuse: number;
  enerc: number;
  enercKcal: number;
  water: number | null;
  protcaa: number | null;
  prot: number | null;
  fatnlea: number | null;
  chole: number | null;
  fat: number | null;
  choavlm: number | null;
  choavl: number | null;
  choavldf: number | null;
  fib: number | null;
  polyl: number | null;
  chocdf: number | null;
  oa: number | null;
  ash: number | null;
  na: number | null;
  k: number | null;
  ca: number | null;
  mg: number | null;
  p: number | null;
  fe: number | null;
  zn: number | null;
  cu: number | null;
  mn: number | null;
  id: number | null;
  se: number | null;
  cr: number | null;
  mo: number | null;
  retol: number | null;
  carta: number | null;
  cartb: number | null;
  crypxb: number | null;
  cartbeq: number | null;
  vitaRae: number | null;
  vitD: number | null;
  tocphA: number | null;
  tocphB: number | null;
  tocphG: number | null;
  tocphD: number | null;
  vitK: number | null;
  thia: number | null;
  ribf: number | null;
  nia: number | null;
  ne: number | null;
  vitB6A: number | null;
  vitB12: number | null;
  fol: number | null;
  pantac: number | null;
  biot: number | null;
  vitC: number | null;
  alc: number | null;
  naclEq: number | null;
}

export interface NutrientInfo {
  key: string;
  label: string;
  unit: string;
}

export interface FoodSearchResult {
  foodId: number;
  foodName: string;
  value: number;
  unit: string;
}

export interface FoodSearchResponse {
  nutrient: NutrientInfo;
  foods: FoodSearchResult[];
  total: number;
  limit: number;
  offset: number;
}
