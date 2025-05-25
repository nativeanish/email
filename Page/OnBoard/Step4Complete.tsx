import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight } from "lucide-react"
import useAddress from "../../store/useAddress"
import { useNavigate } from "react-router-dom"
import useOnboard from "../../store/useOnboard"

export default function Step4Complete() {
  const { type: emailType, name, image, image_type } = useOnboard()
  const { address, walletType } = useAddress()
  const navigate = useNavigate()
  const [emailAddress, setEmailAddress] = useState("")
  useEffect(() => {
    // Generate email address based on email type and wallet
    if (emailType === "arns") {
      // For ArNS, use a simplified version of the display name
      const simplifiedName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 10)
      setEmailAddress(`${simplifiedName}@perma.email`)
    } else {
      // For wallet type, use a shortened address
      const shortAddress = address ? address.substring(0, 6) + "..." + address.substring(address.length - 4) : ""
      setEmailAddress(`${shortAddress}@perma.email`)
    }
  }, [address, emailType, name])

  const handleGetStarted = () => {
    // Navigate to inbox
    navigate("/inbox")
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center mb-8"
      >
        <motion.div
          className="inline-flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }}
        >
          <div className="bg-green-500/20 p-5 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-bold mb-4 tracking-tight">Setup Complete!</h2>
        <p className="text-gray-400 mb-6">Your decentralized email account has been successfully created.</p>
      </motion.div>

      <div className="space-y-8 w-full">
        <motion.div
          className="bg-zinc-800 border border-zinc-700 rounded-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-medium mb-4">Your Email Details</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                {image_type === "url" || image_type === "file" ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-700" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Display Name</p>
                <p className="font-medium">{name || "Loading..."}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Email Address</p>
              <div className="bg-zinc-900 p-3 rounded-lg font-mono text-blue-400 break-all">
                {emailAddress || "Loading..."}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Wallet</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{walletType || "Loading..."}</p>
                <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">Connected</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center w-full mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            className="bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGetStarted}
          >
            Get Started
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </>
  )
}

