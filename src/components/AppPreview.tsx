import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const AppPreview = () => {
  const screenshots = [
    {
      title: 'Chats Screen',
      description: 'View all your conversations in one place',
      mockup: 'chats'
    },
    {
      title: 'Chat Conversation',
      description: 'Send messages, photos, and more',
      mockup: 'conversation'
    },
    {
      title: 'Call Screen',
      description: 'Make crystal clear voice and video calls',
      mockup: 'calls'
    }
  ]

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="preview" className="relative bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/30 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-dark mb-6">
            <span className="bg-gradient-to-r from-primary-blue via-purple to-primary-blue bg-clip-text text-transparent">
              See IU Chat in Action
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-text-light max-w-2xl mx-auto">
            Experience the simplicity and power of IU Chat
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.5,
                }}
                className="w-[200px] h-[400px] sm:w-[220px] sm:h-[440px] lg:w-[240px] lg:h-[480px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[35px] p-3 shadow-2xl relative group mx-auto"
              >
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-white/20 rounded-full"></div>
                <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex flex-col shadow-inner">
                  {screenshot.mockup === 'chats' && (
                    <>
                      <div className="bg-gradient-to-r from-primary-blue to-purple p-4 text-white">
                        <h3 className="text-lg font-semibold">Chats</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center p-4 gap-3 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-md"></div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-text-dark mb-1">Contact {i}</div>
                              <div className="text-xs text-text-light">Last message preview...</div>
                            </div>
                            <div className="text-xs text-text-light">10:30</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {screenshot.mockup === 'conversation' && (
                    <>
                      <div className="bg-gradient-to-r from-primary-blue to-purple p-4 flex items-center gap-3 text-white">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700"></div>
                        <div className="font-semibold text-sm">John Doe</div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
                        <div className="px-3 py-2 rounded-xl text-xs max-w-[70%] bg-white text-text-dark shadow-soft">Hey there!</div>
                        <div className="px-3 py-2 rounded-xl text-xs max-w-[70%] self-end bg-gradient-to-r from-primary-blue to-purple text-white">Hi! How are you?</div>
                        <div className="px-3 py-2 rounded-xl text-xs max-w-[70%] bg-white text-text-dark shadow-soft">Great, thanks!</div>
                      </div>
                    </>
                  )}
                  {screenshot.mockup === 'calls' && (
                    <>
                      <div className="bg-gradient-to-r from-primary-blue to-purple p-4 text-white">
                        <h3 className="text-lg font-semibold">Calls</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center p-4 gap-3 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-md"></div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-text-dark mb-1">Contact {i}</div>
                              <div className="text-xs text-text-light">📞 Voice call</div>
                            </div>
                            <div className="text-xl">📞</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-blue/20 to-purple/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-text-dark mb-2">{screenshot.title}</h3>
                <p className="text-sm sm:text-base text-text-light">{screenshot.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AppPreview
