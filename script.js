const doctorsData = {
  Fever: [
    { name: "Dr. Ramesh", specialization: "General Physician", fees: 400 },
    { name: "Dr. Anita", specialization: "Pediatrician", fees: 500 }
  ],
  Cough: [
    { name: "Dr. Kavitha", specialization: "ENT Specialist", fees: 450 },
    { name: "Dr. Arun", specialization: "Pulmonologist", fees: 600 }
  ],
  Headache: [
    { name: "Dr. Raj", specialization: "Neurologist", fees: 800 }
  ],
  "Skin Rash": [
    { name: "Dr. Sneha", specialization: "Dermatologist", fees: 700 }
  ]
};

const reasonSelect = document.getElementById("reason");
if (reasonSelect) {
  reasonSelect.addEventListener("change", function () {
    const container = document.getElementById("doctorsContainer");
    const selected = reasonSelect.value;
    container.innerHTML = "";
    if (!selected) return;
    const doctors = doctorsData[selected];
    if (!doctors) {
      container.innerHTML = `<p>No doctors available for ${selected}</p>`;
      return;
    }
    doctors.forEach(doc => {
      const card = document.createElement("div");
      card.classList.add("doctor-card");
      card.innerHTML = `
        <h3>${doc.name}</h3>
        <p>${doc.specialization}</p>
        <p>Fees: ₹${doc.fees}</p>
        <button class="btn" onclick="selectDoctor('${doc.name}','${doc.specialization}',${doc.fees})">Select</button>
      `;
      container.appendChild(card);
    });
  });
}

function selectDoctor(name, specialization, fees) {
  document.getElementById("patientForm").style.display = "block";
  localStorage.setItem("selectedDoctor", JSON.stringify({ name, specialization, fees }));
}

const patientForm = document.getElementById("patientForm");
if (patientForm) {
  patientForm.addEventListener("submit", e => {
    e.preventDefault();
    const doc = JSON.parse(localStorage.getItem("selectedDoctor"));
    const data = {
      name: document.getElementById("pname").value,
      phone: document.getElementById("pphone").value,
      age: document.getElementById("page").value,
      dob: document.getElementById("pdob").value,
      gender: document.getElementById("pgender").value,
      date: document.getElementById("pdate").value,
      time: document.getElementById("ptime").value,
      doctor: doc.name,
      specialization: doc.specialization,
      fees: doc.fees
    };
    let appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    appointments.push(data);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    window.location.href = "payment.html";
  });
}

const appointmentsList = document.getElementById("appointmentsList");
if (appointmentsList) {
  const data = JSON.parse(localStorage.getItem("appointments") || "[]");
  if (data.length === 0) {
    appointmentsList.innerHTML = "<p>No appointments found.</p>";
  } else {
    data.forEach((app, index) => {
      const card = document.createElement("div");
      card.classList.add("appointment-card");
      card.innerHTML = `
        <h3>${app.doctor} (${app.specialization})</h3>
        <p><strong>Patient:</strong> ${app.name}</p>
        <p><strong>Phone:</strong> ${app.phone}</p>
        <p><strong>Date:</strong> ${app.date}</p>
        <p><strong>Time:</strong> ${app.time}</p>
        <button class="btn-outline" onclick="deleteAppointment(${index})">Delete</button>
      `;
      appointmentsList.appendChild(card);
    });
  }
}

function deleteAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  appointments.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  location.reload();
}



if (window.location.pathname.includes("confirmation.html")) {
  const { jsPDF } = window.jspdf;
  const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
  const latest = appointments[appointments.length - 1];

  if (latest) {
    document.getElementById("cDoctor").textContent = latest.doctor;
    document.getElementById("cSpec").textContent = latest.specialization;
    document.getElementById("cName").textContent = latest.name;
    document.getElementById("cPhone").textContent = latest.phone;
    document.getElementById("cDate").textContent = latest.date;
    document.getElementById("cTime").textContent = latest.time;
    document.getElementById("cFees").textContent = latest.fees;
  }

  document.getElementById("downloadPDF").addEventListener("click", () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Appointment Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Doctor: ${latest.doctor}`, 20, 40);
    doc.text(`Specialization: ${latest.specialization}`, 20, 50);
    doc.text(`Patient Name: ${latest.name}`, 20, 60);
    doc.text(`Phone: ${latest.phone}`, 20, 70);
    doc.text(`Date: ${latest.date}`, 20, 80);
    doc.text(`Time: ${latest.time}`, 20, 90);
    doc.text(`Fees: ₹${latest.fees}`, 20, 100);
    doc.text("Thank you for choosing MediCare+", 20, 120);
    doc.save("Appointment_Confirmation.pdf");
  });
}

