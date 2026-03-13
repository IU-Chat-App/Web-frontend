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
            className="group flex items-center gap-4 bg-white/20 backdrop-blur-xl px-8 py-5 rounded-2xl text-white transition-all duration-300 border-2 border-white/30 min-w-[220px] justify-center hover:bg-white/30 hover:border-white/50 hover:shadow-2xl"
            aria-label="Download on Google Play"
          >
            <div className="flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1349 1.0989L4.8429 5.4467a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1862 1 13.7344 1 16.7714c0 .7265.1114 1.4279.3157 2.0918h21.3686c.2043-.6639.3157-1.3653.3157-2.0918 0-3.037-1.6889-5.5852-4.1521-7.45M5.7369 18.4301H2.3214c-.5511 0-.9993-.4482-.9993-.9993 0-.5511.4482-.9993.9993-.9993h19.3571c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9993-.9993.9993H5.7369z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <div className="text-xs opacity-90 leading-none">Get it on</div>
              <div className="text-xl font-semibold leading-tight">Google Play</div>
            </div>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="group flex items-center gap-4 bg-white/20 backdrop-blur-xl px-8 py-5 rounded-2xl text-white transition-all duration-300 border-2 border-white/30 min-w-[220px] justify-center hover:bg-white/30 hover:border-white/50 hover:shadow-2xl"
            aria-label="Download on App Store"
          >
            <div className="flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <div className="text-xs opacity-90 leading-none">Download on the</div>
              <div className="text-xl font-semibold leading-tight">App Store</div>
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
