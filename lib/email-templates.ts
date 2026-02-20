// lib/email-templates.ts

// Helper for the main brand color (oklch(0.65 0.19 200) approximated to Hex)
const BRAND_COLOR = '#32B5C8';
const LOGO_URL = 'https://github.com/nngeek195/Dental-Smilehub/blob/master/public/Logo.png?raw=true';

// Shared Email Footer
const emailFooter = `
  <tr>
    <td style="background-color: #1e293b; padding: 40px 30px; text-align: center;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto;">
        <tr>
          <td align="center" style="padding-bottom: 20px;">
            <img src="${LOGO_URL}" alt="Smile Hub Logo" style="height: 40px; width: auto; filter: brightness(0) invert(1);" />
          </td>
        </tr>
        <tr>
          <td align="center" style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #e2e8f0;">Smile Hub Dental Clinic</strong><br/>
              Hokandara Road, Athurugiriya, Sri Lanka
            </p>
            <p style="margin: 0 0 15px 0;">
              📞 +94 77 742 1620 &nbsp;|&nbsp; ✉️ mkovitigala@gmail.com
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 10px;">
            <a href="https://www.facebook.com/share/17kkBqsLRr/" style="margin: 0 8px; text-decoration: none; color: #94a3b8;">Facebook</a>
            <a href="https://www.instagram.com/the_smile_hub_?igsh=MnF6ZTEyeG40Mm4=" style="margin: 0 8px; text-decoration: none; color: #94a3b8;">Instagram</a>
            <a href="https://wa.me/94777421620" style="margin: 0 8px; text-decoration: none; color: #94a3b8;">WhatsApp</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 20px; color: #64748b; font-size: 12px;">
            © ${new Date().getFullYear()} Smile Hub. All rights reserved.<br/>
            Made with ❤️ for better smiles.
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

export const getCancellationTemplate = (name: string, date: string, reason: string) => `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
      <!-- Header -->
      <tr>
        <td style="background-color: ${BRAND_COLOR}; padding: 30px; text-align: center;">
          <img src="${LOGO_URL}" alt="Smile Hub Logo" style="height: 40px; margin-bottom: 15px;" />
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Appointment Cancelled</h1>
        </td>
      </tr>
      
      <!-- Body -->
      <tr>
        <td style="padding: 40px 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 10px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">
            We regret to inform you that your appointment scheduled for <strong>${date}</strong> has been cancelled.
          </p>
          
          <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-weight: 600; color: #9f1239; font-size: 14px;">REASON FOR CANCELLATION</p>
            <p style="margin: 8px 0 0 0; color: #be123c; font-size: 16px;">${reason}</p>
          </div>
          
          <p style="font-size: 15px; color: #475569; line-height: 1.6;">
            We apologize for any inconvenience this may cause. Please visit our website to book a new appointment at your convenience.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
             <a href="https://your-website-url.com/#appointment" style="background-color: ${BRAND_COLOR}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Book New Appointment</a>
          </div>
        </td>
      </tr>

      ${emailFooter}
    </table>
  </div>
`;

export const getConfirmationTemplate = (fullName: string, date: string, time: string) => {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <!-- Header -->
        <tr>
          <td style="background-color: ${BRAND_COLOR}; padding: 30px; text-align: center;">
            <img src="${LOGO_URL}" alt="Smile Hub Logo" style="height: 40px; margin-bottom: 15px;" />
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Appointment Confirmed!</h1>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding: 40px 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 10px;">Hello <strong>${fullName}</strong>,</p>
            
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Great news! Your dental appointment has been officially <strong style="color: ${BRAND_COLOR};">Confirmed</strong>. We are looking forward to seeing you soon.
            </p>
            
            <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 25px; margin: 30px 0; border-radius: 12px; text-align: center;">
                <p style="margin: 0; color: #0d9488; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">APPOINTMENT DETAILS</p>
                <p style="margin: 10px 0 0 0; font-size: 22px; font-weight: 700; color: #134e4a;">${date}</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 600; color: ${BRAND_COLOR};">${time}</p>
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
              📍 <strong>Location:</strong> Smile Hub Dental Clinic<br/>
              ⏰ <strong>Reminders:</strong> Please arrive 10 minutes early. If you need to change your appointment, contact us at least 24 hours in advance.
            </p>
          </td>
        </tr>

        ${emailFooter}
      </table>
    </div>
  `;
};