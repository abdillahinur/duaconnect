import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Prepare email
    const msg = {
      to: 'your-email@example.com', // Replace with your email
      from: 'your-verified-sender@example.com', // Replace with your SendGrid verified sender
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<strong>Name:</strong> ${name}<br>
             <strong>Email:</strong> ${email}<br>
             <strong>Message:</strong> ${message}`,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}