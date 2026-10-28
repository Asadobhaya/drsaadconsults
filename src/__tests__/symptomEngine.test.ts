import { describe, it, expect } from 'vitest';
import { SymptomEngine } from '../features/symptoms/symptomEngine';
import { SymptomAssessmentInput } from '../types';

describe('SymptomEngine Triage Evaluation', () => {

  it('should trigger EMERGENCY red flag for crushing chest pain', async () => {
    const input: SymptomAssessmentInput = {
      age: 45,
      gender: 'male',
      primaryConcern: 'Severe chest pain radiating to jaw',
      symptoms: ['Severe chest pain or pressure radiating to jaw/arm', 'Sweating'],
      duration: 'Less than 24 hours',
      severity: 'severe',
      onset: 'sudden',
    };

    const result = await SymptomEngine.evaluate(input);
    expect(result.urgencyLevel).toBe('EMERGENCY');
    expect(result.isEmergency).toBe(true);
    expect(result.redFlagsDetected.length).toBeGreaterThan(0);
    expect(result.recommendedAction).toContain('STOP');
  });

  it('should classify respiratory symptoms as HIGH or MODERATE urgency', async () => {
    const input: SymptomAssessmentInput = {
      age: 28,
      gender: 'female',
      primaryConcern: 'Cough and fever for 3 days',
      symptoms: ['Cough', 'Fever / Chills'],
      duration: '2-3 days',
      severity: 'moderate',
      onset: 'gradual',
    };

    const result = await SymptomEngine.evaluate(input);
    expect(result.isEmergency).toBe(false);
    expect(['MODERATE', 'HIGH']).toContain(result.urgencyLevel);
    expect(result.possibleConditions.length).toBeGreaterThan(0);
  });

});
