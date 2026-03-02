import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🧘 Prakruti AI</h1>
        <div className="dashboard-buttons">
          <button type="button" onClick={() => navigate("/login")}>Login</button>
          <button type="button" onClick={() => navigate("/signup")}>Signup</button>
        </div>
      </header>

      <div className="dashboard-content">
        <h2>What is Prakruti?</h2>
        <p>
          In Ayurveda, <strong>Prakruti</strong> refers to your natural body constitution.
          It is determined at birth and represents the balance of Vata, Pitta, and Kapha.
        </p>

        <h2>🌬️ Vata</h2>
        <p>
          Vata governs movement — breathing, circulation, thoughts.
          Balanced Vata gives creativity and flexibility.
        </p>

        <h2>🔥 Pitta</h2>
        <p>
          Pitta governs digestion and metabolism.
          Balanced Pitta gives intelligence and leadership.
        </p>

        <h2>🌱 Kapha</h2>
        <p>
          Kapha governs structure and immunity.
          Balanced Kapha gives strength and calmness.
        </p>

        <h2>Agni</h2>
        <p>
          Agni means digestive fire. Strong Agni keeps the body healthy.
        </p>

        <h2>Vikruti</h2>
        <p>
          Vikruti is your current imbalance caused by stress, diet, or lifestyle.
        </p>
      </div>
    </div>
  );
}