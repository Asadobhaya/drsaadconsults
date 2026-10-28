import { SymptomAssessmentInput, SymptomAssessmentResult, SymptomRule, UrgencyLevel } from '../../types';
import { RED_FLAG_SYMPTOMS } from '../../data/symptomRules';
import { DataService } from '../../services/dataService';

export class SymptomEngine {

  /**
   * Evaluates patient symptom inputs against clinical triage rules.
   */
  static async evaluate(input: SymptomAssessmentInput): Promise<SymptomAssessmentResult> {
    const rules = await DataService.getSymptomRules();
    const activeRules = rules.filter(r => r.isEnabled);

    // 1. Red-Flag Check
    const detectedRedFlags: string[] = [];
    
    // Check primary concern and symptoms list for red flag matches
    input.symptoms.forEach(sym => {
      const match = RED_FLAG_SYMPTOMS.find(rf => 
        sym.toLowerCase().includes(rf.toLowerCase()) || 
        rf.toLowerCase().includes(sym.toLowerCase())
      );
      if (match && !detectedRedFlags.includes(match)) {
        detectedRedFlags.push(match);
      }
    });

    if (input.severity === 'severe' && input.onset === 'sudden') {
      if (!detectedRedFlags.some(rf => rf.includes('severe sudden'))) {
        detectedRedFlags.push('Sudden severe onset of severe symptoms');
      }
    }

    const isEmergency = detectedRedFlags.length > 0;

    if (isEmergency) {
      return {
        id: `eval-${Date.now()}`,
        input,
        urgencyLevel: 'EMERGENCY',
        isEmergency: true,
        emergencyReason: `Emergency red-flag indicators detected: ${detectedRedFlags.join(', ')}`,
        possibleConditions: [],
        redFlagsDetected: detectedRedFlags,
        recommendedAction: 'STOP: Your reported symptoms indicate a potential medical emergency. Seek immediate emergency medical care or call local emergency medical services right now. Do NOT wait for an online consultation.',
        questionsForDoctor: [
          'What immediate emergency stabilization is required?',
          'What acute hospital evaluation tests are indicated?'
        ],
        createdAt: new Date().toISOString(),
      };
    }

    // 2. Condition Pattern Matching
    const matchedConditions: { name: string; likelihood: 'Common possibility' | 'Possible' | 'Less likely'; rationale: string; urgency: UrgencyLevel }[] = [];

    const userSymptomText = [input.primaryConcern, ...input.symptoms].join(' ').toLowerCase();

    activeRules.forEach(rule => {
      let score = 0;
      
      // Match primary symptoms
      rule.primarySymptoms.forEach(ps => {
        if (userSymptomText.includes(ps.toLowerCase())) {
          score += 3;
        }
      });

      // Match secondary symptoms
      rule.secondarySymptoms.forEach(ss => {
        if (userSymptomText.includes(ss.toLowerCase())) {
          score += 1;
        }
      });

      if (score >= 3) {
        matchedConditions.push({
          name: rule.conditionName,
          likelihood: score >= 5 ? 'Common possibility' : 'Possible',
          rationale: `${rule.rationale} Matches reported symptoms including ${rule.primarySymptoms.filter(ps => userSymptomText.includes(ps.toLowerCase())).join(', ')}.`,
          urgency: rule.urgencyLevel,
        });
      } else if (score >= 1) {
        matchedConditions.push({
          name: rule.conditionName,
          likelihood: 'Less likely',
          rationale: `Partial symptom overlap with ${rule.secondarySymptoms.filter(ss => userSymptomText.includes(ss.toLowerCase())).join(', ')}.`,
          urgency: rule.urgencyLevel,
        });
      }
    });

    // Determine Overall Urgency Level
    let overallUrgency: UrgencyLevel = 'LOW';
    if (matchedConditions.some(m => m.urgency === 'HIGH') || input.severity === 'severe') {
      overallUrgency = 'HIGH';
    } else if (matchedConditions.some(m => m.urgency === 'MODERATE') || input.severity === 'moderate') {
      overallUrgency = 'MODERATE';
    }

    const defaultAction = overallUrgency === 'HIGH'
      ? 'An evaluation within 24 hours with Dr. Saad Obhaya is recommended.'
      : overallUrgency === 'MODERATE'
      ? 'Schedule a medical consultation with Dr. Saad Obhaya to evaluate these symptoms.'
      : 'Routine general consultation or clinical follow-up is appropriate.';

    const questionsForDoctor = [
      `What could be causing my ${input.primaryConcern || 'symptoms'}?`,
      'Are there specific diagnostic tests or lab work I should undergo?',
      'What symptoms should I monitor that might indicate worsening?',
      'Are there lifestyle or dietary modifications that would help my recovery?'
    ];

    return {
      id: `eval-${Date.now()}`,
      input,
      urgencyLevel: overallUrgency,
      isEmergency: false,
      possibleConditions: matchedConditions.map(m => ({
        name: m.name,
        likelihood: m.likelihood,
        rationale: m.rationale,
      })),
      redFlagsDetected: [],
      recommendedAction: defaultAction,
      questionsForDoctor,
      createdAt: new Date().toISOString(),
    };
  }
}
