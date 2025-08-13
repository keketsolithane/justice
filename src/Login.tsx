import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { User } from "./types";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  onLogin: (user: User) => void;
};

const SUPABASE_URL = "https://vhztoaoderjbeientrtn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1a9vPsiBaUTqk5diLkpLQA_AWVa3J3n";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (fetchError) {
        setError("Login failed: " + fetchError.message);
        setLoading(false);
        return;
      }

      if (!user || user.password !== password) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      if (user.role !== "admin") {
        setError("Access denied: only Admins can login here");
        setLoading(false);
        return;
      }

      onLogin(user as User);
    } catch (err: any) {
      setError("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
      </div>

      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #007bff, #00c6ff);
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          }
          .login-card {
            background: #fff;
            padding: 40px 30px;
            border-radius: 15px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            text-align: center;
          }
          .login-card h2 {
            color: #1e3c72;
            margin-bottom: 20px;
          }
          input {
            width: 100%;
            padding: 12px 15px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 8px;
            outline: none;
            font-size: 14px;
          }
          input:focus {
            border-color: #00b3a4;
            box-shadow: 0 0 8px rgba(0, 179, 164, 0.3);
          }
          button {
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            border: none;
            border-radius: 8px;
            background: #00b3a4;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
          .error-msg {
            background: #ffe6e6;
            color: #d32f2f;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            font-size: 14px;
          }
          .register-link {
            margin-top: 15px;
            font-size: 14px;
            color: #555;
          }
          .register-link span {
            color: #00b3a4;
            font-weight: bold;
            cursor: pointer;
          }
          .register-link span:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
