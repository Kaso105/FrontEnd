import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress } from "@mui/material";
import { AuthContext } from '../contexts/auth/auth.context';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBWQHmOEAu32foNykCmHI4OsiwP7RxGnVY",
  authDomain: "winter-clone-408105.firebaseapp.com",
  projectId: "winter-clone-408105",
  storageBucket: "winter-clone-408105.appspot.com",
  messagingSenderId: "972392293350",
  appId: "1:972392293350:web:1f76198f6f2e0ec6966c27",
  measurementId: "G-TT3GQ819Q1"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
const Login = () => {
  
  const authState = useContext(AuthContext);

  const [form, setForm] = useState({username: "", password: ""})

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.get(`http://localhost:8080/cmcapp-backend-1.0/api/v1/admin/username/${form.username}`);
      console.log("hola");
      const user = response.data.response;
      console.log(user._username);
      const credentials = await signInWithEmailAndPassword(auth, form.username, form.password);
      console.log(credentials);
      if (form.username === user._username && form.password === user._password)
        authState.dispatch({type: "authenticated", payload: user});
      else
        alert("Credenciales incorrectas");

    }catch(error){
      console.log(error);
      alert("Error interno.");
    }finally{
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setForm( prev => ({...prev, [e.target.name]: e.target.value}) );
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form className="form-content" onSubmit={handleLogin}>
        <TextField
          name="username"
          label="Username"
          type="text"
          value={form.username}
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={form.password}
          variant="outlined"
          onChange={handleChange}
        />
          {
            isLoading ? <CircularProgress /> :
            <Button type="submit" variant="contained">
              Ingresar
            </Button>
          }
      </form>
    </div>
  );
}

export default Login;
