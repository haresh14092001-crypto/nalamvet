CREATE TABLE IF NOT EXISTS drugs (
    id TEXT PRIMARY KEY,
    generic_name TEXT NOT NULL,
    brand_names TEXT,
    category TEXT,
    species TEXT,
    indications TEXT,
    contraindications TEXT,
    side_effects TEXT,
    route TEXT,
    formulation TEXT,
    concentration_mg REAL,
    concentration_ml REAL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS drug_dosing_rules (
    id TEXT PRIMARY KEY,
    drug_id TEXT NOT NULL,
    species TEXT NOT NULL,
    mg_per_kg REAL,
    dose_text TEXT,
    frequency_hours INTEGER,
    duration_days INTEGER,
    notes TEXT,
    FOREIGN KEY(drug_id) REFERENCES drugs(id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    pet_id TEXT,
    species TEXT,
    weight_kg REAL,
    drug_id TEXT,
    selected_formulation TEXT,
    route TEXT,
    frequency TEXT,
    duration TEXT,
    dose_rule_used TEXT,
    mg_per_kg REAL,
    calculated_mg_per_dose REAL,
    concentration TEXT,
    calculated_ml_per_dose REAL,
    warnings TEXT,
    calculation_status TEXT,
    calculation_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teaching_cases (
    id TEXT PRIMARY KEY,
    title TEXT,
    department TEXT,
    species_tags TEXT,
    signalment TEXT,
    history TEXT,
    findings TEXT,
    discussion_phase TEXT,
    learning_objectives TEXT,
    review_status TEXT,
    review_type TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
