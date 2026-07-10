/*
FieldGrid Dashboard Logic

Handles real-time Socket.IO updates, dashboard interactions,
and client-side node management.
*/
const socket = io();

const connectionStatus = document.getElementById("connectionStatus");

const node01NameDisplay = document.getElementById("node01NameDisplay");
const node02NameDisplay = document.getElementById("node02NameDisplay");

const node01NameInput = document.getElementById("node01NameInput");
const node02NameInput = document.getElementById("node02NameInput");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const uptime = document.getElementById("uptime");

const flameAnalog = document.getElementById("flameAnalog");
const flameStatus = document.getElementById("flameStatus");
const flameBubble = document.getElementById("flameBubble");

const vibrationState = document.getElementById("vibrationState");
const vibrationStatus = document.getElementById("vibrationStatus");
const vibrationBubble = document.getElementById("vibrationBubble");

const rawJson = document.getElementById("rawJson");

function loadNodeNames() {
  const savedNode01 = localStorage.getItem("fieldgrid_node01_name");
  const savedNode02 = localStorage.getItem("fieldgrid_node02_name");

  if (savedNode01) {
    node01NameDisplay.textContent = savedNode01;
    node01NameInput.value = savedNode01;
  }

  if (savedNode02) {
    node02NameDisplay.textContent = savedNode02;
    node02NameInput.value = savedNode02;
  }
}

function saveNodeName(node) {
  if (node === "node01") {
    const name = node01NameInput.value.trim();

    if (name !== "") {
      localStorage.setItem("fieldgrid_node01_name", name);
      node01NameDisplay.textContent = name;
    }
  }

  if (node === "node02") {
    const name = node02NameInput.value.trim();

    if (name !== "") {
      localStorage.setItem("fieldgrid_node02_name", name);
      node02NameDisplay.textContent = name;
    }
  }
}

function formatUptime(ms) {
  if (!ms) return "--";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${seconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

function setBubbleState(element, isAlert) {
  if (isAlert) {
    element.classList.add("alert");
    element.classList.remove("safe");
  } else {
    element.classList.add("safe");
    element.classList.remove("alert");
  }
}

socket.on("connect", () => {
  connectionStatus.textContent = "🟢 Dashboard connected";
});

socket.on("sensor_update", (data) => {
  connectionStatus.textContent = "🟢 Node 01 receiving live data";

  temperature.textContent = data.temperature_c ?? "--";
  humidity.textContent = data.humidity_percent ?? "--";
  uptime.textContent = formatUptime(data.uptime_ms);

  flameAnalog.textContent = data.flame_analog ?? "--";

  if (data.flame_detected === true) {
    flameStatus.textContent = "Flame detected";
    setBubbleState(flameBubble, true);
  } else {
    flameStatus.textContent = "No flame detected";
    setBubbleState(flameBubble, false);
  }

  vibrationState.textContent = data.vibration_state ?? "--";

  if (data.vibration_detected === true) {
    vibrationStatus.textContent = "Vibration detected";
    setBubbleState(vibrationBubble, true);
  } else {
    vibrationStatus.textContent = "No vibration detected";
    setBubbleState(vibrationBubble, false);
  }

  rawJson.textContent = JSON.stringify(data, null, 2);
});

socket.on("disconnect", () => {
  connectionStatus.textContent = "🔴 Dashboard disconnected";
});

loadNodeNames();

