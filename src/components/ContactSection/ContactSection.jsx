import { useState } from "react";
import { CheckCircle, Loader, Send } from "lucide-react";
import SectionHeader from "../SectionHeader/SectionHeader";
import "./ContactSection.css";

// ---- ContactForm ----
const ContactForm = () => {
  const [state, setState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setState({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="mb-3">
        <label className="form-label fw-medium" htmlFor="name">Name</label>
        <input
          className="form-control form-control-lg"
          id="name"
          name="name"
          value={state.name}
          onChange={handleChange}
          required
          placeholder="Your name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-medium" htmlFor="email">Email</label>
        <input
          className="form-control form-control-lg"
          id="email"
          name="email"
          type="email"
          value={state.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-medium" htmlFor="message">Message</label>
        <textarea
          className="form-control form-control-lg"
          id="message"
          name="message"
          rows="5"
          value={state.message}
          onChange={handleChange}
          required
          placeholder="Tell us about your project..."
        />
      </div>
      <button
        className="btn btn-dark btn-lg w-100"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <><Loader size={18} className="spinner me-2" /> Sending...</>
        ) : status === "success" ? (
          <><CheckCircle size={18} className="me-2" /> Message Sent!</>
        ) : (
          <>Send Message <Send size={18} className="ms-2" /></>
        )}
      </button>
    </form>
  );
};

// ---- ContactSection ----
const ContactSection = () => {
  return (
    <section id="contact" className="container py-5 section-spacing contact-section">
      <SectionHeader
        title="Let's Build Together"
        subtitle="Have a project in mind? We'd love to hear from you"
      />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;