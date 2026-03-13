import { motion } from 'framer-motion'

const Hero = () => {
  const scrollToDownload = () => {
    const element = document.getElementById('download')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="hero" className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-blue-50 -z-10"></div>
      
      {/* Background Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-blue/10 rounded-full blur-3xl animate-pulse-slow hidden sm:block"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple/10 rounded-full blur-3xl animate-pulse-slow hidden sm:block" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-10 text-center lg:text-left"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-text-dark mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-primary-blue via-purple to-primary-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_3s_ease_infinite]">
                Simple. Secure.
              </span>
              <br />
              <span className="text-text-dark">Reliable messaging.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-text-light mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              IU Chat lets you message, call, and share instantly with friends and family.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 sm:gap-4 w-full sm:w-auto"
            >
              {/* Android button */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 32px rgba(34,197,94,0.55)',
                }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold
                           bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-white
                           shadow-glow hover:shadow-glow-lg transition-all duration-300 w-full sm:w-auto"
                onClick={scrollToDownload}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M7.88 3.5 6.45 1.4a.25.25 0 0 1 .42-.27L8.4 3.4a7.07 7.07 0 0 1 7.18 0l1.53-2.27a.25.25 0 0 1 .42.27L16.1 3.5A6.24 6.24 0 0 1 19 8.25v6.96c0 .97-.79 1.76-1.76 1.76h-.59v2.53a.75.75 0 1 1-1.5 0v-2.53H8.85v2.53a.75.75 0 1 1-1.5 0v-2.53h-.59A1.76 1.76 0 0 1 5 15.21V8.25A6.24 6.24 0 0 1 7.88 3.5ZM7 9.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm10-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                <span>Download for Android</span>
              </motion.button>

              {/* iOS button */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 32px rgba(15,23,42,0.7)',
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold
                           bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white
                           border border-white/10 hover:border-white/40
                           transition-all duration-300 shadow-soft-lg w-full sm:w-auto"
                onClick={scrollToDownload}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M16.365 2c-.98.067-2.15.7-2.84 1.523-.62.73-1.13 1.89-.99 3.02 1.09.084 2.21-.55 2.88-1.35.65-.78 1.12-1.93.95-3.193zM19.43 8.27c-1.02-1.28-2.47-2.03-3.86-2.03-1.81 0-2.58.87-3.83.87-1.29 0-2.27-.86-3.84-.86-1.53.02-3.04.89-3.86 2.27-1.33 2.19-1.1 6.32 1.05 9.76.77 1.2 1.8 2.55 3.18 2.56 1.2.01 1.54-.78 3.19-.79 1.65-.02 1.95.8 3.15.79 1.38-.01 2.47-1.5 3.25-2.71.56-.86.77-1.29 1.2-2.26-3.15-1.21-3.66-5.74-.69-7.58z" />
                </svg>
                <span>Download for iOS</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center items-center relative mt-8 lg:mt-0"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-[240px] h-[480px] sm:w-[280px] sm:h-[560px] lg:w-[320px] lg:h-[640px]"
            >
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[50px] p-3 shadow-2xl">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-white/20 rounded-full"></div>
                
                {/* Phone Screen */}
                <div className="w-full h-full bg-white rounded-[42px] overflow-hidden flex flex-col shadow-inner">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-primary-blue to-purple p-5 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg"></div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">John Doe</div>
                        <div className="text-xs opacity-90 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          online
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                    {[
                      { text: "Hey! How are you?", time: "10:30 AM", sent: false },
                      { text: "I'm doing great, thanks!", time: "10:31 AM", sent: true },
                      { text: "Want to grab lunch?", time: "10:32 AM", sent: false },
                      { text: "Sure, sounds good! 🍕", time: "10:33 AM", sent: true },
                    ].map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: msg.sent ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.2 }}
                        className={`flex flex-col max-w-[75%] ${msg.sent ? 'self-end' : 'self-start'}`}
                      >
                        <div className={`px-4 py-3 rounded-2xl text-sm ${
                          msg.sent
                            ? 'bg-gradient-to-r from-primary-blue to-purple text-white rounded-br-sm'
                            : 'bg-white text-text-dark shadow-soft rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`text-xs text-text-light mt-1 px-2 ${msg.sent ? 'text-right' : ''}`}>
                          {msg.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="flex items-center p-4 bg-white border-t border-gray-100 gap-3">
                    <div className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-text-light text-sm">
                      Type a message...
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-blue to-purple flex items-center justify-center cursor-pointer text-xl shadow-glow"
                    >
                      📤
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-blue/20 to-purple/20 rounded-[60px] blur-2xl -z-10 animate-pulse-slow"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
