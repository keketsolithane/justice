import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './login.css';

const SUPABASE_URL = 'https://vhztoaoderjbeientrtn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1a9vPsiBaUTqk5diLkpLQA_AWVa3J3n';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (fetchError) {
        setError('Login failed: ' + fetchError.message);
        setLoading(false);
        return;
      }

      if (!user || user.password !== password) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      if (user.role !== 'admin') {
        setError('Access denied: only Admins can login here');
        setLoading(false);
        return;
      }

      onLogin(user);
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">Welcome Back</h2>

        {error && <div className="login-error">{error}</div>}

        <div className="input-group">
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
            className={username ? 'filled' : ''}
          />
          <label htmlFor="username">Username</label>
        </div>

        <div className="input-group">
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
            className={password ? 'filled' : ''}
          />
          <label htmlFor="password">Password</label>
        </div>

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

      </form>
    </div>
  );
}

export default Login;
