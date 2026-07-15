import { HeartPulse, Plus } from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-teal-600 text-white py-12'>
      <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* MiCare+ Section */}
        <div>
          <div className='flex items-center gap-2 cursor-pointer'>
            <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
              <HeartPulse className='w-5 h-5 text-teal-600' aria-hidden='true' />
            </div>
            <span className='text-xl font-semibold text-white flex items-center'>
              MiCare
              <Plus className='w-4 h-4 text-white ml-1' aria-hidden='true' />
            </span>
          </div>
          <p className='text-sm mb-4'>
            Your trusted partner in dental health. We provide exceptional care
            every single day.
          </p>
          <p className='text-xs'>&copy; 2024 MiCare+. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Home
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Services
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                About Us
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Contact
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Our Services</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Cosmetic Dentistry
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Dental Implants
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Orthodontics
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                Teeth Whitening
              </a>
            </li>
            <li>
              <a href='#' className='hover:text-gray-200'>
                General Dentistry
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Contact Info</h3>
          <ul className='space-y-2 text-sm'>
            <li>123 Dental Care Ave., Smile City, CC 12345</li>
            <li>📞 (310) 123-4567</li>
            <li>✉️ info@micareplus.com</li>
            <li>🕒 Mon–Fri: 9AM–6PM</li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className='mt-8 flex justify-center gap-6'>
        <a href='#' className='hover:text-gray-200'>
          🌐 Facebook
        </a>
        <a href='#' className='hover:text-gray-200'>
          🐦 Twitter
        </a>
        <a href='#' className='hover:text-gray-200'>
          📸 Instagram
        </a>
        <a href='#' className='hover:text-gray-200'>
          💼 LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;
