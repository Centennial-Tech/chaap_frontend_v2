import React, { useState } from "react";
import Input from "../components/Input";
import { DEER } from "../constants/animation_config";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

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

  const particlesInit = (engine: Engine) => {
    loadFull(engine);
  };

  const handleMessage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChange("message", e.target.value);
  };

  return (
    <div className="mt-[54px]">
      <div className="flex flex-col gap-[16px] px-[20px] py-[10px] w-full flex-grow max-w-[1260px] overflow-hidden justify-center mx-auto">
        <div className="flex justify-center md:justify-between flex-col md:flex-row gap-5">
          {/* Form */}

          <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 rounded-lg">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                Submit your <span className="text-[#f37021]">query</span> here!
              </h5>
              <div
                className="border-t border-dotted mx-auto"
                style={{ borderColor: "#f37021" }}
              ></div>

              <div className="flex flex-wrap justify-between">
                <Input
                  label="First Name"
                  name="first_name"
                  id="first_name"
                  placeholder="First Name..."
                  required
                  onChange={
                    ((
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange("first_name", e.target.value);
                    }) as any
                  }
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  id="last_name"
                  placeholder="Last Name..."
                  required
                  onChange={
                    ((
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange("last_name", e.target.value);
                    }) as any
                  }
                />
              </div>
              <div className="flex flex-wrap justify-between">
                <Input
                  label="Email"
                  name="email"
                  id="email"
                  placeholder="Email..."
                  type="email"
                  required
                  onChange={
                    ((
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange("email", e.target.value);
                    }) as any
                  }
                />
                <Input
                  label="Company Name"
                  name="company"
                  id="company"
                  placeholder="Company Name..."
                  type="text"
                  onChange={
                    ((
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >
                    ) => {
                      handleChange("company_name", e.target.value);
                    }) as any
                  }
                />
              </div>
              <Input
                label="Subject"
                name="subject"
                id="subject"
                placeholder="Subject..."
                type="text"
                required
                onChange={
                  ((
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    handleChange("subject", e.target.value);
                  }) as any
                }
              />

              <Input
                label="Message"
                name="message"
                id="message"
                placeholder="Message..."
                textarea
                onChange={handleMessage as any}
              />

              <button
                type="submit"
                className="text-white bg-[#f37021] hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Send Message
              </button>
            </form>
          </div>
          {/* divider */}
          <div className="border-r"></div>
          {/* contact info */}
          <div className="flex flex-col gap-5 p-4 sm:p-6 md:p-8">
            <Particles
              init={particlesInit as any}
              options={DEER as any}
              className="h-[460px]"
            />
            <div className="flex flex-col flex-wrap">
              <span className="text-lg font-medium text-[#f37021]">
                ADDRESS
              </span>
              <div
                className="border-t border-dotted mt-3 mx-auto w-full"
                style={{ borderColor: "#f37021" }}
              ></div>
              <p>161 Fort Evans Rd NE, Suite 230, Leesburg, VA 20176</p>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-[#f37021]">EMAIL</span>
              <div
                className="border-t border-dotted mt-3 mx-auto w-full"
                style={{ borderColor: "#f37021" }}
              ></div>
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
            {/* <img src={icon} alt="" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
