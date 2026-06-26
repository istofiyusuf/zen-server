const systemMonitor = require("../services/system-monitor");

function setupSocket(io) {
  let statsInterval = null;
  let connectedClients = 0;

  io.on("connection", (socket) => {
    connectedClients++;
    console.log(`Client connected. Total clients: ${connectedClients}`);

    // Start sending stats if first client
    if (connectedClients === 1) {
      startStatsInterval(io);
    }

    // Handle client requesting stats
    socket.on("system:request-stats", () => {
      const stats = systemMonitor.getAllStats();
      socket.emit("system:stats", stats);
    });

    // Handle terminal input
    socket.on("terminal:input", (data) => {
      console.log("Terminal input:", data);
      // Will be implemented later
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      connectedClients--;
      console.log(`Client disconnected. Total clients: ${connectedClients}`);

      // Stop interval if no clients
      if (connectedClients <= 0) {
        stopStatsInterval();
      }
    });
  });
}

function startStatsInterval(io) {
  if (statsInterval) return;

  console.log("Starting system stats interval");
  statsInterval = setInterval(() => {
    try {
      const stats = systemMonitor.getAllStats();
      io.emit("system:stats", stats);
    } catch (error) {
      console.error("Error sending stats:", error);
    }
  }, 2000); // Send every 2 seconds
}

function stopStatsInterval() {
  if (statsInterval) {
    console.log("Stopping system stats interval");
    clearInterval(statsInterval);
    statsInterval = null;
  }
}

module.exports = { setupSocket };
