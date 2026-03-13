import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Download = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="download" className="relative bg-gradient-to-br from-primary-blue via-purple to-primary-blue py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
            Get IU Chat Today
          </h2>
          <p className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Join millions of users who trust IU Chat for their daily communication.
            Download now and start connecting with friends and family.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center gap-6 mb-12 flex-wrap"
        >
          <motion.a
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="group flex items-center gap-4 bg-white text-primary-blue px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 min-w-[260px] justify-center hover:shadow-xl hover:-translate-y-1"
            aria-label="Download on Google Play"
          >
            <div className="flex items-center justify-center">
              <img
                src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg"
                alt="Google Play icon"
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 leading-none">
                Get it on
              </div>
              <div className="text-xl font-semibold leading-tight text-slate-900">
                Google Play
              </div>
            </div>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="group flex items-center gap-4 bg-white text-primary-blue px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 min-w-[260px] justify-center hover:shadow-xl hover:-translate-y-1"
            aria-label="Download on App Store"
          >
            <div className="flex items-center justify-center">
              <img
                src="https://www.vectorlogo.zone/logos/apple/apple-icon.svg"
                alt="Apple App Store icon"
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 leading-none">
                Download on the
              </div>
              <div className="text-xl font-semibold leading-tight text-slate-900">
                App Store
              </div>
            </div>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center gap-8 sm:gap-12 flex-wrap mt-12"
        >
          {['Free to download', 'No ads', 'Secure & private'].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-base sm:text-lg opacity-95"
            >
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/30">
                ✓
              </span>
              <span>{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Download
