import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Security = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const securityFeatures = [
    {
      icon: '🔐',
      title: 'End-to-End Encryption',
      description: 'All your messages, calls, and media are encrypted so only you and the person you\'re communicating with can read or listen to them.'
    },
    {
      icon: '🛡️',
      title: 'Secure Authentication',
      description: 'Advanced login security with two-factor authentication options to keep your account protected.'
    },
    {
      icon: '🔒',
      title: 'Protected Communication',
      description: 'Your conversations stay private. We don\'t store your messages on our servers, ensuring complete privacy.'
    }
  ]

  return (
    <section id="security" className="relative bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-dark mb-6">
              <span className="bg-gradient-to-r from-primary-blue via-purple to-primary-blue bg-clip-text text-transparent">
                Built with Privacy
              </span>
              <br />
              <span className="text-text-dark">in Mind</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-light mb-12 leading-relaxed">
              Your privacy and security are our top priorities. IU Chat uses industry-leading 
              encryption to protect your conversations and keep your data safe.
            </p>
            <div className="flex flex-col gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex gap-6 items-start group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl sm:text-6xl flex-shrink-0"
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-text-dark mb-2 group-hover:text-primary-blue transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-text-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center lg:order-first"
          >
            <div className="relative w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] flex justify-center items-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-8xl sm:text-9xl z-10"
              >
                🛡️
              </motion.div>
              <div className="absolute w-full h-full top-0 left-0">
                <motion.div
                  animate={{
                    scale: [0.8, 1.2],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute w-[200px] sm:w-[250px] h-[200px] sm:h-[250px] top-[50px] sm:top-[75px] left-[50px] sm:left-[75px] border-2 border-primary-blue/30 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{
                    scale: [0.8, 1.2],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: 'easeOut',
                  }}
                  className="absolute w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] top-[25px] sm:top-[50px] left-[25px] sm:left-[50px] border-2 border-purple/30 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{
                    scale: [0.8, 1.2],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1,
                    ease: 'easeOut',
                  }}
                  className="absolute w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] top-0 left-0 border-2 border-primary-blue/20 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Security
