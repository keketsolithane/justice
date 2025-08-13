import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { User, DataRow } from "./types";

const SUPABASE_URL = "https://vhztoaoderjbeientrtn.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_1a9vPsiBaUTqk5diLkpLQA_AWVa3J3n";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type HomeProps = {
  user: User;
  onLogout: () => void;
};

function Home({ user, onLogout }: HomeProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableType, setTableType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<Partial<DataRow>>({});

  const fetchData = async (type: string) => {
    setLoading(true);
    setError(null);
    setTableType(type);
    try {
      const { data: fetchedData, error } = await supabase
        .from(type)
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setData(fetchedData as DataRow[]);
    } catch (err: any) {
      setError(`Failed to fetch ${type}: ${err.message}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const { error } = await supabase.from(tableType).delete().eq("id", id);
      if (error) throw error;
      setData(data.filter((item) => item.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleEdit = (item: DataRow) => {
    setEditingId(item.id);
    setEditRow(item);
  };

  const handleSave = async () => {
    if (editingId === null) return;
    try {
      const { error } = await supabase
        .from(tableType)
        .update(editRow)
        .eq("id", editingId);
      if (error) throw error;
      setData(data.map((row) => (row.id === editingId ? { ...row, ...editRow } : row)));
      setEditingId(null);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    }
  };

  const handleCancel = () => setEditingId(null);
  const handleCreateAccount = () => navigate("/register");

  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* HEADER */}
      <div className="main-header">SparkleSmart Technologies</div>

      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}</p>
        <div className="header-buttons">
          <button onClick={() => fetchData("messages")} className="card-btn">
            Messages
          </button>
          <button onClick={() => fetchData("quotes")} className="card-btn">
            Requests
          </button>
          <button onClick={handleCreateAccount} className="card-btn create">
            Create Account
          </button>
          <button onClick={onLogout} className="card-btn logout">
            Logout
          </button>
        </div>
      </header>

      {/* LOADING & ERROR */}
      {loading && <p className="loading">Loading {tableType}...</p>}
      {error && <p className="error">{error}</p>}

      {/* SEARCH AND TABLE */}
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
                            value={editRow[col as keyof DataRow] ?? ""}
                            onChange={(e) =>
                              setEditRow({ ...editRow, [col]: e.target.value })
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
            <p className="no-data">No {tableType} found.</p>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} SparkleSmart Technologies. All rights
        reserved.
      </footer>

      {/* STYLING */}
      <style >{`
        * {
          box-sizing: border-box;
        }
        .admin-container {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f0f2f5;
        }
        .main-header {
          background: linear-gradient(90deg, #00b3a4, #1e3c72);
          color: white;
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          padding: 20px;
          border-radius: 0 0 15px 15px;
          letter-spacing: 1px;
        }
        .admin-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 0;
        }
        .admin-header h1 {
          color: #1e3c72;
        }
        .admin-header p {
          color: #555;
          margin-bottom: 15px;
        }
        .header-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
        }
        .card-btn {
          padding: 12px 25px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          font-size: 14px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .card-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .card-btn.create { background: #00b3a4; }
        .card-btn.logout { background: #d32f2f; }

        .search-bar {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        .search-bar input {
          width: 50%;
          padding: 10px 15px;
          border-radius: 50px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .search-bar input:focus {
          border-color: #00b3a4;
          box-shadow: 0 0 10px rgba(0, 179, 164, 0.3);
        }

        .admin-table {
          width: 90%;
          margin: 0 auto 30px auto;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .admin-table th,
        .admin-table td {
          padding: 12px 15px;
          text-align: left;
        }
        .admin-table th {
          background: #00b3a4;
          color: white;
          font-weight: 600;
        }
        .admin-table tbody tr {
          transition: background 0.3s ease;
        }
        .admin-table tbody tr:hover {
          background: #f1faff;
        }
        .admin-table input {
          padding: 6px 8px;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button.delete-btn {
          background: #d32f2f;
          color: white;
          padding: 6px 12px;
          border-radius: 5px;
          margin-left: 5px;
        }
        .loading,
        .error,
        .no-data {
          text-align: center;
          color: #555;
          font-weight: 500;
          margin: 15px 0;
        }
        .admin-footer {
          margin-top: auto;
          background: #1e3c72;
          color: white;
          text-align: center;
          padding: 15px 0;
          border-radius: 15px 15px 0 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default Home;
