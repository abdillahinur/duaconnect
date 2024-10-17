import Link from "next/link"
import { Mail, Twitter } from "lucide-react"
import ContactForm from '../components/ContactForm'
import Header from '../components/Header'

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
                    href="mailto:contact@dualink.com"
                    className="flex items-center justify-start w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    contact@dualink.com
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