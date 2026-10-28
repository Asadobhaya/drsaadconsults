import { SymptomRule } from '../types';

export const RED_FLAG_SYMPTOMS = [
  'Severe chest pain or pressure radiating to jaw/arm',
  'Sudden severe shortness of breath or inability to speak full sentences',
  'Sudden facial drooping, arm weakness, or speech difficulty (Stroke signs)',
  'Sudden loss of consciousness or fainting',
  'Uncontrolled profuse bleeding',
  'Severe sudden abdominal pain with high fever or vomiting blood',
  'Severe allergic reaction (swollen tongue, lip, or throat tightness)',
  'Active seizure or post-seizure confusion',
  'Thoughts of self-harm or severe psychological crisis',
  'Sudden vision loss or thunderclap severe headache'
];

export const INITIAL_SYMPTOM_RULES: SymptomRule[] = [
  {
    id: 'rule-cardio-1',
    conditionName: 'Acute Coronary Syndrome / Ischemic Heart Condition',
    category: 'Cardiovascular',
    primarySymptoms: ['chest pain', 'chest tightness', 'chest pressure'],
    secondarySymptoms: ['shortness of breath', 'sweating', 'nausea', 'dizziness'],
    redFlags: ['Severe chest pain or pressure radiating to jaw/arm'],
    urgencyLevel: 'EMERGENCY',
    recommendedAction: 'Immediate transfer to the nearest Emergency Department for ECG and cardiac marker evaluation.',
    rationale: 'Chest pressure with radiation or autonomic symptoms carries serious risk of acute cardiac ischemia.',
    isEnabled: true
  },
  {
    id: 'rule-resp-1',
    conditionName: 'Acute Respiratory Infection / Bronchitis / Pneumonia',
    category: 'Respiratory',
    primarySymptoms: ['cough', 'fever', 'shortness of breath'],
    secondarySymptoms: ['sore throat', 'runny nose', 'fatigue', 'chest discomfort on deep breath'],
    redFlags: ['Sudden severe shortness of breath or inability to speak full sentences'],
    urgencyLevel: 'HIGH',
    recommendedAction: 'Medical examination recommended within 12-24 hours for auscultation and pulse oximetry.',
    rationale: 'Fever accompanied by cough and dyspnea warrants evaluation to rule out lower respiratory tract infection.',
    isEnabled: true
  },
  {
    id: 'rule-neuro-1',
    conditionName: 'Tension Headache / Migraine / Neurological Evaluation',
    category: 'Neurological',
    primarySymptoms: ['headache', 'throbbing head pain'],
    secondarySymptoms: ['sensitivity to light', 'nausea', 'neck stiffness', 'fatigue'],
    redFlags: ['Sudden facial drooping, arm weakness, or speech difficulty (Stroke signs)', 'Sudden vision loss or thunderclap severe headache'],
    urgencyLevel: 'MODERATE',
    recommendedAction: 'Schedule a general consultation for neurological evaluation and headache management.',
    rationale: 'Headaches without focal neurological deficits are commonly primary headache disorders, but warrant structured clinical review.',
    isEnabled: true
  },
  {
    id: 'rule-gastro-1',
    conditionName: 'Acute Gastritis / Dyspepsia / Gastroenteritis',
    category: 'Gastrointestinal',
    primarySymptoms: ['abdominal pain', 'nausea', 'vomiting', 'heartburn', 'diarrhea'],
    secondarySymptoms: ['bloating', 'loss of appetite', 'low-grade fever'],
    redFlags: ['Severe sudden abdominal pain with high fever or vomiting blood'],
    urgencyLevel: 'MODERATE',
    recommendedAction: 'Consult Dr. Saad for clinical assessment, hydration guidance, and acid-suppression advice.',
    rationale: 'Upper gastrointestinal symptoms often reflect gastritis or functional dyspepsia, but red flags must be ruled out.',
    isEnabled: true
  },
  {
    id: 'rule-infect-1',
    conditionName: 'Viral Febrile Illness / Seasonal Flu / General Infection',
    category: 'Infectious Disease',
    primarySymptoms: ['fever', 'body aches', 'fatigue', 'chills'],
    secondarySymptoms: ['headache', 'loss of appetite', 'mild cough'],
    redFlags: ['Uncontrolled high fever resistant to antipyretics with severe lethargy'],
    urgencyLevel: 'MODERATE',
    recommendedAction: 'Schedule a consultation for vital sign check, hydration plan, and diagnostic guidance.',
    rationale: 'Fever with generalized body aches suggests a viral syndrome, but clinical monitoring is advised if symptoms persist.',
    isEnabled: true
  },
  {
    id: 'rule-derm-1',
    conditionName: 'Allergic Dermatitis / Urticaria / Skin Rash',
    category: 'Dermatology',
    primarySymptoms: ['skin rash', 'itching', 'red skin bumps'],
    secondarySymptoms: ['dry skin', 'mild swelling'],
    redFlags: ['Severe allergic reaction (swollen tongue, lip, or throat tightness)'],
    urgencyLevel: 'LOW',
    recommendedAction: 'Schedule a routine consultation or follow-up for rash evaluation and allergy guidance.',
    rationale: 'Localized cutaneous itching and erythema without airway involvement indicate mild dermatological reaction.',
    isEnabled: true
  }
];
