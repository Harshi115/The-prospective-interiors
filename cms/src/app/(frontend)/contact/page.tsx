'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  })

  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setSuccess(true)

      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
      })
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <h1>Contact Us</h1>

        <p>
          We'd love to hear about your project. Fill out the form below and our
          team will get in touch.
        </p>
      </section>

      <section className="contact-form-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <select
            value={formData.projectType}
            onChange={(e) =>
              setFormData({ ...formData, projectType: e.target.value })
            }
          >
            <option value="">Select Project Type</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Hospitality</option>
            <option>Industrial</option>
            <option>Healthcare</option>
            <option>Other</option>
          </select>

          <textarea
            placeholder="Tell us about your project"
            rows={6}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />

          <button type="submit">Submit Inquiry</button>

          {success && (
            <p>Thank you! Your inquiry has been submitted.</p>
          )}
        </form>
      </section>
    </main>
  )
}