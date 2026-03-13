import { motion } from 'framer-motion'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Security', href: '#security' },
      { name: 'Blog', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Privacy', href: '#security' },
    ],
    Download: [
      { name: 'Android', href: '#download' },
      { name: 'iPhone', href: '#download' },
    ],
    Support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'Help Center', href: '#contact' },
      { name: 'Apps', href: '#download' },
    ],
    Legal: [
      { name: 'Terms and conditions', href: '#' },
      { name: 'Privacy policy', href: '#' },
      { name: 'Cookie policy', href: '#' },
      { name: 'Disclaimer', href: '#' },
      { name: 'Data privacy and encryption', href: '#' },
    ],
  }

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        {/* Top Section - Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-start mb-12 sm:mb-16 pb-8 sm:pb-12 border-b border-white/10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col cursor-pointer group"
            onClick={scrollToTop}
          >
            <span className="text-3xl sm:text-4xl font-display font-bold text-white group-hover:bg-gradient-to-r group-hover:from-primary-blue group-hover:to-purple group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              IU Chat
            </span>
            <span className="text-sm sm:text-base text-white/70 mt-2">
              Simple. Secure. Reliable messaging.
            </span>
          </motion.div>
        </motion.div>

        {/* Navigation Columns + Download section */}
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-10 xl:gap-14 mb-12 sm:mb-16">
          {/* Left: Product / Company / Support / Legal links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:col-span-4 xl:col-span-3 gap-6 sm:gap-10">
            {(['Product', 'Company', 'Support', 'Legal'] as const).map((key, colIndex) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: colIndex * 0.1 }}
                className="flex flex-col gap-3 text-left"
              >
                <h3 className="text-sm font-semibold text-white/90 tracking-wide mb-1">
                  {key}
                </h3>
                <ul className="flex flex-col gap-3 list-none">
                  {footerLinks[key].map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToSection(link.href.replace('#', ''))
                        }}
                        className={`text-sm text-white/70 hover:text-white transition-colors duration-200 inline-block relative group ${
                          key === 'Legal' ? 'break-words' : ''
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-blue group-hover:w-full transition-all duration-300"></span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Right: Download the app section
              - On mobile & tablets: full width, centered under columns
              - On wide screens (xl): shifted to the right side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-4 xl:col-span-2 flex flex-col items-center gap-4 text-center xl:ml-auto"
          >
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
              Download the app
            </h3>
            <p className="text-sm text-white/70 max-w-md">
              Get IU Chat on your phone and stay connected with simple, secure and
              reliable messaging.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto justify-center">
              {/* Play Store */}
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('download')
                }}
                className="inline-flex items-center rounded-xl border border-white/20 bg-slate-900 px-4 py-2.5 text-left shadow-lg shadow-black/40 hover:bg-slate-800 transition-colors"
              >
                <img
                  src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                  alt="Google Play icon"
                  className="w-6 h-6 mr-3"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">
                    Get it on
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white leading-tight">
                    Play Store
                  </div>
                </div>
              </a>

              {/* App Store */}
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('download')
                }}
                className="inline-flex items-center rounded-xl border border-white/20 bg-slate-900 px-4 py-2.5 text-left shadow-lg shadow-black/40 hover:bg-slate-800 transition-colors"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white mr-3"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                >
                  <path d="M318.7 268.7c-.3-36.7 16.4-64.4 50-84.8-18.8-27.3-47.2-42.3-84.7-45-35.5-2.6-74.3 20.7-88.5 20.7-15 0-49.3-19.7-76.4-19.7C63.3 140.5 16 184.3 16 259.3c0 26.3 4.8 53.5 14.5 81.6 12.9 36.7 59.3 126.4 108.1 124.8 25.4-.6 43.2-18.1 76.1-18.1 32.2 0 49 18.1 76.4 18.1 49.1-.7 90.5-82.5 102.9-119.3-65.2-30.8-75.3-90.3-75.3-97.7zM260.9 92.7c27.4-32.3 24.9-61.7 24-72.7-23.6 1.4-51 15.9-66.8 33.7-17.5 19.7-27.8 44.3-25.6 71.9 25.5 2 48.9-11.2 68.4-32.9z" />
                </svg>
                <div className="flex flex-col">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70">
                    Get it on
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white leading-tight">
                    App Store
                  </div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-8 sm:pt-12 border-t border-white/10 text-sm text-white/60 text-center sm:text-left"
        >
          {/* Bottom row: copyright + sitemap + socials */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span>© 2026 IU Chat LLC</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Sitemap
              </a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center sm:justify-end gap-4">
            {[
              { name: 'X (Twitter)', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { name: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
              { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href="#"
                aria-label={social.name}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-primary-blue hover:bg-primary-blue/20 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </motion.a>
            ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
