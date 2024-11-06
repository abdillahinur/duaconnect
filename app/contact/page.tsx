"use client"
import Link from "next/link"
import { Mail, Twitter } from "lucide-react"
import { useState } from 'react'
import emailjs from '@emailjs/browser'

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitError('')

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'DuaLink Team',
      }

      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      if (response.status === 200) {
        setSubmitMessage(`Thank you, ${name}! We've received your message and will get back to you soon.`)
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setSubmitError('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Email error:', error)
      setSubmitError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Get in Touch</h2>
      <p className="text-gray-600">
        Fill out the form below, and we&apos;ll get back to you as soon as possible.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        {submitMessage && (
          <p className="mt-4 text-sm text-green-600">{submitMessage}</p>
        )}
        {submitError && (
          <p className="mt-4 text-sm text-red-600">{submitError}</p>
        )}
      </form>
    </div>
  )
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Contact Us
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We&apos;re here to help. Reach out to us with any questions, suggestions, or support needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 md:grid-cols-2">
              <ContactForm />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Other Ways to Connect</h2>
                <p className="text-gray-600">
                  Prefer to reach out directly? Use one of the methods below:
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:abdillahi.dualink@gmail.com"
                    className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    abdillahi.dualink@gmail.com
                  </a>
                  <a
                    href="https://twitter.com/AbdillahiNur_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    @AbdillahiNur_
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}