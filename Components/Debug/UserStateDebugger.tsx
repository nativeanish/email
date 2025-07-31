import { useEffect } from "react";
import useLoginUser from "../../store/useLoginUser";
import { debugUserState } from "../../utils/mail/fetchstore";

export function UserStateDebugger() {
  const { user } = useLoginUser();

  useEffect(() => {
    console.log("UserStateDebugger: User state changed");
    debugUserState();
  }, [user]);

  // This component is for debugging only - render nothing in production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
        borderRadius: "4px",
      }}
    >
      <h4>Debug: User State</h4>
      <div>Has User: {user ? "Yes" : "No"}</div>
      {user && (
        <>
          <div>Has Private Key: {user.privateKey ? "Yes" : "No"}</div>
          <div>Has Public Key: {user.publicKey ? "Yes" : "No"}</div>
          {user.privateKey && (
            <>
              <div>Private Key Type: {typeof user.privateKey}</div>
              <div>Starts with: {user.privateKey.substring(0, 20)}...</div>
              <div>
                Has BEGIN:{" "}
                {user.privateKey.includes("-----BEGIN") ? "Yes" : "No"}
              </div>
              <div>
                Has PRIVATE:{" "}
                {user.privateKey.includes("PRIVATE KEY") ? "Yes" : "No"}
              </div>
            </>
          )}
        </>
      )}
      <button
        onClick={() => debugUserState()}
        style={{
          marginTop: "5px",
          padding: "2px 6px",
          fontSize: "10px",
          background: "#007acc",
          color: "white",
          border: "none",
          borderRadius: "2px",
          cursor: "pointer",
        }}
      >
        Log Debug Info
      </button>
    </div>
  );
}
