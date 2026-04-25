// The Core Agadham OS Species Engine
// Handles differential vitals, dosage calculations, and species-specific safety warnings.

export const SPECIES_DB = {
  DOG: {
    id: "dog",
    name: "Dog (Canine)",
    icon: "🐕",
    vitals: {
      temp: { min: 100.5, max: 102.5, unit: "°F" },
      heartRate: { min: 60, max: 140, unit: "bpm" }, // highly variable by breed/size, but general range
      respRate: { min: 10, max: 30, unit: "brpm" }
    },
    flags: ["mdr1_sensitive", "nsaid_sensitive"]
  },
  CAT: {
    id: "cat",
    name: "Cat (Feline)",
    icon: "🐈",
    vitals: {
      temp: { min: 100.5, max: 102.5, unit: "°F" },
      heartRate: { min: 140, max: 220, unit: "bpm" },
      respRate: { min: 20, max: 30, unit: "brpm" }
    },
    flags: ["permethrin_toxic", "acetaminophen_highly_toxic", "nsaid_highly_sensitive"]
  },
  CATTLE: {
    id: "cattle",
    name: "Cattle (Bovine)",
    icon: "🐄",
    vitals: {
      temp: { min: 100.4, max: 103.1, unit: "°F" },
      heartRate: { min: 40, max: 80, unit: "bpm" },
      respRate: { min: 10, max: 30, unit: "brpm" }
    },
    flags: ["ruminant", "fssai_withdrawal_applicable"] // Meat/Milk withdrawal strictness
  },
  GOAT: {
    id: "goat",
    name: "Goat (Caprine)",
    icon: "🐐",
    vitals: {
      temp: { min: 101.5, max: 103.5, unit: "°F" },
      heartRate: { min: 70, max: 90, unit: "bpm" },
      respRate: { min: 15, max: 30, unit: "brpm" }
    },
    flags: ["ruminant", "fssai_withdrawal_applicable", "copper_sensitive"] // Note: Sheep are very Cu sensitive, Goats less so wait to specify
  },
  HORSE: {
    id: "horse",
    name: "Horse (Equine)",
    icon: "🐎",
    vitals: {
      temp: { min: 99.0, max: 101.5, unit: "°F" },
      heartRate: { min: 28, max: 40, unit: "bpm" },
      respRate: { min: 8, max: 16, unit: "brpm" }
    },
    flags: ["hindgut_fermenter", "antibiotic_sensitive_gi"]
  },
  AVIAN_SMALL: {
    id: "avian_small",
    name: "Small Avian (Parrots/Passerines)",
    icon: "🦜",
    vitals: {
      temp: { min: 105.0, max: 107.0, unit: "°F" }, // Birds run hot
      heartRate: { min: 250, max: 600, unit: "bpm" }, // Very fast
      respRate: { min: 30, max: 60, unit: "brpm" }
    },
    flags: ["high_metabolism", "teflon_toxic", "sensitive_respiratory"]
  },
  REPTILE: {
    id: "reptile",
    name: "Reptiles (General)",
    icon: "🦎",
    vitals: {
      // Ectothermic, so temp/HR highly depends on resting temp
      temp: { min: 70.0, max: 95.0, unit: "°F" }, 
      heartRate: { min: 10, max: 60, unit: "bpm" },
      respRate: { min: 2, max: 15, unit: "brpm" }
    },
    flags: ["ectothermic", "renal_portal_system"] // Caution injecting in caudal half
  }
};

/**
 * Validates a vital sign against the species norm.
 * @param {string} speciesId 
 * @param {string} vitalType 'temp', 'heartRate', or 'respRate'
 * @param {number} value 
 * @returns {object} { isNormal: boolean, status: string, message: string }
 */
export function validateVitals(speciesId, vitalType, value) {
  const sp = Object.values(SPECIES_DB).find(s => s.id === speciesId);
  if (!sp || !sp.vitals[vitalType]) return { isNormal: true, status: 'unknown', message: 'No reference data' };
  
  const range = sp.vitals[vitalType];
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) return { isNormal: false, status: 'invalid', message: 'Invalid number' };
  
  if (numValue < range.min) {
    return { isNormal: false, status: 'low', message: `Low (Ref: ${range.min}-${range.max} ${range.unit})` };
  } else if (numValue > range.max) {
    return { isNormal: false, status: 'high', message: `High (Ref: ${range.min}-${range.max} ${range.unit})` };
  }
  
  return { isNormal: true, status: 'normal', message: `Normal` };
}

/**
 * Calculates exact dosage based on species-specific multipliers
 * @param {object} drug - The drug object from DB containing mg/kg multipliers (e.g. { concMgPerMl: 50, doseDogMgKg: 5, doseCatMgKg: 3 })
 * @param {number} weightKg - Patient weight in kg
 * @param {string} speciesId - Species ID
 */
export function calculateDosage(drug, weightKg, speciesId) {
  if (!weightKg || !speciesId || !drug) return null;
  
  // Find which key to use in the drug object based on species
  let doseKey = '';
  switch(speciesId) {
    case 'dog': doseKey = 'doseDog'; break;
    case 'cat': doseKey = 'doseCat'; break;
    case 'cattle': doseKey = 'doseCattle'; break;
    case 'goat': doseKey = 'doseGoat'; break;
    case 'horse': doseKey = 'doseHorse'; break;
    case 'avian_small': doseKey = 'doseAvian'; break;
    case 'reptile': doseKey = 'doseReptile'; break;
    default: doseKey = 'doseGeneral';
  }

  // Check if this drug has a specific mg/kg dose for this species
  const prescribedMgKg = drug[doseKey];
  
  if (!prescribedMgKg) {
    // Return a warning indicating it might not be off-label or lacks systemic data
    return { error: true, message: `No safe dosage data for ${speciesId} in database.` };
  }

  const calculatedMg = parseFloat((prescribedMgKg * weightKg).toFixed(2));
  
  // If concentration is provided, calculate ml volume
  let calculatedMl = null;
  if(drug.concMgPerMl) {
    calculatedMl = parseFloat((calculatedMg / drug.concMgPerMl).toFixed(2));
  }
  
  return {
    success: true,
    mg_kg: prescribedMgKg,
    total_mg: calculatedMg,
    total_ml: calculatedMl
  };
}
