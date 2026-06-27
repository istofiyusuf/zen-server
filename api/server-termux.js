// Zen Server API - Termux Edition
// Backend mandiri tanpa Prisma, menggunakan SQLite langsung

console.log("Starting Zen Server API (Termux Edition)...");

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
let bcrypt;
try {
  bcrypt = require("bcryptjs");
  console.log("Using bcryptjs");
} catch (e) {
  try {
    bcrypt = require("bcrypt");
    console.log("Using bcrypt");
  } catch (e2) {
    console.log("No bcrypt available, using simple hash");
    // Fallback simple hash
    bcrypt = {
      hash: async (pass, salt) => {
        const crypto = require("crypto");
        return crypto.createHash("sha256").update(pass).digest("hex");
      },
      compare: async (pass, hash) => {
        const crypto = require("crypto");
        return crypto.createHash("sha256").update(pass).digest("hex") === hash;
      },
    };
  }
} // Gunakan bcryptjs bukan bcrypt
const jwt = require("jsonwebtoken");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

// Gunakan better-sqlite3 yang lebih ringan
let Database;
try {
  Database = require("better-sqlite3");
  console.log("better-sqlite3 loaded");
} catch (e) {
  console.log("better-sqlite3 not available, using file-based storage");
}

const app = express();
const server = http.createServer(app);
const PORT = process.env.API_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "zen-server-termux-secret-2026";

// Database sederhana (file JSON)
const DB_PATH = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DB_PATH, "users.json");
const WEBSITES_FILE = path.join(DB_PATH, "websites.json");
const SETTINGS_FILE = path.join(DB_PATH, "settings.json");

// Buat folder data
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Helper: Baca/Tulis database JSON
function readDB(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {}
  return [];
}

function writeDB(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Middleware
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// ==========================================
// HEALTH CHECK
// ==========================================
app.get("/api/health", function (req, res) {
  res.json({
    success: true,
    message: "Zen Server API (Termux Edition)",
    version: "1.0.0",
    platform: os.platform(),
    arch: os.arch(),
    termux: true,
  });
});

// ==========================================
// AUTH - REGISTER
// ==========================================
app.post("/api/v1/auth/register", async function (req, res) {
  try {
    var { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password minimum 6 characters" });
    }

    var users = readDB(USERS_FILE);

    // Check existing
    var exists = users.find(function (u) {
      return u.username === username || u.email === email;
    });

    if (exists) {
      return res.status(409).json({ success: false, message: "Username or email already exists" });
    }

    // Hash password
    var hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    var newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      username: username,
      email: email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeDB(USERS_FILE, users);

    // Generate token
    var token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("User registered:", username);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        token: token,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// AUTH - LOGIN
// ==========================================
app.post("/api/v1/auth/login", async function (req, res) {
  try {
    var { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }

    var users = readDB(USERS_FILE);
    var user = users.find(function (u) {
      return u.username === username || u.email === username;
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    var validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    var token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("User logged in:", user.username);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// AUTH - ME
// ==========================================
app.get("/api/v1/auth/me", function (req, res) {
  try {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    var token = authHeader.split(" ")[1];
    var decoded = jwt.verify(token, JWT_SECRET);

    var users = readDB(USERS_FILE);
    var user = users.find(function (u) {
      return u.id === decoded.userId;
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ==========================================
// SYSTEM STATS
// ==========================================
app.get("/api/v1/system/stats", function (req, res) {
  var cpus = os.cpus();
  var totalMem = os.totalmem();
  var freeMem = os.freemem();

  var totalIdle = 0;
  var totalTick = 0;

  cpus.forEach(function (cpu) {
    for (var type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  var cpuUsage = Math.round((1 - totalIdle / totalTick) * 100);

  // Get real storage on Termux
  var storageInfo = { size: "32 GB", used: "16 GB", available: "16 GB", percent: 50 };
  try {
    var stdout = execSync("df -h /data/data/com.termux/files/home", {
      timeout: 2000,
      encoding: "utf8",
    });
    var lines = stdout.trim().split("\n");
    if (lines.length > 1) {
      var parts = lines[1].split(/\s+/);
      storageInfo = {
        size: parts[1] || "32 GB",
        used: parts[2] || "16 GB",
        available: parts[3] || "16 GB",
        percent: parseInt(parts[4]) || 50,
      };
    }
  } catch (e) {}

  // Get battery info (Termux)
  var batteryInfo = { percentage: 100, status: "UNKNOWN", temperature: 30 };
  try {
    var battData = execSync("termux-battery-status", { timeout: 2000, encoding: "utf8" });
    var battJson = JSON.parse(battData);
    batteryInfo = {
      percentage: battJson.percentage || 100,
      status: battJson.status || "UNKNOWN",
      temperature: battJson.temperature || 30,
    };
  } catch (e) {}

  var uptime = os.uptime();

  res.json({
    success: true,
    data: {
      timestamp: Date.now(),
      cpu: { usage: cpuUsage, cores: cpus.length, model: cpus[0] ? cpus[0].model : "ARM" },
      ram: {
        total: (totalMem / 1024 / 1024 / 1024).toFixed(1) + " GB",
        used: ((totalMem - freeMem) / 1024 / 1024 / 1024).toFixed(1) + " GB",
        free: (freeMem / 1024 / 1024 / 1024).toFixed(1) + " GB",
        percent: Math.round(((totalMem - freeMem) / totalMem) * 100),
      },
      storage: storageInfo,
      battery: batteryInfo,
      network: { ip: getLocalIP(), active: "wlan0" },
      temperature: batteryInfo.temperature,
      system: {
        hostname: os.hostname(),
        platform: "android",
        arch: os.arch(),
        cpus: cpus.length,
        uptime: {
          formatted: Math.floor(uptime / 3600) + "h " + Math.floor((uptime % 3600) / 60) + "m",
        },
        nodeVersion: process.version,
        termux: true,
      },
    },
  });
});

// Helper: Get local IP
function getLocalIP() {
  var interfaces = os.networkInterfaces();
  for (var name in interfaces) {
    for (var i = 0; i < interfaces[name].length; i++) {
      var iface = interfaces[name][i];
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

// ==========================================
// FILE MANAGER
// ==========================================
app.get("/api/v1/files/list", function (req, res) {
  try {
    var basePath = req.query.path || "./";
    var fullPath = path.resolve(basePath);

    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, message: "Directory not found" });
    }

    var stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      return res.status(400).json({ success: false, message: "Not a directory" });
    }

    var items = fs.readdirSync(fullPath).map(function (name) {
      var itemPath = path.join(fullPath, name);
      var itemStat = fs.statSync(itemPath);

      return {
        name: name,
        path: itemPath.replace(process.cwd(), ""),
        type: itemStat.isDirectory() ? "directory" : "file",
        size: itemStat.size,
        sizeFormatted: formatFileSize(itemStat.size),
        modified: itemStat.mtime.toISOString(),
        isDirectory: itemStat.isDirectory(),
        extension: path.extname(name).toLowerCase(),
      };
    });

    items.sort(function (a, b) {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return res.json({
      success: true,
      data: {
        currentPath: fullPath.replace(process.cwd(), ""),
        items: items,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/v1/files/read", function (req, res) {
  try {
    var filePath = path.resolve(req.query.file || "");

    if (!filePath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    var stat = fs.statSync(filePath);
    if (stat.size > 1048576) {
      return res.json({ success: true, data: { content: "File too large to preview" } });
    }

    var content = fs.readFileSync(filePath, "utf8");
    return res.json({ success: true, data: { name: path.basename(filePath), content: content } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/v1/files/mkdir", function (req, res) {
  try {
    var folderPath = path.resolve(req.body.basePath || "./", req.body.folderName);
    if (!folderPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    fs.mkdirSync(folderPath, { recursive: true });
    return res.json({ success: true, message: "Folder created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/v1/files/delete", function (req, res) {
  try {
    var targetPath = path.resolve(req.body.path || "");
    if (!targetPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (fs.statSync(targetPath).isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// TERMINAL
// ==========================================
app.post("/api/v1/terminal/exec", function (req, res) {
  try {
    var command = req.body.command;
    if (!command) {
      return res.status(400).json({ success: false, message: "Command required" });
    }

    var output = "";
    try {
      output = execSync(command, { timeout: 10000, encoding: "utf8", cwd: process.cwd() });
    } catch (e) {
      output = e.stdout || "" + (e.stderr || "") + e.message;
    }

    return res.json({
      success: true,
      data: { command: command, output: output, cwd: process.cwd() },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// PACKAGES (Real Termux)
// ==========================================
app.get("/api/v1/packages/installed", function (req, res) {
  try {
    var output = execSync("pkg list-installed 2>/dev/null || apt list --installed 2>/dev/null", {
      timeout: 5000,
      encoding: "utf8",
    });
    var lines = output.trim().split("\n");
    var packages = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.startsWith("Listing")) continue;
      var parts = line.split("/");
      if (parts.length >= 2) {
        packages.push({
          name: parts[0].trim(),
          version: parts[1].split(" ")[0].trim(),
          status: "installed",
        });
      }
    }

    return res.json({
      success: true,
      data: { packages: packages, total: packages.length, real: true },
    });
  } catch (e) {
    return res.json({ success: true, data: { packages: [], total: 0, real: false } });
  }
});

app.get("/api/v1/packages/search", function (req, res) {
  try {
    var query = req.query.q || "";
    var output = execSync("apt-cache search " + query + " 2>/dev/null | head -20", {
      timeout: 5000,
      encoding: "utf8",
    });
    var lines = output.trim().split("\n");
    var packages = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var dashIndex = line.indexOf(" - ");
      if (dashIndex > 0) {
        packages.push({
          name: line.substring(0, dashIndex).trim(),
          description: line.substring(dashIndex + 3).trim(),
          version: "latest",
          status: "available",
        });
      }
    }

    return res.json({ success: true, data: { packages: packages, total: packages.length } });
  } catch (e) {
    return res.json({ success: true, data: { packages: [], total: 0 } });
  }
});

// ==========================================
// WEBSITE MANAGER (Simple)
// ==========================================
app.get("/api/v1/websites", function (req, res) {
  var websites = readDB(WEBSITES_FILE);
  return res.json({ success: true, data: { websites: websites } });
});

app.post("/api/v1/websites", function (req, res) {
  var { name, domain, port, type } = req.body;
  if (!name || !port || !type) {
    return res.status(400).json({ success: false, message: "Name, port, and type required" });
  }

  var websites = readDB(WEBSITES_FILE);
  var website = {
    id: Date.now().toString(36),
    name: name,
    domain: domain || name + ".local",
    port: parseInt(port),
    type: type,
    status: "stopped",
    path: "./websites/" + name,
    createdAt: new Date().toISOString(),
  };

  websites.push(website);
  writeDB(WEBSITES_FILE, websites);

  // Buat folder
  var sitePath = path.join(process.cwd(), "websites", name);
  if (!fs.existsSync(sitePath)) {
    fs.mkdirSync(sitePath, { recursive: true });
    fs.writeFileSync(path.join(sitePath, "index.html"), "<h1>" + name + " is running!</h1>");
  }

  return res.status(201).json({ success: true, data: { website: website } });
});

app.delete("/api/v1/websites/:id", function (req, res) {
  var websites = readDB(WEBSITES_FILE);
  var filtered = websites.filter(function (w) {
    return w.id !== req.params.id;
  });
  writeDB(WEBSITES_FILE, filtered);
  return res.json({ success: true, message: "Website deleted" });
});

app.post("/api/v1/websites/:id/start", function (req, res) {
  var websites = readDB(WEBSITES_FILE);
  var website = websites.find(function (w) {
    return w.id === req.params.id;
  });
  if (website) {
    website.status = "running";
    writeDB(WEBSITES_FILE, websites);
  }
  return res.json({ success: true, message: "Website started" });
});

app.post("/api/v1/websites/:id/stop", function (req, res) {
  var websites = readDB(WEBSITES_FILE);
  var website = websites.find(function (w) {
    return w.id === req.params.id;
  });
  if (website) {
    website.status = "stopped";
    writeDB(WEBSITES_FILE, websites);
  }
  return res.json({ success: true, message: "Website stopped" });
});

// Helper
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// 404 Handler
app.use(function (req, res) {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start Server
server.listen(PORT, "0.0.0.0", function () {
  console.log("================================================");
  console.log("  Zen Server API (Termux Edition)");
  console.log("  URL:  http://localhost:" + PORT);
  console.log("  Health: http://localhost:" + PORT + "/api/health");
  console.log("================================================");
});
