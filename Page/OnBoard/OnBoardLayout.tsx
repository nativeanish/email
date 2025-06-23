import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Mail, Shield } from "lucide-react"
import ConnectButton from "../../Components/ConnectButton"

interface OnboardLayoutProps {
  children: ReactNode
  currentStep: number
  icon: ReactNode
  title: string
  description: string
}

export default function OnboardLayout({ children, currentStep, icon, title, description }: OnboardLayoutProps) {
  // Steps for the progress stepper
  const steps = [
    { number: 1, label: "Select Email" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Generating Keys" },
    { number: 4, label: "Completed" },
  ]

  return (
    <div className="flex min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="fixed inset-0 z-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-white/5 rounded-full filter blur-3xl"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 7,
            delay: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        />
      </motion.div>

      {/* Left Panel - Hidden on mobile */}
      <div className="relative hidden md:flex md:w-2/5 bg-black p-8 flex-col justify-between z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-2 mb-16 group">
            <div className="relative">
              <Mail className="h-8 w-8 text-white transition-all group-hover:scale-110" />
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.7 }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight">PermaEmail</span>
          </div>
        </motion.div>

        {/* Text at bottom of left panel */}
        <motion.div
          className="mt-auto bg-white text-black p-6 -mx-8 -mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-10 bg-black rounded"></div>
              {icon}
              <div className="h-1 w-10 bg-black rounded"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{title}</h1>
            <p className="text-sm md:text-base text-black/70">{description}</p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Full width on mobile */}
      <div className="w-full md:w-3/5 bg-zinc-900 p-8 flex flex-col justify-between min-h-screen relative z-10">
        {/* Top section with logo (mobile) and connect button */}
        <div className="flex justify-between items-center mb-8">
          {/* Logo and title for mobile view */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative">
              <Mail className="h-6 w-6 text-white" />
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 1 }}
                transition={{ duration: 0.7 }}
              />
            </div>
            <span className="text-lg font-bold tracking-tight">PermaEmail</span>
          </div>

          <motion.div className="absolute top-4 right-4 md:top-8 md:right-8">
            <ConnectButton />
          </motion.div>
        </div>

        {/* Main content area - centered */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          {/* Progress Stepper - Improved for all device sizes */}
          <motion.div
            className="w-full mb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative flex justify-between items-center">
              {/* Connector lines - positioned behind the circles */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-700 -translate-y-1/2 z-0"></div>

              {/* Animated progress line */}
              <motion.div
                className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2 z-1"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Step circles */}
              {steps.map((step) => {
                const isActive = step.number === currentStep
                const isCompleted = step.number < currentStep

                return (
                  <div key={step.number} className="flex flex-col items-center z-10">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive
                        ? "bg-white border-white text-black"
                        : isCompleted
                          ? "bg-white border-white text-black"
                          : "bg-zinc-900 border-zinc-700 text-zinc-500"
                        }`}
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isActive || isCompleted ? "#ffffff" : "#18181b",
                        borderColor: isActive || isCompleted ? "#ffffff" : "#3f3f46",
                        color: isActive || isCompleted ? "#000000" : "#71717a",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Hidden label for accessibility */}
                    <span className="sr-only">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Content from child component */}
          {children}
        </div>

        {/* Footer with copyright and security info */}
        <motion.div
          className="flex justify-between items-center text-sm text-gray-500 w-full mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <div className="text-gray-500">© PermaEmail</div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-gray-400" />
            <span>End-to-end encrypted</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

