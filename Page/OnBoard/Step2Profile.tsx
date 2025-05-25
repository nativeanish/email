import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ArrowLeft, User, Upload, RefreshCw } from "lucide-react"
import useOnboard from "../../store/useOnboard"
import { set_details } from "../../utils/arns"
import useAddress from "../../store/useAddress"
interface Step2Props {
  onNext: () => void
  onBack: () => void
}


export default function Step2Profile({ onNext, onBack }: Step2Props) {
  const { name, set_name, bio, set_bio, image, set_image, set_image_type, arns, type, arns_name } = useOnboard()

  const [loading, setLoading] = useState(false)
  const { address } = useAddress()
  useEffect(() => {
    if (type === "wallet" && address && address.length > 0) {
      set_name((address))
    }
    if (type === "arns" && arns_name && arns_name.length > 0) {
      set_name(arns_name)
    }
  }, [type, address, set_name, arns_name])

  useEffect(() => {
    if (!type) {
      onBack()
    }
  }, [type, onBack])



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileUrl = URL.createObjectURL(file)
      set_image(fileUrl)
      set_image_type("file")
    }
  }

  const handleContinue = () => {
    onNext()
  }

  const fetchFromArns = async () => {
    setLoading(true)
    await set_details()
    setLoading(false)
  }


  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Create your profile</h2>
        <p className="text-gray-400">Tell us a bit about yourself to personalize your experience.</p>
      </motion.div>

      <div className="space-y-6 w-full">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4 group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                {image.length > 0 ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-500" />
                )}
              </div>
              <label
                htmlFor="profilePhoto"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
              >
                <Upload className="h-6 w-6 text-white" />
              </label>
              <input type="file" id="profilePhoto" accept="image/*" className="sr-only" onChange={handleFileChange} />
            </div>
            <label
              htmlFor="profilePhoto"
              className="text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
            >
              Upload profile photo
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="displayName"
                name="displayName"
                disabled={true}
                value={name}
                onChange={(e) => set_name(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Alex Smith"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => set_bio(e.target.value)}
              rows={3}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          {/* Fetch from ArNS Button */}
          {arns && (
            <motion.button
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={fetchFromArns}
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {loading ? "Fetching from ArNS..." : "Fetch from ArNS"}
            </motion.button>)}
        </motion.div>

        <motion.div
          className="flex justify-between w-full mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>

          <motion.button
            className={`bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2 group ${!image ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleContinue}
            disabled={!image}
          >
            Continue
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </>
  )
}

