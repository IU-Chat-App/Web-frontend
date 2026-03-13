import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  scrolled: boolean
}

const Navbar = ({ scrolled }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Privacy', href: '#security' },
    { name: 'Help Center', href: '#contact' },
    { name: 'Blog', href: '#' },
    { name: 'Apps', href: '#download' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 border-b border-white/20 transition-all duration-500
        bg-gradient-to-r from-white/80 via-white/70 to-white/80 backdrop-blur-xl
        ${
          scrolled
            ? 'shadow-soft-lg py-3'
            : 'shadow-sm py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center cursor-pointer"
          onClick={() => scrollToSection('hero')}
        >
          <span className="text-2xl font-display font-bold tracking-wide text-primary-blue">
            IU Chat
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href.replace('#', ''))
              }}
              className="relative text-text-dark font-medium text-[15px] hover:text-primary-blue transition-colors duration-300 group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-blue to-purple group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
        </div>

        {/* CTA Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary-blue to-purple text-white px-6 py-2.5 rounded-xl font-semibold text-[15px] shadow-glow hover:shadow-glow-lg transition-all duration-300"
            onClick={() => scrollToSection('download')}
          >
            Download App
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-text-dark transition-all duration-300"
            ></motion.span>
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-text-dark transition-all duration-300"
            ></motion.span>
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-text-dark transition-all duration-300"
            ></motion.span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay / Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-full h-screen bg-white z-[9999] flex flex-col lg:hidden"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <span className="text-xl font-display font-bold text-primary-blue">
                IU Chat
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6 text-text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
              <nav className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href.replace('#', ''))
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="text-text-dark font-semibold text-lg py-2 border-b border-gray-100 last:border-b-0"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>

              {/* Download Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 w-full bg-gradient-to-r from-primary-blue to-purple text-white px-6 py-4 rounded-xl font-semibold text-base shadow-glow hover:shadow-glow-lg transition-all duration-300"
                onClick={() => {
                  scrollToSection('download')
                  setMobileMenuOpen(false)
                }}
              >
                Download App
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
