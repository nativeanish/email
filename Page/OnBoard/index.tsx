import { useState, useEffect } from "react";
import { Lock, User, Key, CheckCircle } from "lucide-react";
import useAddress from "../../store/useAddress";
import OnboardLayout from "./OnBoardLayout";
import Step1EmailType from "./Step1EmailType";
import Step2Profile from "./Step2Profile";
import Step3Keys from "./Step3Keys";
import Step4Complete from "./Step4Complete";
import { useNavigate } from "react-router-dom";
import { autoconnect, metamask } from "../../utils/wallet";

export default function OnBoard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { address, walletType } = useAddress();
  const navigate = useNavigate();
  // Check if user is authenticated
  useEffect(() => {
    // If we're not on step 1 and there's no wallet connected, go back to step 1
    if (currentStep > 1 && (!address || !walletType)) {
      setCurrentStep(1);
    }
  }, [address, walletType, currentStep]);

  useEffect(() => {
    const run = async () => {
      await autoconnect();
      console.log("Metamask check completed", address, walletType);
      if (
        !(address && address.length > 0 && walletType && walletType.length > 0)
      ) {
        navigate("/login");
      }else{

      }
    };
    run();
  }, [address, walletType]);

  // Step 1 completion handler
  const handleStep1Complete = () => {
    setCurrentStep(2);
  };

  // Step 2 completion handler
  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  // Step 3 completion handler
  const handleStep3Complete = () => {
    // Store that keys were generated
    localStorage.setItem("keysGenerated", "true");
    setCurrentStep(4);
  };

  // Get the appropriate icon, title and description for the current step
  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          icon: <Lock className="h-4 w-4" />,
          title: "A few clicks away from secure decentralized email.",
          description:
            "Create your permanent email in minutes. Secure, private, and censorship-resistant.",
        };
      case 2:
        return {
          icon: <User className="h-4 w-4" />,
          title: "Tell us a bit about yourself.",
          description:
            "Create your profile to personalize your permanent email experience.",
        };
      case 3:
        return {
          icon: <Key className="h-4 w-4" />,
          title: "Generating your encryption keys.",
          description:
            "We're creating secure keys to ensure your emails remain private and protected.",
        };
      case 4:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: "You're all set to start using PermaEmail!",
          description:
            "Your decentralized email is ready. Enjoy secure, private, and censorship-resistant communication.",
        };
      default:
        return {
          icon: <Lock className="h-4 w-4" />,
          title: "A few clicks away from secure decentralized email.",
          description:
            "Create your permanent email in minutes. Secure, private, and censorship-resistant.",
        };
    }
  };

  const { icon, title, description } = getStepInfo();

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1EmailType onNext={handleStep1Complete} />;
      case 2:
        return (
          <Step2Profile
            onNext={handleStep2Complete}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <Step3Keys
            onNext={handleStep3Complete}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return <Step4Complete />;
      default:
        return <Step1EmailType onNext={handleStep1Complete} />;
    }
  };

  return (
    <OnboardLayout
      currentStep={currentStep}
      icon={icon}
      title={title}
      description={description}
    >
      {renderStep()}
    </OnboardLayout>
  );
}
