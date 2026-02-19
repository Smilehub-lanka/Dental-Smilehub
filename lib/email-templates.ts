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