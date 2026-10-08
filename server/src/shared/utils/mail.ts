import net from "node:net";
import tls from "node:tls";

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string | undefined;
}

export interface EnquiryReceivedMailOptions {
  to: string;
  fullName: string;
  enquiryId: string;
  subject: string;
  message: string;
}

export interface EnquiryReplyMailOptions {
  to: string;
  fullName: string;
  enquiryId: string;
  replySubject: string;
  replyMessage: string;
  originalSubject?: string | undefined;
  originalMessage?: string | undefined;
}

/**
 * Sends a raw SMTP email using Node.js built-in net/tls.
 */
async function sendRawSmtpEmail({
  host,
  port,
  secure,
  user,
  pass,
  from,
  to,
  subject,
  text,
  html,
}: {
  host: string;
  port: number;
  secure: boolean;
  user?: string | undefined;
  pass?: string | undefined;
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string | undefined;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let socket: net.Socket;

    const onConnect = () => {
      let state = 0;
      let buffer = "";

      const send = (cmd: string) => {
        socket.write(cmd + "\r\n");
      };

      socket.on("data", (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split("\r\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const code = parseInt(line.substring(0, 3), 10);
          if (line.charAt(3) === "-") continue; // multiline response continuation

          if (state === 0 && code === 220) {
            state = 1;
            send("EHLO localhost");
          } else if (state === 1 && code === 250) {
            if (user && pass) {
              state = 2;
              send("AUTH LOGIN");
            } else {
              state = 4;
              send(`MAIL FROM:<${from}>`);
            }
          } else if (state === 2 && code === 334) {
            state = 3;
            send(Buffer.from(user ?? "").toString("base64"));
          } else if (state === 3 && code === 334) {
            state = 4;
            send(Buffer.from(pass ?? "").toString("base64"));
          } else if (state === 4 && (code === 235 || code === 250)) {
            state = 5;
            send(`MAIL FROM:<${from}>`);
          } else if (state === 5 && code === 250) {
            state = 6;
            send(`RCPT TO:<${to}>`);
          } else if (state === 6 && code === 250) {
            state = 7;
            send("DATA");
          } else if (state === 7 && code === 354) {
            state = 8;
            const boundary = "----=_Part_" + Date.now();
            const mimeMessage = [
              `From: ${from}`,
              `To: ${to}`,
              `Subject: ${subject}`,
              "MIME-Version: 1.0",
              `Content-Type: multipart/alternative; boundary="${boundary}"`,
              "",
              `--${boundary}`,
              "Content-Type: text/plain; charset=utf-8",
              "Content-Transfer-Encoding: 7bit",
              "",
              text,
              "",
              ...(html
                ? [
                    `--${boundary}`,
                    "Content-Type: text/html; charset=utf-8",
                    "Content-Transfer-Encoding: 7bit",
                    "",
                    html,
                    "",
                  ]
                : []),
              `--${boundary}--`,
              ".",
            ].join("\r\n");
            send(mimeMessage);
          } else if (state === 8 && code === 250) {
            state = 9;
            send("QUIT");
          } else if (state === 9 && code === 221) {
            socket.end();
            resolve(true);
          } else if (code >= 400) {
            socket.end();
            reject(new Error(`SMTP error ${code}: ${line}`));
          }
        }
      });
    };

    if (secure || port === 465) {
      socket = tls.connect({ host, port, minVersion: "TLSv1.2" }, onConnect);
    } else {
      socket = net.connect({ host, port }, onConnect);
    }

    socket.setTimeout(15000, () => {
      socket.destroy();
      reject(new Error("SMTP connection timed out"));
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Universal email sender.
 * Uses SMTP (if configured), Resend (if configured), or logs to console in development.
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : 587;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  const smtpFrom =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    `"IronParadise" <${smtpUser || "noreply@ironparadise.com"}>`;

  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Resend API
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: smtpFrom,
          to,
          subject,
          text,
          ...(html ? { html } : {}),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API error: ${response.status} - ${errorText}`);
      }

      console.log(`[MailService] Email successfully sent to ${to} via Resend`);
      return true;
    } catch (error) {
      console.error("[MailService] Failed to send email via Resend:", error);
    }
  }

  // 2. Direct SMTP
  if (smtpHost) {
    try {
      await sendRawSmtpEmail({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        user: smtpUser,
        pass: smtpPass,
        from: smtpFrom,
        to,
        subject,
        text,
        html,
      });

      console.log(`[MailService] Email successfully sent to ${to} via SMTP`);
      return true;
    } catch (error) {
      console.error("[MailService] Failed to send email via SMTP:", error);
    }
  }

  // 3. Fallback: Log to console in development
  console.log(
    `\n======================================================\n` +
      `[MailService] 📧 Email to: ${to}\n` +
      `Subject: ${subject}\n` +
      `------------------------------------------------------\n` +
      `${text}\n` +
      `======================================================\n`,
  );

  return true;
}

/**
 * Sends an enquiry receipt confirmation email to the user.
 */
export async function sendEnquiryReceivedEmail({
  to,
  fullName,
  enquiryId,
  subject,
  message,
}: EnquiryReceivedMailOptions): Promise<boolean> {
  const emailSubject = `Enquiry Received: ${subject} [${enquiryId}]`;
  const textContent =
    `Hello ${fullName},\n\n` +
    `Thank you for contacting IronParadise!\n\n` +
    `We have received your enquiry regarding "${subject}".\n` +
    `Your Enquiry Reference ID is: ${enquiryId}\n\n` +
    `Your Message:\n"${message}"\n\n` +
    `Our team is reviewing your message and will get back to you shortly.\n\n` +
    `Warm regards,\n` +
    `IronParadise Support Team`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">IronParadise</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">We have received your enquiry</p>
      </div>
      <div style="padding: 32px 24px; color: #334155; line-height: 1.6;">
        <p style="margin-top: 0; font-size: 16px;">Hello <strong>${fullName}</strong>,</p>
        <p style="font-size: 15px; color: #475569;">
          Thank you for reaching out to us. We have successfully logged your enquiry and our team will get in touch with you shortly.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Enquiry Reference</p>
          <p style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #4f46e5;">${enquiryId}</p>
          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Subject</p>
          <p style="margin: 0 0 16px; font-size: 15px; font-weight: 600; color: #1e293b;">${subject}</p>
          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Your Message</p>
          <p style="margin: 0; font-size: 14px; color: #475569; white-space: pre-wrap; font-style: italic;">"${message}"</p>
        </div>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
          If you have any further questions, simply reply to this email or reach us through our contact portal.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        © ${new Date().getFullYear()} IronParadise Fitness. All rights reserved.
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  });
}

/**
 * Sends a reply email from the admin to the user.
 */
export async function sendEnquiryReplyEmail({
  to,
  fullName,
  enquiryId,
  replySubject,
  replyMessage,
  originalSubject,
  originalMessage,
}: EnquiryReplyMailOptions): Promise<boolean> {
  const emailSubject = `Re: ${replySubject} [${enquiryId}]`;
  const textContent =
    `Hello ${fullName},\n\n` +
    `${replyMessage}\n\n` +
    `--------------------------------------------------\n` +
    `Enquiry ID: ${enquiryId}\n` +
    (originalSubject ? `Original Subject: ${originalSubject}\n` : "") +
    (originalMessage ? `Original Message:\n"${originalMessage}"\n` : "") +
    `--------------------------------------------------\n\n` +
    `Best regards,\n` +
    `IronParadise Support Team`;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">IronParadise</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Response to your enquiry [${enquiryId}]</p>
      </div>
      <div style="padding: 32px 24px; color: #334155; line-height: 1.6;">
        <p style="margin-top: 0; font-size: 16px;">Hello <strong>${fullName}</strong>,</p>
        <div style="background-color: #eef2ff; border-left: 4px solid #6366f1; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 10px; font-size: 16px; font-weight: 700; color: #312e81;">${replySubject}</h3>
          <p style="margin: 0; font-size: 15px; color: #1e1b4b; white-space: pre-wrap;">${replyMessage}</p>
        </div>
        ${
          originalMessage
            ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b;">Original Enquiry</p>
          ${originalSubject ? `<p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #334155;">${originalSubject}</p>` : ""}
          <p style="margin: 0; font-size: 13px; color: #64748b; font-style: italic;">"${originalMessage}"</p>
        </div>
        `
            : ""
        }
        <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
          Thank you for choosing IronParadise! Feel free to reach out if you have any further questions.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        © ${new Date().getFullYear()} IronParadise Fitness. All rights reserved.
      </div>
    </div>
  `;

  return await sendEmail({
    to,
    subject: emailSubject,
    text: textContent,
    html: htmlContent,
  });
}
