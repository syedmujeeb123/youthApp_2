import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../UI/reusable/BackTo";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out!");
    // You can integrate EmailJS, Formspree, etc. here
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <span className="absolute top-6 left-6">
        <BackButton label="Go Back" />
      </span>
      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-4xl p-8 transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-8 animate-pulse">
          Get in Touch ✨
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6 text-gray-700">
            <div className="flex items-center gap-4">
              <Mail className="text-purple-600 w-6 h-6" />
              <span>info@youthapp.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-purple-600 w-6 h-6" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-purple-600 w-6 h-6" />
              <span>Hyderabad, India</span>
            </div>

            <div className="text-sm text-gray-500 mt-8">
              We’d love to hear from you! Whether you have a question,
              suggestion, or just want to say hello 👋
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full p-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 transition-all"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              className="w-full p-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400 transition-all"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
