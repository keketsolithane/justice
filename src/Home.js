import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const SUPABASE_URL = "https://vhztoaoderjbeientrtn.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_1a9vPsiBaUTqk5diLkpLQA_AWVa3J3n";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Home({ user, onLogout }) {
  const navigate = useNavigate(); // React Router navigation hook
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableType, setTableType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    setTableType(type);
    try {
      const { data, error } = await supabase
        .from(type)
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setData(data);
    } catch (err) {
      setError(`Failed to fetch ${type}: ${err.message}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const { error } = await supabase.from(tableType).delete().eq("id", id);
      if (error) throw error;
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditRow(item);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from(tableType)
        .update(editRow)
        .eq("id", editingId);
      if (error) throw error;
      setData(data.map((row) => (row.id === editingId ? editRow : row)));
      setEditingId(null);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // *** THIS FUNCTION MAKES THE CREATE ACCOUNT BUTTON WORK ***
  const handleCreateAccount = () => {
    navigate("/register"); // Correctly navigate to Register page
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Header with SparkleSmart Technologies */}
      <div className="main-header">SparkleSmart Technologies</div>

      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}</p>
        <div>
          <button onClick={() => fetchData("messages")}>Messages</button>
          <button onClick={() => fetchData("quotes")}>Requests</button>
          <button onClick={handleCreateAccount} className="create-account-btn">
            Create Account
          </button>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {loading && <p>Loading {tableType}...</p>}
      {error && <p className="error">{error}</p>}

      {tableType && !loading && (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredData.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  {Object.keys(filteredData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    {Object.keys(item).map((col) => (
                      <td key={col}>
                        {editingId === item.id ? (
                          <input
                            value={editRow[col] ?? ""}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                [col]: e.target.value,
                              })
                            }
                          />
                        ) : (
                          item[col]?.toString()
                        )}
                      </td>
                    ))}
                    <td>
                      {editingId === item.id ? (
                        <>
                          <button onClick={handleSave}>Save</button>
                          <button onClick={handleCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(item)}>Edit</button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No {tableType} found.</p>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} SparkleSmart Technologies. All rights
        reserved.
      </footer>

      <style jsx>{`
        .main-header {
          font-size: 28px;
          font-weight: bold;
          color: white;
          padding: 15px 20px;
          text-align: center;
          background-color: #00b3a4; /* solid color same as button start color */
          margin-bottom: 20px;
          user-select: none;
          border-radius: 6px;
        }
        .admin-container {
          padding: 20px;
          font-family: Arial, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
          border: none;
          background: linear-gradient(90deg, #00b3a4, #d32f2f);
          color: white;
          cursor: pointer;
          border-radius: 5px;
          transition: background 0.3s ease;
        }
        button:hover {
          background: linear-gradient(90deg, #009e92, #b62828);
        }
        .create-account-btn {
          background-color: #00b3a4; /* solid teal */
        }
        .create-account-btn:hover {
          background-color: #009e92;
        }
        .logout-btn {
          background: linear-gradient(90deg, #d32f2f, #00b3a4);
        }
        .logout-btn:hover {
          background: linear-gradient(90deg, #b62828, #009e92);
        }
        .search-bar {
          margin-bottom: 10px;
          flex-basis: 100%;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          flex-grow: 1;
        }
        .admin-table th,
        .admin-table td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .admin-table th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #00695c; /* dark teal to match header text */
        }
        .delete-btn {
          background-color: #e74c3c;
        }
        .delete-btn:hover {
          background-color: #c62828;
        }
        .admin-footer {
          margin-top: auto;
          padding: 15px 20px;
          background-color: #00b3a4;
          color: white;
          text-align: center;
          border-radius: 0 0 8px 8px;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default Home;
