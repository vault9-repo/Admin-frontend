const API_BASE = "https://admin-backend-7bsj.onrender.com"; // 🔗 Your backend URL

// Elements
const predictionForm = document.getElementById("predictionForm");
const betsTableBody = document.querySelector("#betsTable tbody");

// ===== Load Predictions =====
async function loadPredictions() {
  try {
    const res = await fetch(`${API_BASE}/predictions`);
    const predictions = await res.json();

    betsTableBody.innerHTML = "";

    predictions.forEach(pred => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${pred.date}</td>
        <td>${pred.time}</td>
        <td>${pred.match}</td>
        <td>${pred.prediction}</td>
        <td>${pred.odds}</td>
        <td><button class="delete-btn" onclick="deletePrediction('${pred._id}')">Delete</button></td>
      `;
      betsTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("❌ Error loading predictions:", err);
  }
}

// ===== Add Prediction =====
predictionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPrediction = {
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    match: document.getElementById("match").value,
    prediction: document.getElementById("prediction").value,
    odds: document.getElementById("odds").value,
  };

  try {
    const res = await fetch(`${API_BASE}/predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrediction),
    });

    if (!res.ok) throw new Error("Failed to add prediction");

    // Clear form
    predictionForm.reset();

    // Refresh table
    loadPredictions();
  } catch (err) {
    console.error("❌ Error adding prediction:", err);
  }
});

// ===== Delete Prediction =====
async function deletePrediction(id) {
  try {
    const res = await fetch(`${API_BASE}/predictions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete prediction");

    // Refresh table
    loadPredictions();
  } catch (err) {
    console.error("❌ Error deleting prediction:", err);
  }
}

// Load predictions on page load
loadPredictions();
