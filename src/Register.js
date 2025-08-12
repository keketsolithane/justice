import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// Supabase credentials
const SUPABASE_URL = "https://vhztoaoderjbeientrtn.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_1a9vPsiBaUTqk5diLkpLQA_AWVa3J3n";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if username exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(fetchError.message);
      }
      if (existingUser) {
        setError("⚠ Username already exists");
        setLoading(false);
        return;
      }

      // Insert new user
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ username, password, role }]);

      if (insertError) throw new Error(insertError.message);

      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-box">
        <h2>Create an Account</h2>
        <p className="subtitle">
          Please fill in your details to register.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          placeholder="Enter your username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
          placeholder="Enter your password"
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="user">User (no access)</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="login-link">
          Already have an account?{" "}
          <Link to="/login">Go to Login</Link>
        </div>
      </form>

      <style jsx>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #007bff, #00c6ff);
        }
        .register-box {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
        }
        h2 {
          text-align: center;
          margin-bottom: 10px;
          color: #333;
        }
        .subtitle {
          text-align: center;
          color: #777;
          font-size: 14px;
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
          color: #555;
        }
        input,
        select {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }
        button {
          width: 100%;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          margin-top: 20px;
          cursor: pointer;
          font-size: 16px;
        }
        button:disabled {
          background: #999;
          cursor: not-allowed;
        }
        .error-msg {
          background: #ffe6e6;
          color: #d9534f;
          padding: 8px;
          margin-bottom: 10px;
          border-radius: 5px;
          font-size: 14px;
        }
        .login-link {
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
        }
        .login-link a {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default Register;
