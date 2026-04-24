import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container text-center">
         <h2 className="fw-bold">
            Begin Your Silambam Journey Today
          </h2>

          <button className="btn btn-light mt-3 px-4">
            Register Now
          </button>

         {/* Academy Name */}

        <h5 className="academy-name">
          KALAIMUDHUMANI SUBRAMANIYA AASAN SILAMBA KOODAM
        </h5>

        {/* Contact Details */}

        <div id = "contact" className="contact-info">

            <p className="para-contact">
            📞 Phone: 
            <a href="tel:+919940947458" className="contact-link">
            +91 99409 47458
            </a>
            </p>

            <p className="para-contact">
            📧 Email: 
            <a href="mailto:kmsasksilambam70@gmail.com" className="contact-link">
            kmsasksilambam70@gmail.com
                </a>
            </p>

</div>

        {/* Social Icons */}

        <div className="footer-icons">

          <a href="#"><i className="bi bi-facebook"></i></a>
          <a href="#"><i className="bi bi-instagram"></i></a>
          <a href="#"><i className="bi bi-youtube"></i></a>
          <a href="#"><i className="bi bi-whatsapp"></i></a>

        </div>

        {/* Copyright */}

        <p className="copyright">
          © {new Date().getFullYear()} All Rights Reserved
        </p>

      </div>

    </footer>
  );
}


export default Footer;