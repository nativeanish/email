import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ArrowLeft, User, Upload, RefreshCw } from "lucide-react"
import useOnboard from "../../store/useOnboard"
import { set_details } from "../../utils/arns"
import { showDanger, useToast } from "../../Components/UI/Toast/Toast-Context"
import { useWalletStore } from "../../store/useWallet"

interface Step2Props {
  onNext: () => void
  onBack: () => void
}

export default function Step2Profile({ onNext, onBack }: Step2Props) {
  const { name, set_name, bio, set_bio, image, set_image, set_image_type, arns, type, arns_name, image_type, display_name: displayName, set_display_name: setDisplayName } =
    useOnboard()

  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState("")
  const { addToast } = useToast()
  const { address } = useWalletStore()
  const { process_id } = useOnboard()

  useEffect(() => {
    if (type === "wallet" && address && address.length > 0) {
      set_name(address)
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

  const validateName = (value: string) => {
    // Check for special characters (allow only letters, numbers, and spaces)
    const specialCharRegex = /[^a-zA-Z0-9\s]/

    if (value.length > 20) {
      setNameError("Name cannot be longer than 20 characters")
      return false
    }

    if (specialCharRegex.test(value)) {
      setNameError("Name cannot contain special characters")
      return false
    }

    setNameError("")
    return true
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDisplayName(value)
    validateName(value)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/jpg",
      "image/svg+xml",
      "image/svg",
    ]

    if (!validImageTypes.includes(file.type)) {
      addToast({
        type: "danger",
        title: "Invalid file type",
        message: "Please upload a valid image file (JPEG, PNG, WEBP, GIF, JPG, SVG).",
        duration: 5000,
      })
      return
    }

    let finalBlob = file
    if (file.size > 100 * 1024) {
      addToast({
        type: "warning",
        title: "File too large to upload",
        message: "Image size exceeds 100KB. It will be compressed before upload under 100KB.",
        duration: 5000,
      })
      try {
        const compressedBlob = await compressImageToUnder100KB(file)
        finalBlob = new File([compressedBlob], file.name, {
          type: compressedBlob.type || file.type,
          lastModified: Date.now(),
        })
        set_image_type("file")
        set_image(URL.createObjectURL(finalBlob))
      } catch (error) {
        addToast({
          type: "danger",
          title: "Compression failed",
          message: "Unable to compress image to under 100KB. Please try another image.",
          duration: 5000,
        })
        return
      }
    } else {
      set_image_type("file")
      set_image(URL.createObjectURL(file))
    }
  }

  const handleContinue = () => {
    if (!displayName.trim()) {
      setNameError("Name is required")
      return
    }

    if (!validateName(displayName)) {
      return
    }

    onNext()
  }

  const fetchFromArns = async () => {
    setLoading(true)
    await set_details(process_id)
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
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4 group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                {image.length > 0 ? (
                  image_type === "url" ? (
                    <img src={`https://arweave.net/${image}`} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <img src={image || "/placeholder.svg"} alt="profile" className="w-full h-full object-cover" />
                  )
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
              Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={handleNameChange}
                className={`bg-zinc-800 border ${
                  nameError ? "border-red-500" : "border-zinc-700"
                } text-white rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 ${
                  nameError ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="Enter your name"
                maxLength={20}
              />
            </div>
            {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
            <p className="text-gray-500 text-xs">Max 20 characters, no special characters allowed</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                disabled={true}
                value={name}
                onChange={(e) => set_name(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60"
                placeholder="Alex Smith"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Bio <span className="text-red-400">*</span>
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
            </motion.button>
          )}
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
            className={`bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2 group ${
              !image || !displayName.trim() || nameError ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleContinue}
            disabled={!image || !displayName.trim() || !!nameError}
          >
            Continue
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </>
  )
}

async function compressImageToUnder100KB(file: File): Promise<Blob> {
  const maxSize = 100 * 1024 // 100 KB
  const imageBitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("Canvas not supported")

  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  ctx.drawImage(imageBitmap, 0, 0)

  let quality = 0.9
  let blob: Blob | null = null

  while (quality > 0.1) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality))

    if (blob && blob.size <= maxSize) {
      return blob
    }
    quality -= 0.1 // Reduce quality step-by-step
  }

  if (!blob) {
    showDanger("Compression failed", "Unable to compress image to under 100KB. Please try other image.")
    throw new Error("Compression failed")
  }

  return blob // Return best effort, even if slightly over 100KB
}
