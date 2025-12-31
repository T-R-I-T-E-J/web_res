'use client'

import { useState } from 'react'

import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

// const socialLinks = [
//   { label: 'Facebook', href: '#', icon: Facebook },
//   { label: 'Twitter', href: '#', icon: Twitter },
//   { label: 'Instagram', href: '#', icon: Instagram },
//   { label: 'YouTube', href: '#', icon: Youtube },
// ]



const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="gradient-hero py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            The STC Para Shooting office, part of the Paralympic Committee of India, handles administration, events, and selections for Indian para-shooters.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-interactive hover:text-primary">Home</a></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600">Contact</li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              {/* Address */}
              <div>
                <h2 className="font-heading font-semibold text-lg text-primary mb-4">
                  Our Office
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-neutral-700 font-medium">Jaisalmer House</p>
                    <p className="text-neutral-600 text-sm">
                      26 Mansingh Road,<br />
                      New Delhi - 110011
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h2 className="font-heading font-semibold text-lg text-primary mb-4">
                  Get in Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Phone</p>
                      <a href="tel:+911123075126" className="text-neutral-700 hover:text-interactive">
                        +91-11-23075126
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-card flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Official Communication Email</p>
                      <a href="mailto:stcparashooting@gmail.com" className="block text-neutral-700 hover:text-interactive">
                        stcparashooting@gmail.com
                      </a>
                      <a href="mailto:theparashootingindia@gmail.com" className="block text-neutral-700 hover:text-interactive">
                        theparashootingindia@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}


              {/* Social Links */}
              <div>
                <h2 className="font-heading font-semibold text-lg text-primary mb-4">
                  Follow Us
                </h2>
                {/* <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div> */}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="font-heading font-semibold text-xl text-primary mb-6">
                  Send us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-primary mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      Thank you for contacting us. We'll get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                      }}
                      className="btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="input"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Enquiry</option>
                          <option value="registration">Shooter Registration</option>
                          <option value="events">Events & Competitions</option>
                          <option value="technical">Technical Support</option>
                          <option value="media">Media & Press</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="input resize-none"
                        placeholder="Type your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Map Section */}
      <section className="bg-white">
        <div className="h-96 bg-neutral-200 flex items-center justify-center">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-12 h-12 text-neutral-400 mx-auto mb-2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <p className="text-neutral-500">Map placeholder - Google Maps integration</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage

