import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface Feature {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '💬',
    title: 'Real-time Messaging',
    description: 'Send and receive messages instantly with friends and family around the world.'
  },
  {
    icon: '📞',
    title: 'Voice & Video Calls',
    description: 'High quality calls powered by modern technology. Stay connected wherever you are.'
  },
  {
    icon: '📷',
    title: 'Media Sharing',
    description: 'Send photos, videos, documents, and voice notes. Share your moments instantly.'
  },
  {
    icon: '🔒',
    title: 'End-to-End Security',
    description: 'Your conversations stay private. Built with security and privacy in mind.'
  }
]

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-white p-8 sm:p-10 rounded-3xl text-center transition-all duration-300 shadow-soft hover:shadow-soft-lg border border-gray-100 hover:border-primary-blue/30"
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-purple/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-6xl sm:text-7xl mb-6 inline-block"
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-dark mb-4 group-hover:text-primary-blue transition-colors">
          {feature.title}
        </h3>
        <p className="text-base sm:text-lg text-text-light leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

const Features = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-dark mb-6">
            <span className="bg-gradient-to-r from-primary-blue via-purple to-primary-blue bg-clip-text text-transparent">
              Why Choose IU Chat?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-light max-w-3xl mx-auto leading-relaxed">
            Everything you need to stay connected with the people who matter most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
