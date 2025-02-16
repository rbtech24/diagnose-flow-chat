
export interface Symptom {
  name: string;
  isActive: boolean;
  order: number;
}

export interface Appliance {
  name: string;
  symptoms: Symptom[];
  order: number;
}
