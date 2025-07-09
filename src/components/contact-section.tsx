import { useState } from "react";
import { Calendar, Download } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: ""
      });
      alert("Demo request submitted! We'll be in touch soon.");
    }, 1000);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-500 text-[#0b0080] mb-6">
            Ready to <span className="text-orange-500">Get Started?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your regulatory compliance process with CHAAP. Book a demo to see how our AI agents can accelerate your submissions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a552f7] focus:border-[#a552f7] transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a552f7] focus:border-[#a552f7] transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-gray-900 font-semibold mb-2">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  value={formData.company || ""}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a552f7] focus:border-[#a552f7] transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-900 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a552f7] focus:border-[#a552f7] transition-colors duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-gray-900 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your regulatory challenges and how CHAAP can help..."
                  value={formData.message || ""}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#a552f7] focus:border-[#a552f7] transition-colors duration-200"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#a552f7] hover:bg-purple-900 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2" size={20} />
                      Book A Demo
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="border-2 border-[#a552f7] text-[#a552f7] hover:bg-purple-800 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 inline-flex items-center justify-center"
                >
                  <Download className="mr-2" size={20} />
                  Download Brochure
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
