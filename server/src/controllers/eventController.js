const moment = require("moment");
const cron = require("node-cron");
const Event = require("../models/Event");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const { sendMail } = require("../service/emailService");

// Fetch all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json({ message: "Events Fetched", events: events });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//send Batch Email
const sendEmail = async (eventData) => {
  const trainers = await Trainer.find();
  const members = await Member.find();

  if (eventData.access === "all" || eventData.access === "trainer") {
    trainers.forEach((trainer) => {
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Message from Iron Paradise Admin</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
                  color: #333333;
              }
              .container {
                  max-width: 700px;
                  margin: auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 60px 20px;
                  background-image: url("https://media.istockphoto.com/id/1369897943/photo/focus-on-disc-close-up-shot-hands-adding-weight-to-barbell-rod-at-gym-concept-of-fitness.jpg?s=612x612&w=0&k=20&c=H0fxQoJGyMv9npWuD42R6xiG8JUpqZNPbp4dLWh7B7k=");
                  background-size: cover;
                  background-position: center;
                  color: #ffffff;
                  text-shadow: 5px 5px 10px black;
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
                  position: relative;
                  overflow: hidden;
              }
              .header h1 {
                  margin: 0;
                  font-size: 36px;
                  font-weight: bold;
                  position: relative;
                  z-index: 1;
                  text-transform: uppercase;
              }
              .content {
                  padding: 20px;
                  background-color: #f9f9f9;
              }
              h2 {
                  color: gray;
                  font-size: 28px;
                  margin-top: 0;
              }
              p {
                  font-size: 16px;
                  color: #555555;
                  line-height: 1.6;
                  margin: 0 0 15px;
              }
              a {
                  color: black;
                  text-decoration: none;
                  font-weight: bold;
              }
              a:hover {
                  text-decoration: underline;
              }
              .footer {
                  background-color: #eeeeee;
                  padding: 20px;
                  border-top: 1px solid #ddd;
                  border-bottom-left-radius: 8px;
                  border-bottom-right-radius: 8px;
              }
              .footer h2 {
                  color: black;
                  font-size: 20px;
                  margin: 0 0 10px;
              }
              .footer p {
                  font-size: 14px;
                  color: #666666;
                  margin: 0 0 10px;
              }
              .footer ul {
                  padding: 0;
                  list-style: none;
                  margin: 0;
              }
              .footer li {
                  margin-bottom: 10px;
              }
              .footer .socials {
                  text-align: center;
                  margin-top: 20px;
              }
              .footer .socials a {
                  color: gray;
                  text-decoration: none;
                  margin: 0 12px;
                  font-size: 24px;
              }
              .footer .socials a:hover {
                  color: black;
              }
              .fa {
                  margin-right: 8px;
              }
          </style>
          <!-- FontAwesome -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>

      <body>
          <div class="container">
              <div class="header">
                  <h1>Iron Paradise</h1>
              </div>
              <div class="content">
                  <h2>Hello, ${trainer.name}!</h2>
                  <p>${eventData.name}</p><br />
                  <p>${eventData.description}</p>
                  <p>Sincerely,<br />Iron Paradise Admin</p>
              </div>
              <div class="footer">
                  <div class="section">
                      <h2>Contact Information</h2>
                      <p><strong>Iron Paradise</strong></p>
                      <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                      <p>Phone: 6383 580 365</p>
                  </div>
                  <div class="section">
                      <h2>Support</h2>
                      <p>If you need assistance, please contact our support team:</p>
                      <p>Email: <a href="mailto:support@ironparadise.com">support@ironparadise.com</a></p>
                      <p>Phone: +91 6584 857 496</p>
                  </div>
                  <div class="section">
                      <h2>Follow Us</h2>
                      <p>Connect with us on social media for updates and news:</p>
                      <div class="socials">
                          <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                          <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                          <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                          <a href="https://www.tiktok.com" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                          <a href="https://wa.me/6584857496" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`;
      sendMail(trainer.email, "Mail From Iron Paradise", html);
    });
  }

  if (eventData.access === "all" || eventData.access === "member") {
    members.forEach((member) => {
      const html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Message from Iron Paradise Admin</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
                  color: #333333;
              }
              .container {
                  max-width: 700px;
                  margin: auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 60px 20px;
                  background-image: url("https://media.istockphoto.com/id/1369897943/photo/focus-on-disc-close-up-shot-hands-adding-weight-to-barbell-rod-at-gym-concept-of-fitness.jpg?s=612x612&w=0&k=20&c=H0fxQoJGyMv9npWuD42R6xiG8JUpqZNPbp4dLWh7B7k=");
                  background-size: cover;
                  background-position: center;
                  color: #ffffff;
                  text-shadow: 5px 5px 10px black;
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
                  position: relative;
                  overflow: hidden;
              }
              .header h1 {
                  margin: 0;
                  font-size: 36px;
                  font-weight: bold;
                  position: relative;
                  z-index: 1;
                  text-transform: uppercase;
              }
              .content {
                  padding: 20px;
                  background-color: #f9f9f9;
              }
              h2 {
                  color: gray;
                  font-size: 28px;
                  margin-top: 0;
              }
              p {
                  font-size: 16px;
                  color: #555555;
                  line-height: 1.6;
                  margin: 0 0 15px;
              }
              a {
                  color: black;
                  text-decoration: none;
                  font-weight: bold;
              }
              a:hover {
                  text-decoration: underline;
              }
              .footer {
                  background-color: #eeeeee;
                  padding: 20px;
                  border-top: 1px solid #ddd;
                  border-bottom-left-radius: 8px;
                  border-bottom-right-radius: 8px;
              }
              .footer h2 {
                  color: black;
                  font-size: 20px;
                  margin: 0 0 10px;
              }
              .footer p {
                  font-size: 14px;
                  color: #666666;
                  margin: 0 0 10px;
              }
              .footer ul {
                  padding: 0;
                  list-style: none;
                  margin: 0;
              }
              .footer li {
                  margin-bottom: 10px;
              }
              .footer .socials {
                  text-align: center;
                  margin-top: 20px;
              }
              .footer .socials a {
                  color: gray;
                  text-decoration: none;
                  margin: 0 12px;
                  font-size: 24px;
              }
              .footer .socials a:hover {
                  color: black;
              }
              .fa {
                  margin-right: 8px;
              }
          </style>
          <!-- FontAwesome -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>

      <body>
          <div class="container">
              <div class="header">
                  <h1>Iron Paradise</h1>
              </div>
              <div class="content">
                  <h2>Hello, ${member.name}!</h2>
                  <p>${eventData.name}</p><br />
                  <p>${eventData.description}</p>
                  <p>Sincerely,<br />Iron Paradise Admin</p>
              </div>
              <div class="footer">
                  <div class="section">
                      <h2>Contact Information</h2>
                      <p><strong>Iron Paradise</strong></p>
                      <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                      <p>Phone: 6383 580 365</p>
                  </div>
                  <div class="section">
                      <h2>Support</h2>
                      <p>If you need assistance, please contact our support team:</p>
                      <p>Email: <a href="mailto:support@ironparadise.com">support@ironparadise.com</a></p>
                      <p>Phone: +91 6584 857 496</p>
                  </div>
                  <div class="section">
                      <h2>Follow Us</h2>
                      <p>Connect with us on social media for updates and news:</p>
                      <div class="socials">
                          <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                          <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                          <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                          <a href="https://www.tiktok.com" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                          <a href="https://wa.me/6584857496" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>`;
      sendMail(member.email, "Event Mail From Iron Paradise", html);
    });
  }
};

// Subscription Expired
const MailPast = async (member) => {
  try {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Message from Iron Paradise Admin</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
            color: #333333;
        }
        .container {
            max-width: 700px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 60px 20px;
            background-image: url("https://media.istockphoto.com/id/1369897943/photo/focus-on-disc-close-up-shot-hands-adding-weight-to-barbell-rod-at-gym-concept-of-fitness.jpg?s=612x612&w=0&k=20&c=H0fxQoJGyMv9npWuD42R6xiG8JUpqZNPbp4dLWh7B7k=");
            background-size: cover;
            background-position: center;
            color: #ffffff;
            text-shadow: 5px 5px 10px black;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            position: relative;
            overflow: hidden;
        }
        .header h1 {
            margin: 0;
            font-size: 36px;
            font-weight: bold;
            position: relative;
            z-index: 1;
            text-transform: uppercase;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }
        h2 {
            color: gray;
            font-size: 28px;
            margin-top: 0;
        }
        p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
            margin: 0 0 15px;
        }
        a {
            color: black;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            background-color: #eeeeee;
            padding: 20px;
            border-top: 1px solid #ddd;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        .footer h2 {
            color: black;
            font-size: 20px;
            margin: 0 0 10px;
        }
        .footer p {
            font-size: 14px;
            color: #666666;
            margin: 0 0 10px;
        }
        .footer ul {
            padding: 0;
            list-style: none;
            margin: 0;
        }
        .footer li {
            margin-bottom: 10px;
        }
        .footer .socials {
            text-align: center;
            margin-top: 20px;
        }
        .footer .socials a {
            color: gray;
            text-decoration: none;
            margin: 0 12px;
            font-size: 24px;
        }
        .footer .socials a:hover {
            color: black;
        }
        .fa {
            margin-right: 8px;
        }
    </style>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Iron Paradise</h1>
        </div>
        <div class="content">
            <h2>Hello, ${member.name}!</h2>
            <p>We hope you're enjoying your journey with Iron Paradise!</p>
            <p>Your subscription plan of <strong>₹${member.subscription.planCost}</strong> has ended on <strong>${member.subscription.endDate}</strong>.</p>
            <p>To continue accessing all the benefits, please renew your subscription at your earliest convenience.</p>
            <p>If you have any questions or need assistance with renewing, feel free to contact us!</p>
            <p>Sincerely,<br />Iron Paradise Admin</p>
        </div>
        <div class="footer">
            <div class="section">
                <h2>Contact Information</h2>
                <p><strong>Iron Paradise</strong></p>
                <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                <p>Phone: 6383 580 365</p>
            </div>
            <div class="section">
                <h2>Support</h2>
                <p>If you need assistance, please contact our support team:</p>
                <p>Email: <a href="mailto:support@ironparadise.com">support@ironparadise.com</a></p>
                <p>Phone: +91 6584 857 496</p>
            </div>
            <div class="section">
                <h2>Follow Us</h2>
                <p>Connect with us on social media for updates and news:</p>
                <div class="socials">
                    <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.tiktok.com" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                    <a href="https://wa.me/6584857496" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    sendMail(
      member.email,
      "IronParadise Membership Subscription Expired",
      html
    );

    res.status(200).json({ message: "Mail Sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Subscription Expired
const mailGoingToExpire = async (member) => {
  try {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Message from Iron Paradise Admin</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
            color: #333333;
        }
        .container {
            max-width: 700px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 60px 20px;
            background-image: url("https://media.istockphoto.com/id/1369897943/photo/focus-on-disc-close-up-shot-hands-adding-weight-to-barbell-rod-at-gym-concept-of-fitness.jpg?s=612x612&w=0&k=20&c=H0fxQoJGyMv9npWuD42R6xiG8JUpqZNPbp4dLWh7B7k=");
            background-size: cover;
            background-position: center;
            color: #ffffff;
            text-shadow: 5px 5px 10px black;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            position: relative;
            overflow: hidden;
        }
        .header h1 {
            margin: 0;
            font-size: 36px;
            font-weight: bold;
            position: relative;
            z-index: 1;
            text-transform: uppercase;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }
        h2 {
            color: gray;
            font-size: 28px;
            margin-top: 0;
        }
        p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
            margin: 0 0 15px;
        }
        a {
            color: black;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            background-color: #eeeeee;
            padding: 20px;
            border-top: 1px solid #ddd;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        .footer h2 {
            color: black;
            font-size: 20px;
            margin: 0 0 10px;
        }
        .footer p {
            font-size: 14px;
            color: #666666;
            margin: 0 0 10px;
        }
        .footer ul {
            padding: 0;
            list-style: none;
            margin: 0;
        }
        .footer li {
            margin-bottom: 10px;
        }
        .footer .socials {
            text-align: center;
            margin-top: 20px;
        }
        .footer .socials a {
            color: gray;
            text-decoration: none;
            margin: 0 12px;
            font-size: 24px;
        }
        .footer .socials a:hover {
            color: black;
        }
        .fa {
            margin-right: 8px;
        }
    </style>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Iron Paradise</h1>
        </div>
        <div class="content">
            <h2>Hello, ${member.name}!</h2>
            <p>We hope you're enjoying your journey with Iron Paradise!</p>
            <p>Your subscription plan of <strong>₹${member.subscription.planCost}</strong> is going to expire on <strong>${member.subscription.endDate}</strong>.</p>
            <p>To continue accessing all the benefits, please renew your subscription at your earliest convenience.</p>
            <p>If you have any questions or need assistance with renewing, feel free to contact us!</p>
            <p>Sincerely,<br />Iron Paradise Admin</p>
        </div>
        <div class="footer">
            <div class="section">
                <h2>Contact Information</h2>
                <p><strong>Iron Paradise</strong></p>
                <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                <p>Phone: 6383 580 365</p>
            </div>
            <div class="section">
                <h2>Support</h2>
                <p>If you need assistance, please contact our support team:</p>
                <p>Email: <a href="mailto:support@ironparadise.com">support@ironparadise.com</a></p>
                <p>Phone: +91 6584 857 496</p>
            </div>
            <div class="section">
                <h2>Follow Us</h2>
                <p>Connect with us on social media for updates and news:</p>
                <div class="socials">
                    <a href="https://facebook.com" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://instagram.com" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.tiktok.com" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
                    <a href="https://wa.me/6584857496" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
    sendMail(
      member.email,
      "IronParadise Membership Subscription Expired",
      html
    );

    res.status(200).json({ message: "Mail Sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add event
const addEvent = async (req, res) => {
  const { name, description, access, startDate, endDate } = req.body.eventData;
  try {
    const event = new Event({
      name,
      description,
      access,
      startDate,
      endDate,
    });

    const newEvent = await event.save();
    res.status(201).json({ message: "Event Added", event: newEvent });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Schedule job to run every day at 6 AM
cron.schedule("0 6 * * *", async () => {
  try {
    const today = moment().startOf("day");

    const events = await Event.find();

    const members = await Member.find();

    events.forEach((event) => {
      const startDate = moment(event.startDate).startOf("day");
      const endDate = moment(event.endDate).startOf("day");

      if (today.isBetween(startDate, endDate, null, "[]")) {
        sendEmail(event);

        members.forEach((member) => {
          const subscriptionEndDate = moment(
            member.subscription.endDate
          ).startOf("day");

          if (subscriptionEndDate.isBefore(today)) {
            MailPast(member);
          } else if (
            subscriptionEndDate.isSameOrBefore(today.clone().add(7, "days"))
          ) {
            mailGoingToExpire(member);
          }
        });
      }
    });

    console.log("Scheduled email job executed at 7 AM");
  } catch (err) {
    console.error("Error running scheduled email job:", err);
  }
});

module.exports = {
  getEvents,
  addEvent,
};
