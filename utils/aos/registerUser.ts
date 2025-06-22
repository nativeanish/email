import { showDanger } from "../../Components/UI/Toast/Toast-Context";
import useLoading from "../../store/useLoading";
import useOnboard from "../../store/useOnboard";
import sign from "../wallet/sign";
import upload from "../wallet/upload";
import register from "./core/register";
export default async function registerUser(privateKey: string): Promise<boolean> {
  const {
    name,
    image,
    image_type,
    set_image,
    set_image_type,
    bio,
    keys,
    arns,
  } = useOnboard.getState();
  if (image_type === "file") {
    useLoading.setState({
      title: "Uploading image",
      description: "Please wait while we upload your image.",
      showCloseButton: true,
    });
    if (!image) {
      showDanger(
        "No image selected",
        "Please select an image to upload.",
        5000
      );
      return false;
    }
    try {
      const _image = await fetch(image);
      if (!_image.ok) {
        showDanger("Fetch failed", `Status: ${_image.status}`, 5000);
        return false;
      }
      const blob = await _image.blob();
      const mimeType = blob.type || "";
      if (!mimeType.startsWith("image/")) {
        showDanger(
          "Invalid image",
          "The fetched file is not a valid image.",
          5000
        );
        return false;
      }
      const image_buffer = await blob.arrayBuffer();
      const sig = await sign(new Uint8Array(image_buffer), mimeType);
      if (!sig) {
        showDanger("Signing failed", "Could not sign the image.", 5000);
        return false;
      }
      const id = await upload(sig);
      if (id) {
        console.log("Image uploaded successfully:", id);
        console.log("Keys:", JSON.stringify(keys));
        set_image(id);
        set_image_type("url");
        return await registerUser(privateKey); // <-- FIX: return the result!
      } else {
        showDanger("Upload failed", "Failed to upload the image.", 5000);
        return false;
      }
    } catch (err) {
      console.error("Image fetch error:", err);
      showDanger(
        "Unexpected error",
        "Something went wrong while handling the image.",
        5000
      );
      return false;
    }
  }
  if (image_type === "url" && keys?.publicKey && privateKey) {
    try {
      useLoading.setState({
        title: "Registering User",
        description: "Please wait while we register your user.",
      });
      const tag = {
        username: name,
        image: image,
        bio: bio,
        isArns: arns ? true : false,
        privateKey: privateKey,
        publicKey: keys.publicKey,
      };
      const tags = [
        { name: "Action", value: "Evaluate" },
        { name: "registerAccount", value: JSON.stringify(tag) },
      ];
      const data = await register(tags);
      if (!data || !data.Messages || !data.Messages[0] || !data.Messages[0].Data) {
        showDanger("Registration failed", "Malformed response from registration.", 5000);
        return false;
      }
      let stats;
      try {
        stats = JSON.parse(data.Messages[0].Data);
      } catch (e) {
        showDanger("Registration failed", "Could not parse registration response.", 5000);
        return false;
      }
      console.log("Registration stats:", stats, typeof stats.status);
      if (stats.status === 1 || stats.status === "1") {
        return true;
      }
      showDanger("Registration failed", `Status: ${stats.status}`, 5000);
      return false;
    } catch (err) {
      console.error("Error setting loading state:", err);
      showDanger("Registger error", "Failed to set loading state.", 5000);
      return false;
    }
  }
  return false
}
