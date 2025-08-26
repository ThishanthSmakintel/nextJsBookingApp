import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Your CarBook Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">CarBook Verification</h2>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #3b82f6; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  }

  return transporter.sendMail(mailOptions)
}

export const sendBookingConfirmationEmail = async (email, booking) => {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Booking Confirmed - CarBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Booking Confirmed!</h2>
        <p>Your car booking has been successfully confirmed.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Booking Details</h3>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Car:</strong> ${booking.car.make} ${booking.car.model}</p>
          <p><strong>Pickup:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
          <p><strong>Return:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
          <p><strong>Location:</strong> ${booking.car.location.name}</p>
          <p><strong>Driver:</strong> ${booking.withDriver ? 'With Driver' : 'Self Drive'}</p>
          <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
        </div>
        
        <p>Please arrive 15 minutes before your pickup time.</p>
        <p>Thank you for choosing CarBook!</p>
      </div>
    `
  }

  return transporter.sendMail(mailOptions)
}