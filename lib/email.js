import nodemailer from 'nodemailer'
import { format } from 'date-fns'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CarBook</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="padding: 30px 40px; text-align: center; background-color: #2c5aa0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: normal;">CarBook</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px;">
        ${content}
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 12px; margin: 0; line-height: 1.4;">
          © ${new Date().getFullYear()} CarBook. All rights reserved.<br>
          <a href="mailto:support@carbook.com" style="color: #2c5aa0;">support@carbook.com</a> | 
          <a href="tel:+15551234567" style="color: #2c5aa0;">+1 (555) 123-4567</a>
        </p>
      </td>
    </tr>
    
  </table>
</body>
</html>
`

export const sendOTPEmail = async (email, otp) => {
  const content = `
    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Verify Your Email</h2>
    
    <p style="color: #555; font-size: 14px; line-height: 1.5; margin: 0 0 25px 0;">
      Please use the verification code below to complete your CarBook registration:
    </p>
    
    <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; text-align: center; margin: 25px 0;">
      <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 12px;">VERIFICATION CODE</p>
      <h1 style="color: #2c5aa0; font-size: 32px; margin: 0; font-weight: bold; letter-spacing: 2px;">${otp}</h1>
    </div>
    
    <p style="color: #dc3545; font-size: 12px; margin: 20px 0;">
      This code expires in 10 minutes.
    </p>
    
    <p style="color: #6c757d; font-size: 12px; line-height: 1.4; margin: 0;">
      If you didn't request this code, please ignore this email.
    </p>
  `
  
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'CarBook'} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email - CarBook',
    html: getEmailTemplate(content)
  }

  return transporter.sendMail(mailOptions)
}

export const sendBookingConfirmationEmail = async (email, booking) => {
  const content = `
    <h2 style="color: #28a745; margin: 0 0 20px 0; font-size: 20px;">Booking Confirmed</h2>
    
    <p style="color: #555; font-size: 14px; line-height: 1.5; margin: 0 0 25px 0;">
      Your car booking has been confirmed. Here are your details:
    </p>
    
    <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #dee2e6; margin: 20px 0;">
      <tr style="background-color: #f8f9fa;">
        <td style="font-weight: bold; color: #333; font-size: 12px;">BOOKING ID</td>
        <td style="color: #555; font-size: 12px;">#${booking.id.slice(-8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; color: #333; font-size: 12px;">VEHICLE</td>
        <td style="color: #555; font-size: 12px;">${booking.car.make} ${booking.car.model} (${booking.car.year})</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="font-weight: bold; color: #333; font-size: 12px;">PICKUP</td>
        <td style="color: #555; font-size: 12px;">${format(new Date(booking.startTime), 'dd/MM/yyyy HH:mm')}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; color: #333; font-size: 12px;">RETURN</td>
        <td style="color: #555; font-size: 12px;">${format(new Date(booking.endTime), 'dd/MM/yyyy HH:mm')}</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="font-weight: bold; color: #333; font-size: 12px;">LOCATION</td>
        <td style="color: #555; font-size: 12px;">${booking.car.location?.name || 'Main Location'}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; color: #333; font-size: 12px;">TOTAL</td>
        <td style="color: #28a745; font-size: 14px; font-weight: bold;">$${booking.totalPrice}</td>
      </tr>
    </table>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0;">
      <p style="color: #856404; font-size: 12px; margin: 0; line-height: 1.4;">
        <strong>Important:</strong> Please arrive 15 minutes early and bring a valid driver's license.
      </p>
    </div>
    
    <p style="color: #6c757d; font-size: 12px; line-height: 1.4; margin: 20px 0 0 0;">
      Thank you for choosing CarBook!
    </p>
  `
  
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'CarBook'} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Booking Confirmed - CarBook',
    html: getEmailTemplate(content)
  }

  return transporter.sendMail(mailOptions)
}