import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import useAddress from "../../store/useAddress";
import Arweave from "../../Image/Arweave";
import Ario from "../../Image/Ario";
import useOnboard from "../../store/useOnboard";
import { useNavigate } from "react-router-dom";
import { check_user } from "../../utils/ao";
import { showDanger } from "../../Components/UI/Toast/Toast-Context";
import { get_wallet_ario, set_details } from "../../utils/arns";
import Dialog from "../../Components/UI/Dialog";
import useLoading from "../../store/useLoading";

interface Step1Props {
  onNext: (type: "arns" | "wallet") => void;
}

export default function Step1EmailType({ onNext }: Step1Props) {
  const { address, walletType } = useAddress();
  const { arns_name, process_id, set_type, type, arns, image } = useOnboard();
  const route = useNavigate();
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
    async function _check_user(address: string) {
      setTitle("Checking User Status") 
      setDescription(
        "Please wait while we check your user status."
      );
      setDarkMode(true);
      setSize("md");
      setShowCloseButton(false);
      open();
      const result = await check_user(address);
      if (!result) {
        close();
        showDanger(
          "Error Checking user.",
          "Error Checking user, please try again later. Redirecting .....",
          5000
        );
        setTimeout(() => {
          route("/");
        }, 6000);
        return;
      }
      console.log("Check user result:", result);
      if (result.status === 1) {
        close();
        route("/inbox");
        return;
      }
      setTitle("Checking ARIO registration");
       setDescription(
        "Please wait while we check your ARIO registration status."
      );
      const data = await get_wallet_ario(address);
      setTitle("Fetching ARIO data");
      setDescription("Please wait while we fetch your ARIO data.");
      if (data === undefined) {
        close();
        setTimeout(() => {
          showDanger(
            "Error in ARIO data",
            "Failed to fetch ARIO data. Please try again later. Redirecting .....",
            6000
          );
          route("/404");
        }, 6000);
      }
      if (data === false) {
        close();
        return;
      }
      if (
        data &&
        arns &&
        arns_name &&
        process_id &&
        process_id.length > 0 &&
        arns_name.length > 0
      ) {
        await set_details(process_id);
        close();
        return true;
      }
      close();
      return true;
    }
    if (address && address.length > 0 && walletType && walletType.length > 0) {
      _check_user(address)
        .then(() => close())
        .catch((err) => {
          console.log(err);
          close();
        });
    }
  }, []);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          Choose your email type
        </h2>
        <p className="text-gray-400">
          Creating your decentralized email is just a few steps away. Enter your
          details to continue.
        </p>
      </motion.div>

      <div className="space-y-4 w-full">
        <motion.div
          className={`border ${
            type === "arns" ? "border-white" : "border-zinc-700"
          } 
          bg-zinc-800/50 rounded-lg p-5 flex items-center hover:bg-zinc-800 transition-all duration-300 
          cursor-pointer relative overflow-hidden group ${
            !arns_name && (!arns_name || arns_name.length === 0)
              ? "opacity-50 pointer-events-none cursor-not-allowed"
              : ""
          }`}
          onClick={() => {
            if (arns_name && arns_name.length > 0) {
              set_type("arns");
            }
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent ${
              type === "arns" ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500`}
          ></div>
          <div
            className={`h-14 w-14 rounded-lg flex items-center justify-center mr-5 transition-all duration-500 ${
              type === "arns" ? "bg-white" : "bg-zinc-800"
            }`}
          >
            <div
              className={`h-7 w-7 transition-colors duration-500 ${
                type === "arns" ? "text-black" : "text-gray-400"
              }`}
            >
              {image && image.length > 0 ? (
                <img src={`https://arweave.net/${image}`} alt="ArNS" className="h-6 w-7 rounded-full" />
              ) : (
                <Ario theme={type === "arns" ? "dark" : "light"} />
              )}
            </div>
          </div>
          <div className="flex-1 z-10">
            <h3 className="font-medium text-lg">
              {arns_name && arns_name.length > 0 ? arns_name : "ArNS"}
            </h3>
            <p className="text-sm text-gray-400">
              {arns_name && arns_name.length > 0 ? (
                <>{arns_name}</>
              ) : (
                <>demouser</>
              )}
              @perma.email
            </p>
          </div>
          <motion.div
            className="text-white"
            initial={{ x: 10, opacity: 0 }}
            animate={{
              x: type === "arns" ? 0 : 10,
              opacity: type === "arns" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-white"
            initial={{ width: "0%" }}
            animate={{ width: type === "arns" ? "100%" : "0%" }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>
        <motion.div
          className={`border ${
            type === "wallet" ? "border-white" : "border-zinc-700"
          } 
          bg-zinc-800/50 rounded-lg p-5 flex items-center hover:bg-zinc-800 transition-all duration-300 
          cursor-pointer relative overflow-hidden group`}
          onClick={() => set_type("wallet")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent ${
              type === "wallet" ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500`}
          ></div>
          <div
            className={`h-14 w-14 rounded-lg flex items-center justify-center mr-5 transition-all duration-500 ${
              type === "wallet" ? "bg-white" : "bg-zinc-800"
            }`}
          >
            <div
              className={`h-7 w-7 transition-colors duration-500 ${
                type === "wallet" ? "text-black" : "text-gray-400"
              }`}
            >
              <Arweave theme={type === "wallet" ? "light" : "dark"} />
            </div>
          </div>
          <div className="flex-1 z-10">
            <h3 className="font-medium text-lg">Address</h3>
            <p className="text-sm text-gray-400">
              {address && address.slice(0, 6)}...@perma.email
            </p>
          </div>
          <motion.div
            className="text-white"
            initial={{ x: 10, opacity: 0 }}
            animate={{
              x: type === "wallet" ? 0 : 10,
              opacity: type === "wallet" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-white"
            initial={{ width: "0%" }}
            animate={{ width: type === "wallet" ? "100%" : "0%" }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>
      </div>

      <motion.div
        className="mt-8 flex justify-center w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: type ? 1 : 0,
          y: type ? 0 : 10,
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2 group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => type && onNext(type)}
          disabled={!type}
        >
          Continue
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
      <Dialog />
    </>
  );
}
