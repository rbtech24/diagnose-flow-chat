
import { useState, useEffect } from 'react';
import { Appliance } from '@/types/appliance';

const STORAGE_KEY = 'appliances-data';

export function useAppliances() {
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const savedAppliances = localStorage.getItem(STORAGE_KEY);
    return savedAppliances ? JSON.parse(savedAppliances) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances));
  }, [appliances]);

  const addAppliance = (name: string) => {
    const newAppliance: Appliance = {
      name,
      order: appliances.length,
      symptoms: []
    };
    setAppliances([...appliances, newAppliance]);
  };

  const editAppliance = (index: number, newName: string) => {
    const newAppliances = [...appliances];
    newAppliances[index].name = newName;
    setAppliances(newAppliances);
  };

  const deleteAppliance = (index: number) => {
    const newAppliances = [...appliances];
    newAppliances.splice(index, 1);
    newAppliances.forEach((appliance, i) => {
      appliance.order = i;
    });
    setAppliances(newAppliances);
  };

  const toggleWorkflow = (applianceIndex: number, symptomIndex: number) => {
    const newAppliances = [...appliances];
    const symptom = newAppliances[applianceIndex].symptoms[symptomIndex];
    symptom.isActive = !symptom.isActive;
    setAppliances(newAppliances);
    return symptom;
  };

  const moveAppliance = (fromIndex: number, toIndex: number) => {
    const newAppliances = [...appliances];
    const [movedAppliance] = newAppliances.splice(fromIndex, 1);
    newAppliances.splice(toIndex, 0, movedAppliance);
    
    newAppliances.forEach((appliance, index) => {
      appliance.order = index;
    });
    
    setAppliances(newAppliances);
  };

  const moveSymptom = (applianceIndex: number, fromIndex: number, toIndex: number) => {
    const newAppliances = [...appliances];
    const appliance = newAppliances[applianceIndex];
    const symptoms = [...appliance.symptoms];
    const [movedSymptom] = symptoms.splice(fromIndex, 1);
    symptoms.splice(toIndex, 0, movedSymptom);
    
    symptoms.forEach((symptom, index) => {
      symptom.order = index;
    });
    
    appliance.symptoms = symptoms;
    setAppliances(newAppliances);
  };

  return {
    appliances: appliances.sort((a, b) => a.order - b.order),
    addAppliance,
    editAppliance,
    deleteAppliance,
    toggleWorkflow,
    moveAppliance,
    moveSymptom
  };
}
