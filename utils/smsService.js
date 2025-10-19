const twilio = require("twilio");

const sendSMS = async (payload) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.ALERT_TO_PHONE;

  if (
    !sid ||
    !token ||
    !from ||
    !to ||
    sid === "" ||
    token === "" ||
    from === ""
  ) {
    console.warn("SMS configuration missing or empty - skipping SMS");
    return false;
  }

  try {
    const client = new twilio(sid, token);
    await client.messages.create({
      body: `New Portfolio Contact\nName: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\nMessage: ${payload.message}`,
      from,
      to,
    });

    console.log("SMS sent successfully");
    return true;
  } catch (error) {
    console.error("SMS send failed:", error.message);
    return false;
  }
};

module.exports = { sendSMS };
