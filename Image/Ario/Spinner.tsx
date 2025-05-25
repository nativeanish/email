import React from "react"

interface SpinnerProps {
  theme?: "light" | "dark"
  size?: number // optional: allow resizing
}

const Spinner: React.FC<SpinnerProps> = ({ theme = "light", size = 64 }) => {
  const color = theme === "dark" ? "#FFFFFF" : "#000000"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke={color}
        strokeWidth="5"
        fill="none"
        opacity="0.2"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.4 100"
        transform="rotate(-90 25 25)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 25 25;360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

export default Spinner

