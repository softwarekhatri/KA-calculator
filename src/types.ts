
export interface BaseMetalConfig {
  goldPricePer10g: number;
  silverPricePer10g: number;
}

export interface GoldConfig {
  id: string;
  name: string;
  purity: number;
  makingCharge: number;
  addOnPrice: number;
}

export interface SilverConfig {
  id: string;
  name: string;
  purity: number;
  makingCharge: number;
  addOnPrice: number;
}
