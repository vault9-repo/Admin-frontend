// admin.js
const API_BASE = "https://admin-backend-7bsj.onrender.com"; // Render backend URL

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("predictionForm");
  const tableBody = document.querySelector("#predictionsTable tbody");
  const loginBtn = document.getElementById("loginBtn");

  // ===== Admin Login =====
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const password = document.getElementById("adminPassword").value;
      try {
        const res = await fetch(`${API_BASE}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        const data = await res.json();

        if (data.success) {
          window.location.href = "adminPanel.html";
        } else {
          document.getElementById("loginError").classList.remove("hidden");
        }
      } catch (err) {
        console.error("❌ Login error:", err);
        alert("Server error. Try again later.");
      }
    });
  }

  // ===== Fetch Predictions =====
  async function fetchPredictions() {
    try {
      const res = await fetch(`${API_BASE}/predictions`);
      const predictions = await res.json();

      tableBody.innerHTML = "";
      predictions.forEach((p) => {
        const row = `
          <tr>
            <td>${p.date}</td>
            <td>${p.time}</td>
            <td>${p.match}</td>
            <td>${p.prediction}</td>
            <td>${p.odds}</td>
            <td>
              <button onclick="deletePrediction('${p._id}')"
                class="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  }

  // ===== Add Prediction =====
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPrediction = {
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        match: document.getElementById("match").value,
        prediction: document.getElementById("prediction").value,
        odds: document.getElementById("odds").value,
      };

      try {
        await fetch(`${API_BASE}/predictions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPrediction),
        });
        form.reset();
        fetchPredictions();
      } catch (err) {
        console.error("❌ Add error:", err);
      }
    });
  }

  // ===== Delete Prediction =====
  window.deletePrediction = async (id) => {
    try {
      await fetch(`${API_BASE}/predictions/${id}`, { method: "DELETE" });
      fetchPredictions();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // Fetch predictions on page load
  if (tableBody) fetchPredictions();
});
