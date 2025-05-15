"use client"

import { Mail, Users, Building2, ChevronRight, Lock, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function OnBoard() {
  const [, setMounted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Steps for the progress stepper
  const steps = [
    { number: 1, label: "Select Email" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Generating Keys" },
    { number: 4, label: "Completed" },
  ]

  useEffect(() => {
    setMounted(true)

    // Auto-select the first option after a delay for animation effect
    const timer = setTimeout(() => {
      setSelectedOption("personal")
    }, 800)

    return () => clearTimeout(timer)
  }, [])

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
              <Lock className="h-4 w-4" />
              <div className="h-1 w-10 bg-black rounded"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
              A few clicks away from secure decentralized email.
            </h1>
            <p className="text-sm md:text-base text-black/70">
              Create your permanent email in minutes. Secure, private, and censorship-resistant.
            </p>
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

          {/* Connect button - visible on all views */}
          <motion.button
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-1 z-20 ml-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect
          </motion.button>
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

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Choose your email type</h2>
            <p className="text-gray-400">
              Creating your decentralized email is just a few steps away. Enter your details to continue.
            </p>
          </motion.div>

          <div className="space-y-4 w-full">
            <motion.div
              className={`border ${selectedOption === "personal" ? "border-white" : "border-zinc-700"} 
                bg-zinc-800/50 rounded-lg p-5 flex items-center hover:bg-zinc-800 transition-all duration-300 
                cursor-pointer relative overflow-hidden group`}
              onClick={() => setSelectedOption("personal")}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent ${selectedOption === "personal" ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
              ></div>
              <div
                className={`h-14 w-14 rounded-lg flex items-center justify-center mr-5 transition-all duration-500 ${selectedOption === "personal" ? "bg-white" : "bg-zinc-800"}`}
              >
                <Users
                  className={`h-7 w-7 transition-colors duration-500 ${selectedOption === "personal" ? "text-black" : "text-gray-400"}`}
                />
              </div>
              <div className="flex-1 z-10">
                <h3 className="font-medium text-lg">PERSONAL</h3>
                <p className="text-sm text-gray-400">Individual Account</p>
              </div>
              <motion.div
                className="text-white"
                initial={{ x: 10, opacity: 0 }}
                animate={{
                  x: selectedOption === "personal" ? 0 : 10,
                  opacity: selectedOption === "personal" ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: selectedOption === "personal" ? "100%" : "0%" }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>

            <motion.div
              className={`border ${selectedOption === "organization" ? "border-white" : "border-zinc-700"} 
                bg-zinc-800/50 rounded-lg p-5 flex items-center hover:bg-zinc-800 transition-all duration-300 
                cursor-pointer relative overflow-hidden group`}
              onClick={() => setSelectedOption("organization")}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent ${selectedOption === "organization" ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
              ></div>
              <div
                className={`h-14 w-14 rounded-lg flex items-center justify-center mr-5 transition-all duration-500 ${selectedOption === "organization" ? "bg-white" : "bg-zinc-800"}`}
              >
                <Building2
                  className={`h-7 w-7 transition-colors duration-500 ${selectedOption === "organization" ? "text-black" : "text-gray-400"}`}
                />
              </div>
              <div className="flex-1 z-10">
                <h3 className="font-medium text-lg">ORGANIZATION</h3>
                <p className="text-sm text-gray-400">Team Account</p>
              </div>
              <motion.div
                className="text-white"
                initial={{ x: 10, opacity: 0 }}
                animate={{
                  x: selectedOption === "organization" ? 0 : 10,
                  opacity: selectedOption === "organization" ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: selectedOption === "organization" ? "100%" : "0%" }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>
          </div>

          <motion.div
            className="mt-8 flex justify-center w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: selectedOption ? 1 : 0,
              y: selectedOption ? 0 : 10,
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}
            >
              Continue
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
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

