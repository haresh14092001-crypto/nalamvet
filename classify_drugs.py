import json
import re

# Read the drug file
with open('c:/Users/hares/.nalamvet/nalamvet-1/NALAM VET TIME STAMP 11,11.4.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the DRUG_DB array
start = content.find('const DRUG_DB = [')
end = content.find('];', start) + 2
drugs_json = content[start:end]

# Parse
drugs = json.loads(drugs_json.replace('const DRUG_DB = ', '').rstrip(';'))

print(f'Total drugs: {len(drugs)}')

# Classification function
def classify_drug(drug):
    generic = drug['generic'].lower()
    indications = drug.get('indications', '').lower()
    
    # Antibiotics
    if any(word in generic for word in ['penicillin', 'amoxicillin', 'ampicillin', 'cephalexin', 'cefazolin', 'tetracycline', 'doxycycline', 'oxytetracycline', 'chlortetracycline', 'minocycline', 'erythromycin', 'azithromycin', 'clarithromycin', 'gentamicin', 'amikacin', 'kanamycin', 'neomycin', 'streptomycin', 'tobramycin', 'enrofloxacin', 'ciprofloxacin', 'norfloxacin', 'levofloxacin', 'sulfamethoxazole', 'trimethoprim', 'sulfadiazine', 'sulfadimethoxine', 'sulfadimidine', 'sulfaguanidine', 'sulfasalazine', 'chloramphenicol', 'florfenicol', 'lincomycin', 'clindamycin', 'tylosin', 'tilmicosin', 'spiramycin', 'colistin', 'polymyxin']):
        return 'Antibiotics'
    
    # Antiparasitics
    if any(word in generic for word in ['ivermectin', 'moxidectin', 'doramectin', 'eprinomectin', 'selamectin', 'milbemycin', 'abamectin', 'fenbendazole', 'albendazole', 'mebendazole', 'flubendazole', 'oxfendazole', 'triclabendazole', 'praziquantel', 'epsiprantel', 'niclosamide', 'bunamidine', 'pyrantel', 'morantel', 'levamisole', 'piperazine', 'diethylcarbamazine', 'fipronil', 'imidacloprid', 'selamectin', 'permethrin', 'cypermethrin', 'deltamethrin', 'lambda-cyhalothrin', 'dichlorvos', 'trichlorfon', 'haloxon', 'coumaphos', 'diazinon', 'malathion', 'dimethoate', 'chlorpyrifos', 'carbaryl', 'propoxur', 'amitraz', 'fluazuron', 'lufenuron', 'diflubenzuron', 'pyriproxyfen', 'methoprene']):
        return 'Antiparasitics'
    
    # NSAIDs
    if any(word in generic for word in ['aspirin', 'phenylbutazone', 'flunixin', 'ketoprofen', 'carprofen', 'meloxicam', 'piroxicam', 'tenoxicam', 'diclofenac', 'ibuprofen', 'naproxen', 'indomethacin', 'sulindac', 'etodolac', 'deracoxib', 'firocoxib', 'robenacoxib', 'grapiprant']):
        return 'NSAIDs'
    
    # Steroids
    if any(word in generic for word in ['dexamethasone', 'prednisolone', 'prednisone', 'hydrocortisone', 'betamethasone', 'triamcinolone', 'flumethasone', 'isoflupredone', 'methylprednisolone', 'corticosterone', 'cortisol', 'aldosterone']):
        return 'Corticosteroids'
    
    # Anesthetics
    if any(word in generic for word in ['lidocaine', 'bupivacaine', 'procaine', 'mepivacaine', 'ropivacaine', 'tetracaine', 'benzocaine', 'prilocaine', 'etidocaine', 'chloroprocaine', 'ketamine', 'xylazine', 'detomidine', 'romifidine', 'medetomidine', 'dexmedetomidine', 'acepromazine', 'azaperone', 'chloral hydrate', 'pentobarbital', 'thiopental', 'thiamylal', 'methohexital', 'propofol', 'etomidate', 'alfaxalone', 'guaifenesin']):
        return 'Anesthetics/Sedatives'
    
    # Antihistamines
    if any(word in generic for word in ['diphenhydramine', 'chlorpheniramine', 'promethazine', 'hydroxyzine', 'cyproheptadine', 'clemastine', 'loratadine', 'cetirizine', 'fexofenadine']):
        return 'Antihistamines'
    
    # Vitamins/Minerals
    if any(word in generic for word in ['vitamin', 'calcium', 'phosphorus', 'magnesium', 'potassium', 'sodium', 'iron', 'copper', 'zinc', 'manganese', 'cobalt', 'selenium', 'iodine']):
        return 'Vitamins & Minerals'
    
    # Hormones
    if any(word in generic for word in ['oxytocin', 'prostaglandin', 'progesterone', 'estradiol', 'testosterone', 'thyroxine', 'levothyroxine', 'propylthiouracil', 'methimazole', 'carbimazole', 'insulin', 'glucagon']):
        return 'Hormones'
    
    # Antifungals
    if any(word in generic for word in ['griseofulvin', 'ketoconazole', 'itraconazole', 'fluconazole', 'miconazole', 'clotrimazole', 'nystatin', 'amphotericin']):
        return 'Antifungals'
    
    # Others
    if 'vaccine' in indications or 'vaccin' in generic:
        return 'Vaccines'
    if 'antidote' in indications or any(word in generic for word in ['atropine', 'naloxone', 'flumazenil', 'dimercaprol', 'edetate', 'penicillamine']):
        return 'Antidotes'
    if any(word in generic for word in ['epinephrine', 'norepinephrine', 'dopamine', 'dobutamine', 'isoproterenol']):
        return 'Cardiovascular Drugs'
    
    return 'Miscellaneous'

# Add categories
for drug in drugs:
    drug['category'] = classify_drug(drug)

# Count categories
from collections import Counter
categories = Counter(d['category'] for d in drugs)
print("\nCategory counts:")
for cat, count in sorted(categories.items()):
    print(f"{cat}: {count}")

# Save updated drugs
updated_content = content.replace(drugs_json, 'const DRUG_DB = ' + json.dumps(drugs, indent=2) + ';')

with open('c:/Users/hares/.nalamvet/nalamvet-1/NALAM VET TIME STAMP 11,11.4.txt', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("\nUpdated drug database with categories.")