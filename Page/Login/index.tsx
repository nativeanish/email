import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
 const navigate = useNavigate()
  useEffect(() => {
  navigate("/")
  },[])
  return (
    <div>Login Here</div>
  )
}

export default Login