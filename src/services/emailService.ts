import emailjs from '@emailjs/browser';
import { Appointment, PatientMessage } from '../types';

// EmailJS Configuration — Dr. Saad Obhaya Clinic
// Free tier: 200 emails/month — works directly from browser, no server needed
const EMAILJS_SERVICE_ID = 'service_drsaad';
const EMAILJS_PUBLIC_KEY = 'dgjvKWSQp0-H5DyfC';

// Template IDs
const TEMPLATE_NEW_BOOKING = 'template_new_booking';       // Doctor notification: new patient booking
const TEMPLATE_CONFIRMATION = 'template_irq96wd';     // Patient notification: appointment confirmed

const DOCTOR_EMAIL = 'drsaadobhaya@gmail.com';
const DOCTOR_PHONE = '+92 339 6999200';

// Check if EmailJS is configured
const isEmailConfigured = !EMAILJS_PUBLIC_KEY.startsWith('YOUR_') && EMAILJS_PUBLIC_KEY.trim().length > 5;

export class EmailService {

  /**
   * FLOW 1: Patient books appointment → Email sent to Dr. Saad
   * "A new patient has booked an appointment. Please confirm or cancel."
   */
  static async sendAppointmentNotification(appointment: Appointment): Promise<{ success: boolean; message: string }> {
    if (!isEmailConfigured) {
      console.info('EmailJS not configured — appointment saved without email notification.');
      return { success: true, message: 'Appointment saved. Email notifications will activate after EmailJS setup.' };
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_NEW_BOOKING, {
        to_email: DOCTOR_EMAIL,
        doctor_name: 'Dr. Muhammad Saad Obhaya',
        patient_name: appointment.patientName,
        patient_email: appointment.patientEmail || 'Not provided',
        patient_phone: appointment.patientPhone,
        patient_age: String(appointment.age),
        patient_gender: appointment.gender,
        service_title: appointment.serviceTitle || 'General Medical Consultation',
        appointment_date: appointment.appointmentDate,
        appointment_time: appointment.appointmentTime,
        reference_no: appointment.referenceNo,
        reason: appointment.reason || 'Not specified',
        symptom_summary: appointment.symptomSummary || appointment.symptoms || 'None',
        dashboard_url: 'https://drsaadconsults.netlify.app/dashboard',
      }, EMAILJS_PUBLIC_KEY);

      console.log('✅ New booking email sent to Dr. Saad');
      return { success: true, message: 'Appointment saved & email notification sent to doctor.' };
    } catch (error) {
      console.error('Email notification error:', error);
      return { success: true, message: 'Appointment saved. Email notification failed.' };
    }
  }

  /**
   * FLOW 2: Doctor confirms appointment → Email sent to Patient
   * "Your appointment has been confirmed. Please visit at your selected time."
   */
  static async sendConfirmationEmailToPatient(appointment: Appointment): Promise<{ success: boolean }> {
    if (!isEmailConfigured) {
      console.info('EmailJS not configured — confirmation saved without email.');
      return { success: true };
    }

    // Send to patient
    if (appointment.patientEmail) {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_CONFIRMATION, {
          to_email: appointment.patientEmail,
          patient_name: appointment.patientName,
          service_title: appointment.serviceTitle || 'General Medical Consultation',
          appointment_date: appointment.appointmentDate,
          appointment_time: appointment.appointmentTime,
          reference_no: appointment.referenceNo,
          doctor_name: 'Dr. Muhammad Saad Obhaya (MBBS)',
          hospital: 'Sir Ganga Ram Hospital, Lahore',
          doctor_phone: DOCTOR_PHONE,
          track_url: 'https://drsaadconsults.netlify.app/track-appointment',
        }, EMAILJS_PUBLIC_KEY);

        console.log('✅ Confirmation email sent to patient:', appointment.patientEmail);
      } catch (error) {
        console.error('Patient confirmation email error:', error);
      }
    }

    // Also notify doctor that they confirmed
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_NEW_BOOKING, {
        to_email: DOCTOR_EMAIL,
        doctor_name: 'Dr. Muhammad Saad Obhaya',
        patient_name: appointment.patientName,
        patient_email: appointment.patientEmail || 'Not provided',
        patient_phone: appointment.patientPhone,
        patient_age: String(appointment.age),
        patient_gender: appointment.gender,
        service_title: appointment.serviceTitle || 'General Medical Consultation',
        appointment_date: appointment.appointmentDate,
        appointment_time: appointment.appointmentTime,
        reference_no: appointment.referenceNo,
        reason: `✅ CONFIRMED — ${appointment.reason || 'General consultation'}`,
        symptom_summary: 'This appointment has been confirmed by you.',
        dashboard_url: 'https://drsaadconsults.netlify.app/dashboard',
      }, EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error('Doctor confirmation copy email error:', error);
    }

    return { success: true };
  }

  /**
   * Contact form message → Email sent to Dr. Saad
   */
  static async sendContactMessageNotification(msg: PatientMessage): Promise<{ success: boolean }> {
    if (!isEmailConfigured) {
      return { success: true };
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_NEW_BOOKING, {
        to_email: DOCTOR_EMAIL,
        doctor_name: 'Dr. Muhammad Saad Obhaya',
        patient_name: msg.name,
        patient_email: msg.email,
        patient_phone: msg.phone || 'Not provided',
        patient_age: '-',
        patient_gender: '-',
        service_title: 'Contact Form Message',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '-',
        reference_no: `MSG-${Date.now()}`,
        reason: msg.subject,
        symptom_summary: msg.message,
        dashboard_url: 'https://drsaadconsults.netlify.app/dashboard',
      }, EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error('Contact message email error:', error);
    }

    return { success: true };
  }
}
