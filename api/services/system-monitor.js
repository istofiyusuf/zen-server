const os = require("os");

class SystemMonitor {
  getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idlePercent = (totalIdle / totalTick) * 100;
    const usagePercent = 100 - idlePercent;

    return Math.round(usagePercent);
  }

  getRamUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      total: this.formatBytes(totalMem),
      used: this.formatBytes(usedMem),
      free: this.formatBytes(freeMem),
      percent: Math.round((usedMem / totalMem) * 100),
      totalRaw: totalMem,
      usedRaw: usedMem,
      freeRaw: freeMem,
    };
  }

  getStorageUsage() {
    return {
      filesystem: "/dev/sda1",
      size: "256 GB",
      used: "128 GB",
      available: "128 GB",
      percent: 50,
      mount: "/",
    };
  }

  getBatteryStatus() {
    return {
      percentage: 85,
      status: "DISCHARGING",
      temperature: 35,
      plugged: "UNPLUGGED",
    };
  }

  getNetworkInfo() {
    const interfaces = os.networkInterfaces();
    let ip = "127.0.0.1";
    let active = "Unknown";

    for (const name in interfaces) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          ip = iface.address;
          active = name;
        }
      }
    }

    return { ip, active };
  }

  getUptime() {
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return {
      raw: uptime,
      formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  getSystemInfo() {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      uptime: this.getUptime(),
      nodeVersion: process.version,
      termux: false,
    };
  }

  getTemperature() {
    return 38;
  }

  getAllStats() {
    return {
      timestamp: Date.now(),
      cpu: {
        usage: this.getCpuUsage(),
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || "Unknown",
      },
      ram: this.getRamUsage(),
      storage: this.getStorageUsage(),
      battery: this.getBatteryStatus(),
      network: this.getNetworkInfo(),
      temperature: this.getTemperature(),
      system: this.getSystemInfo(),
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
}

module.exports = new SystemMonitor();
