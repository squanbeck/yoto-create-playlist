import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getTokens, storageKey } from "../token-utils";

export default function App() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        setError(null);
        
        const tokens = await getTokens();

        if (!tokens) {
          navigate("/login");
          return;
        }

        const groupRes = await fetch("https://api.yotoplay.com/card/family/library/groups", {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        if (groupRes.ok) {
          const { groups } = await groupRes.json();
          console.log("groups", groups);
          setGroups(groups);
        } else {
          console.error(`Failed to fetch groups: ${res.status}`);
        }
        
        const cardRes = await fetch("https://api.yotoplay.com/content/mine", {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        if (cardRes.ok) {
          const { cards } = await cardRes.json();
          console.log("cards", cards);
          setCards(cards);
        } else {
          console.error(`Failed to fetch cards: ${res.status}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [navigate]);

  const handleLogout = () => {
    console.log("Logout clicked, clearing tokens...");
    console.log("Storage key:", storageKey);
    console.log("Before logout - localStorage:", localStorage.getItem(storageKey));
    localStorage.removeItem(storageKey);
    console.log("After logout - localStorage:", localStorage.getItem(storageKey));
    navigate("/login");
  };

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (error) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>Welcome to the App</h1>
          <button 
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Logout
          </button>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Welcome to the App</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Logout
        </button>
      </div>
      <p>Here's a list of your cards</p>
      <ul>
        {cards.map((card) => (
          <li key={card.cardId}>{card.title}</li>
        ))}
      </ul>
    </div>
  );
}
