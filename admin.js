// ====== CONFIG ======
const API_BASE = "https://your-backend.onrender.com"; // 🔴 replace with your actual Render backend URL

// ====== Elements ======
const loginForm = document.getElementById("login-form");
const adminPanel = document.getElementById("admin-panel");
const betForm = document.getElementById("bet-form");
const betList = document.getElementById("bet-list");

// ====== Admin Login ======
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      loginForm.style.display = "none";
      adminPanel.style.display = "block";
      loadBets();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    alert("Server error. Try again later.");
  }
});

// ====== Load Bets ======
async function loadBets() {
  betList.innerHTML = "";
  try {
    const res = await fetch(`${API_BASE}/predictions`);
    const bets = await res.json();

    bets.forEach((bet) => {
      const li = document.createElement("li");
      li.textContent = `${bet.date} | ${bet.time} | ${bet.match} | ${bet.prediction} | Odds: ${bet.odds}`;

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.classList.add("delete-btn");
      delBtn.addEventListener("click", () => deleteBet(bet._id));

      li.appendChild(delBtn);
      betList.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Error loading bets:", err);
    alert("Error fetching bets from server.");
  }
}

// ====== Add Bet ======
betForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const match = document.getElementById("match").value;
  const prediction = document.getElementById("prediction").value;
  const odds = document.getElementById("odds").value;

  try {
    const res = await fetch(`${API_BASE}/predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time, match, prediction, odds }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Prediction added!");
      betForm.reset();
      loadBets();
    } else {
      alert(data.message || "Error adding prediction");
    }
  } catch (err) {
    console.error("❌ Error adding bet:", err);
    alert("Server error. Try again later.");
  }
});

// ====== Delete Bet ======
async function deleteBet(id) {
  if (!confirm("Are you sure you want to delete this prediction?")) return;

  try {
    const res = await fetch(`${API_BASE}/predictions/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (res.ok) {
      alert("🗑️ Prediction deleted");
      loadBets();
    } else {
      alert(data.message || "Error deleting prediction");
    }
  } catch (err) {
    console.error("❌ Error deleting bet:", err);
    alert("Server error. Try again later.");
  }
}
