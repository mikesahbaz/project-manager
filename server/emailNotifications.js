const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailNotification(recipientEmail, projectName) {
  const msg = {
    to: recipientEmail,
    from: 'mikesahbaz99@gmail.com',
    subject: 'New Project Created in Project Manager',
    text: `A new project has been created: ${projectName}`,
    html: `<p>A new project has been created: <strong>${projectName}</strong></p>`,
  };

  try {
    console.log('Sending email to: ', recipientEmail);
    await sgMail.send(msg);
    console.log('Email sent to', recipientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendEmailNotification,
};