export const getCancellationTemplate = (name: string, date: string, reason: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0f2fe; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #0ea5e9; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Cancelled</h1>
    </div>
    <div style="padding: 30px; background-color: #ffffff;">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your appointment on <strong>${date}</strong> has been cancelled.</p>
      <div style="background-color: #fff1f2; border-left: 4px solid #f43f5e; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #9f1239;">Reason for Cancellation:</p>
        <p style="margin: 5px 0 0 0; color: #be123c;">${reason}</p>
      </div>
      <p>Please visit our website to book a new time slot.</p>
    </div>
  </div>
`;
// Add this to lib/email-templates.ts

export const getConfirmationTemplate = (fullName: string, date: string, time: string) => {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #10b981; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Confirmed!</h1>
      </div>
      
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #1e293b;">Hello <strong>${fullName}</strong>,</p>
        
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Your dental appointment has been officially <strong>Confirmed</strong>. We look forward to seeing you soon!
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #166534; font-size: 14px; text-transform: uppercase;">Appointment Details</p>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #14532d;">${date} at ${time}</p>
        </div>

        <p style="font-size: 14px; color: #64748b;">
          If you need to change your appointment, please contact us at least 24 hours in advance.
        </p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
        <p><strong>Smile Hub Dental Clinic</strong></p>
        <p>Your Health, Our Priority.</p>
      </div>
    </div>
  `;
};