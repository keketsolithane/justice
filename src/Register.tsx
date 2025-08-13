import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vhztoaoderjbeientrtn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1a9vPsiBaUTqk5diLkpLQA_AWVa3J3n";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw new Error(fetchError.message);
      if (existingUser) {
        setError("⚠ Username already exists");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("users")
        .insert([{ username, password, role }]);

      if (insertError) throw new Error(insertError.message);

      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">SparkleSmart Technologies</div>
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create an Account</h2>
        {error && <div className="error-msg">{error}</div>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}>
          <option value="admin">Admin</option>
          <option value="user">User (no access)</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <footer className="register-footer">
        &copy; {new Date().getFullYear()} SparkleSmart Technologies. All rights reserved.
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .register-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background: #f0f2f5;
          padding: 20px;
        }
        .register-header {
          font-size: 28px;
          font-weight: 700;
          color: white;
          background: linear-gradient(90deg, #00b3a4, #1e3c72);
          text-align: center;
          padding: 20px;
          border-radius: 0 0 15px 15px;
          width: 100%;
          max-width: 400px;
          margin-bottom: 30px;
        }
        .register-form {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .register-form h2 {
          text-align: center;
          color: #1e3c72;
          margin-bottom: 10px;
        }
        .register-form input,
        .register-form select {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }
        .register-form input:focus,
        .register-form select:focus {
          border-color: #00b3a4;
          box-shadow: 0 0 10px rgba(0,179,164,0.3);
        }
        .register-form button {
          padding: 12px 15px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #00b3a4, #1e3c72);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        .register-form button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .register-form button:disabled {
          background: #999;
          cursor: not-allowed;
        }
        .error-msg {
          color: #d32f2f;
          background: #ffe6e6;
          padding: 8px;
          border-radius: 5px;
          font-size: 14px;
          text-align: center;
        }
        .register-footer {
          margin-top: auto;
          text-align: center;
          padding: 15px 0;
          font-size: 14px;
          color: white;
          background: #1e3c72;
          border-radius: 15px 15px 0 0;
          width: 100%;
          max-width: 400px;
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
}

export default Register;
