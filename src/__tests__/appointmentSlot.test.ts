import { describe, it, expect } from 'vitest';
import { DataService } from '../services/dataService';

describe('Appointment Timing & Slot Availability', () => {

  it('should generate PKT slots covering 8:00 AM - 2:00 PM and 7:00 PM - 10:00 PM', async () => {
    // Pick a Monday date in future
    const mondayStr = '2026-08-17';
    const slots = await DataService.getAvailableSlotsForDate(mondayStr);
    expect(Array.isArray(slots)).toBe(true);
    expect(slots.length).toBeGreaterThan(0);

    // Verify morning slots (08:00 to 14:00)
    expect(slots).toContain('08:00');
    expect(slots).toContain('14:00');

    // Verify evening slots (19:00 to 22:00)
    expect(slots).toContain('19:00');
    expect(slots).toContain('22:00');

    // Verify times outside clinic hours are NOT in slots
    expect(slots).not.toContain('03:00');
    expect(slots).not.toContain('15:00');
    expect(slots).not.toContain('23:00');
  });

  it('should validate clinic consultation hours correctly', () => {
    // Valid times
    expect(DataService.isTimeInClinicHours('08:00')).toBe(true);
    expect(DataService.isTimeInClinicHours('11:30')).toBe(true);
    expect(DataService.isTimeInClinicHours('14:00')).toBe(true);
    expect(DataService.isTimeInClinicHours('19:00')).toBe(true);
    expect(DataService.isTimeInClinicHours('21:15')).toBe(true);
    expect(DataService.isTimeInClinicHours('22:00')).toBe(true);

    // Invalid times outside 8am-2pm and 7pm-10pm
    expect(DataService.isTimeInClinicHours('07:30')).toBe(false);
    expect(DataService.isTimeInClinicHours('15:00')).toBe(false);
    expect(DataService.isTimeInClinicHours('18:59')).toBe(false);
    expect(DataService.isTimeInClinicHours('22:30')).toBe(false);
  });

  it('should allow multiple patient bookings without artificially limiting slots', async () => {
    const testDate = '2026-08-18';
    const testTime = '09:00';

    const res1 = await DataService.createAppointment({
      patientName: 'Patient One',
      patientEmail: 'patient1@example.com',
      patientPhone: '+923001111111',
      age: 28,
      gender: 'male',
      serviceId: 'srv-1',
      serviceTitle: 'General Consultation',
      appointmentDate: testDate,
      appointmentTime: testTime,
      reason: 'General checkup',
    });

    expect(res1.success).toBe(true);

    // Second patient booking the same slot
    const res2 = await DataService.createAppointment({
      patientName: 'Patient Two',
      patientEmail: 'patient2@example.com',
      patientPhone: '+923002222222',
      age: 35,
      gender: 'female',
      serviceId: 'srv-1',
      serviceTitle: 'General Consultation',
      appointmentDate: testDate,
      appointmentTime: testTime,
      reason: 'Follow-up checkup',
    });

    expect(res2.success).toBe(true);

    // Slot remains in available slots list
    const openSlots = await DataService.getAvailableSlotsForDate(testDate);
    expect(openSlots).toContain(testTime);
  });

  it('should return empty array for blocked dates', async () => {
    const blockDateStr = '2026-08-20';
    await DataService.toggleBlockDate(blockDateStr, 'Holiday');
    const slots = await DataService.getAvailableSlotsForDate(blockDateStr);
    expect(slots.length).toBe(0);
    // Cleanup
    await DataService.toggleBlockDate(blockDateStr, 'Holiday');
  });

});
