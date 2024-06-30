const os = require("os");
const { exec } = require("child_process");

let prevCPUInfo = os.cpus();

// Function to get CPU usage
function getCPUUsage() {
  const currentCPUInfo = os.cpus();
  let totalUsage = 0;

  for (let i = 0; i < currentCPUInfo.length; i++) {
    const prevCPU = prevCPUInfo[i];
    const currentCPU = currentCPUInfo[i];

    const prevTotal = Object.values(prevCPU.times).reduce((a, b) => a + b);
    const currentTotal = Object.values(currentCPU.times).reduce(
      (a, b) => a + b,
    );

    const totalDiff = currentTotal - prevTotal;
    const idleDiff = currentCPU.times.idle - prevCPU.times.idle;

    const usage = (1 - idleDiff / totalDiff) * 100;
    totalUsage += usage;
  }

  prevCPUInfo = currentCPUInfo;
  return totalUsage / currentCPUInfo.length;
}

// Function to restart the server
function restartServer() {
  console.log("CPU usage exceeded 70%. Restarting server...");
  exec("pm2 restart insuranceApi", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting server: ${error}`);
      return;
    }
    console.log(`Server restarted: ${stdout}`);
  });
}

// Monitor CPU usage
function monitorCPU() {
  setInterval(() => {
    const cpuUsage = getCPUUsage();
    console.log(`Current CPU Usage: ${cpuUsage.toFixed(2)}%`);

    if (cpuUsage > 70) {
      restartServer();
    }
  }, 1000); // Check every second
}

module.exports = { restartServerIfNeeded: monitorCPU };
