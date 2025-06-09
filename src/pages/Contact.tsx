import React, { useState } from "react";
import Input from "../components/Input";

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  subject: string;
  message: string;
}

const defaultForm: ContactFormData = {
  first_name: "",
  last_name: "",
  email: "",
  company_name: "",
  subject: "",
  message: "",
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(defaultForm);

  const handleChange = (key: keyof ContactFormData, value: string): void => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: Send `form` to your API...
  };

  return (
    <div className="bg-red">
      <div className="flex flex-col gap-[16px] px-[20px] py-[30px] md:py-[48px] w-full flex-grow max-w-[1260px] overflow-hidden justify-center mx-auto">
        <p className="text-3xl md:text-4xl font-medium">Reach Us</p>
        <div
          className="border-t w-1/5"
          style={{ borderColor: "oklch(87.2% .01 258.338)" }}
        ></div>
        <div className="flex justify-center md:justify-between flex-col md:flex-row gap-5">
          <div className="flex gap-5">
            <div className="flex flex-col flex-wrap">
              <span className="text-lg font-medium">Address:</span>
              <p>161 Fort Evans Rd NE, Suite 230, Leesburg, VA 20176</p>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium">Email:</span>
              <p>
                For any Inquiry, please reach us at{" "}
                <a
                  href="mailto:sales@centennialtechnologies.com"
                  className="underline text-blue-600"
                >
                  sales@centennialtechnologies.com
                </a>
              </p>
            </div>
          </div>

          {/* Form */}

          <div className="w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                Submit your query here!
              </h5>
              <div
                className="border-t border-dotted mx-auto"
                style={{ borderColor: "oklch(87.2% .01 258.338)" }}
              ></div>

              <div className="flex flex-wrap justify-between">
                <Input
                  label="First Name"
                  name="first_name"
                  id="first_name"
                  placeholder="First Name..."
                  required
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    handleChange("first_name", e.target.value);
                  }}
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  id="last_name"
                  placeholder="Last Name..."
                  required
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    handleChange("last_name", e.target.value);
                  }}
                />
              </div>
              <Input
                label="Email"
                name="email"
                id="email"
                placeholder="Email..."
                type="email"
                required
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  handleChange("email", e.target.value);
                }}
              />
              <Input
                label="Company Name"
                name="company"
                id="company"
                placeholder="Company Name..."
                type="text"
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  handleChange("company_name", e.target.value);
                }}
              />

              <Input
                label="Subject"
                name="subject"
                id="subject"
                placeholder="Subject..."
                type="text"
                required
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  handleChange("subject", e.target.value);
                }}
              />

              <Input
                label="Message"
                name="message"
                id="message"
                placeholder="Message..."
                textarea
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  handleChange("message", e.target.value);
                }}
              />

              <button
                type="submit"
                className="text-white bg-[#f37021] hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
