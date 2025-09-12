const backendUrl = "https://your-backend.onrender.com"; // change to your Render backend URL

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("password");
  const loginSection = document.getElementById("loginSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const logoutBtn = document.getElementById("logoutBtn");

  const betForm = document.getElementById("betForm");
  const betsList = document.getElementById("betsList");

  // ===== Login =====
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();

    try {
      const res = await fetch(`${backendUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        loadBets();
      } else {
        alert(data.message || "Incorrect password!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Try again later.");
    }
  });

  // ===== Logout =====
  logoutBtn.addEventListener("click", () => {
    dashboardSection.style.display = "none";
    loginSection.style.display = "block";
    passwordInput.value = "";
  });

  // ===== Add Bet =====
  betForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newBet = {
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      match: document.getElementById("match").value,
      prediction: document.getElementById("prediction").value,
      odds: document.getElementById("odds").value,
    };

    try {
      const res = await fetch(`${backendUrl}/predictions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBet),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Prediction added!");
        betForm.reset();
        loadBets();
      } else {
        alert(data.message || "Error adding prediction");
      }
    } catch (err) {
      console.error("Add bet error:", err);
      alert("Server error. Try again later.");
    }
  });

  // ===== Load Bets =====
  async function loadBets() {
    betsList.innerHTML = "";
    try {
      const res = await fetch(`${backendUrl}/predictions`);
      const data = await res.json();

      data.forEach((bet) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${bet.date} ${bet.time} - ${bet.match} | <strong>${bet.prediction}</strong> (odds: ${bet.odds})
          <button data-id="${bet._id}">Delete</button>
        `;
        li.querySelector("button").addEventListener("click", () => deleteBet(bet._id));
        betsList.appendChild(li);
      });
    } catch (err) {
      console.error("Load bets error:", err);
    }
  }

  // ===== Delete Bet =====
  async function deleteBet(id) {
    if (!confirm("Delete this prediction?")) return;

    try {
      const res = await fetch(`${backendUrl}/predictions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Prediction deleted!");
        loadBets();
      } else {
        alert("Error deleting prediction");
      }
    } catch (err) {
      console.error("Delete bet error:", err);
    }
  }
});
