// Netlify Serverless Function for dispatching Resend Emails safely from server-side (bypasses browser CORS & API key exposure)

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';
    const doctorEmail = 'drsaadobhaya@gmail.com';

    if (!resendApiKey) {
      console.log('[Serverless Email Handler] No API Key set. Payload:', payload);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Saved to dashboard. Email key unconfigured on server.' })
      };
    }

    let emailSubject = '';
    let emailContent = '';
    let recipients = [doctorEmail];

    if (payload.type === 'confirmation') {
      emailSubject = `Appointment Confirmed — Dr. Muhammad Saad Obhaya (${payload.referenceNo})`;
      if (payload.patientEmail) {
        recipients.push(payload.patientEmail);
      }
      emailContent = `
Dear ${payload.patientName},

Your consultation appointment with Dr. Muhammad Saad Obhaya (MBBS) has been CONFIRMED.

Appointment Details:
------------------------------------
Reference ID: ${payload.referenceNo}
Doctor: Dr. Muhammad Saad Obhaya (MBBS)
Service: ${payload.serviceTitle}
Date: ${payload.appointmentDate}
Time: ${payload.appointmentTime} (PST)
Venue: Sir Ganga Ram Hospital, Lahore / Online Consultation
------------------------------------

For any inquiries or adjustments, please contact +92 339 6999200 or reply to this email.

Best regards,
Dr. Muhammad Saad Obhaya Clinic
      `.trim();
    } else if (payload.type === 'appointment') {
      emailSubject = `New Appointment Request — ${payload.referenceNo}`;
      emailContent = `
NEW APPOINTMENT REQUEST
------------------------------------
Ref ID: ${payload.referenceNo}
Doctor: Dr. Muhammad Saad Obhaya (MBBS)

Patient: ${payload.patientName} (${payload.age} yrs, ${payload.gender})
Phone: ${payload.patientPhone}
Email: ${payload.patientEmail}

Service: ${payload.serviceTitle}
Date & Time: ${payload.appointmentDate} @ ${payload.appointmentTime} PST

Reason: ${payload.reason}
Symptom Summary: ${payload.symptomSummary || 'None'}
------------------------------------
      `.trim();
    } else {
      emailSubject = `New Patient Message — ${payload.name}`;
      emailContent = `
NEW PATIENT CONTACT MESSAGE
------------------------------------
From: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Subject: ${payload.subject}

Message:
${payload.message}
------------------------------------
      `.trim();
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Dr. Saad Clinic <onboarding@resend.dev>',
        to: [...new Set(recipients)],
        subject: emailSubject,
        text: emailContent,
      }),
    });

    const resData = await res.json();
    if (res.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: resData })
      };
    } else {
      console.error('Resend server error:', resData);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: resData })
      };
    }
  } catch (err) {
    console.error('Serverless function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}
