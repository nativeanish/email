import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, Lock } from "lucide-react";
import useOnboard from "../../store/useOnboard";
import { generateKeys } from "../../utils/crypto.ts";
import encrypt from "../../utils/wallet/encrypt.ts";
import registerUser from "../../utils/aos/registerUser.ts";
import Dialog from "../../Components/UI/Dialog/index.tsx";
import useLoading from "../../store/useLoading.ts";
import { showDanger, showSuccess } from "../../Components/UI/Toast/Toast-Context.tsx";
import { useNavigate } from "react-router-dom";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}
export default function Step3Keys({ onNext, onBack }: Step3Props) {
 const naviage = useNavigate()
  const [generatingKeys, setGeneratingKeys] = useState(false);
  const [progress, setProgress] = useState(0);
  const { name, image, type, keys, set_keys, display_name, bio } = useOnboard();
  const [uploadded, ] = useState(false);
  const {
    open,
    setTitle,
    setDescription,
    setDarkMode,
    setSize,
    setShowCloseButton,
    close,
  } = useLoading();
  useEffect(() => {
    if (!(name && image && type && display_name && display_name.length > 0 && display_name.length <= 20 && bio)) {
      onBack();
    }
  }, [name, image, type, onBack]);
  useEffect(() => {
    startKeyGeneration();
    generateKeys()
      .then(({ publicKey, privateKey }) => {
        console.log("Keys generated:", publicKey, privateKey);
        set_keys({ publicKey, privateKey });
      })
      .catch((error) => {
        console.error("Error generating keys:", error);
      });
  }, [set_keys]);

  const startKeyGeneration = () => {
    setGeneratingKeys(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setGeneratingKeys(false);
        }, 500);
      }
    }, 100);
  };

  const save = async () => {
    if (!keys || !keys.privateKey) {
      showDanger(
        "No Keys Found",
        "Please generate your keys before proceeding.",
        6000
      );
      setTimeout(() => {
        naviage("/")
      }, 4000);
      return;
    }
    setTitle("Encrypting Keys");
    setDescription("Allow your Wallet to encrypt your keys securely.");
    setDarkMode(true);
    setSize("md");
    setShowCloseButton(false);
    open();
    if (!keys || !keys.privateKey) {
      close();
      showDanger(
        "No Keys Found",
        "Please generate your keys before proceeding.",
        6000
      );
      console.error("No keys or private key found");
      naviage("/");
      return;
    }
    const encrypted_privateKey = await encrypt(keys.privateKey);
    if (!encrypted_privateKey) {
      close();
      showDanger(
        "Encryption Failed",
        "Encryption failed. Please check your wallet connection.",
        6000
      );
      console.error("Encryption failed");
      return;
    }
    console.log("Encrypted Private Key:", encrypted_privateKey);
    const sa = await registerUser(encrypted_privateKey)
    console.log("Registration Status:", sa);
    if(sa){
      close();
      showSuccess("Registration Successful", "Your keys have been securely registered.", 3000);
      onNext();
    }else{
      close();
      showDanger("Registration Failed", "Failed to register your Account. Please try again.", 6000);
      console.error("Registration failed");
      naviage("/");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          Generating your keys
        </h2>
        <p className="text-gray-400">
          Please wait while we generate secure encryption keys for your email.
        </p>
      </motion.div>

      <div className="space-y-8 w-full">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative w-40 h-40 mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: generatingKeys ? 360 : 0,
              }}
              transition={{
                duration: 2,
                repeat: generatingKeys ? Number.POSITIVE_INFINITY : 0,
                ease: "linear",
              }}
            >
              <Lock className="h-16 w-16 text-white" />
            </motion.div>

            {/* Circular progress indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="8"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray="465"
                strokeDashoffset={465 - (465 * progress) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 465 }}
                animate={{ strokeDashoffset: 465 - (465 * progress) / 100 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold mb-2">
              {progress < 100 ? `${progress}% Complete` : "Keys Generated!"}
            </p>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              {progress < 100
                ? "Creating secure encryption keys for your emails..."
                : "Your encryption keys have been successfully generated."}
            </p>
          </div>
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
              generatingKeys ? "opacity-50 cursor-not-allowed" : ""
            }`}
            whileHover={!generatingKeys ? { scale: 1.03 } : {}}
            whileTap={!generatingKeys ? { scale: 0.97 } : {}}
            onClick={() => save().then(console.log).catch(console.log)}
            disabled={generatingKeys}
          >
            {uploadded ? <>Continue</> : <>Register</>}
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
      <Dialog />
    </>
  );
}
