import React from "react";

const Footer = () => {
  const footerLogo = new URL("../assets/logo2-svg.svg", import.meta.url).href;
  const linkedInImg = new URL("../assets/linkedin.svg", import.meta.url).href;
  return (
    <footer
      className="flex justify-between md:h-[90px] bg-white w-full border-t"
      style={{ borderColor: "#28303d3d" }}
    >
      <div className="flex flex-col md:flex-row gap-2.5 justify-between items-center w-full max-w-[1260px] mx-auto px-[20px]">
        <div className="flex items-center text-[#666] text-lg font-medium">
          <span>A</span>
          <img
            className="h-[57.8px] relative top-[3px]"
            src={footerLogo}
            alt="logo"
          />

          <span>Product</span>
        </div>

        <p className="mb-0 text-center text-sm">
          &copy; 2025. All rights reserved.
        </p>

        <div className="font-normal text-sm min-w-[200px] flex gap-3 items-center text-[#034EA2]">
          <a href="" className="underline">
            Book a demo
          </a>
          <a href="" className="underline">
            Product overview
          </a>
          <a href="" className="underline">
            Contact Us!
          </a>
          <a
            href="https://www.linkedin.com/company/centennial-technologies"
            target="_blank"
          >
            <img
              src={linkedInImg}
              alt="linkedin"
              className="w-[36px] h-[36px]"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
