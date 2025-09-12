import API_BASE_URL from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const predictionForm = document.getElementById("predictionForm");
  const predictionTableBody = document.getElementById("predictionTableBody");

  // ===== Fetch and display all predictions =====
  async function loadPredictions() {
    try {
      const res = await fetch(`${API_BASE_URL}/predictions`);
      const data = await res.json();

      predictionTableBody.innerHTML = "";

      data.forEach((bet) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td class="border p-2">${bet.date}</td>
          <td class="border p-2">${bet.time}</td>
          <td class="border p-2">${bet.match}</td>
          <td class="border p-2">${bet.prediction}</td>
          <td class="border p-2">${bet.odds}</td>
          <td class="border p-2 text-center">
            <button 
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              data-id="${bet._id}">
              Delete
            </button>
          </td>
        `;

        predictionTableBody.appendChild(row);
      });
    } catch (err) {
      console.error("❌ Error loading predictions:", err);
    }
  }

  // ===== Handle form submit =====
  predictionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(predictionForm);
    const newPrediction = {
      date: formData.get("date"),
      time: formData.get("time"),
      match: formData.get("match"),
      prediction: formData.get("prediction"),
      odds: formData.get("odds"),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/predictions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrediction),
      });

      const data = await res.json();
      console.log("✅ Added:", data);

      predictionForm.reset();
      loadPredictions();
    } catch (err) {
      console.error("❌ Error adding prediction:", err);
    }
  });

  // ===== Handle delete =====
  predictionTableBody.addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
      const id = e.target.getAttribute("data-id");

      try {
        await fetch(`${API_BASE_URL}/predictions/${id}`, {
          method: "DELETE",
        });

        console.log("🗑️ Deleted:", id);
        loadPredictions();
      } catch (err) {
        console.error("❌ Error deleting prediction:", err);
      }
    }
  });

  // Initial load
  loadPredictions();
});
