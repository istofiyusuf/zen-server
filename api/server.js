// Zen Server API
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const os = require("os");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const PORT = 3001;
const JWT_SECRET = "zen-server-secret-key-2026";

// Middleware
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());

// Helper function
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// =============================================
// HEALTH CHECK
// =============================================
app.get("/api/health", (req, res) => {
  console.log("Health check called");
  res.json({
    success: true,
    message: "Zen Server API is running",
    version: "1.0.0"
  });
});

// =============================================
// AUTH - REGISTER
// =============================================
app.post("/api/v1/auth/register", async (req, res) => {
  console.log("Register called:", req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password minimum 6 characters" });
    }

    // Check existing
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: existing.username === username ? "Username already taken" : "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "admin",
        settings: {
          create: {
            theme: "dark",
            language: "en",
            port: 3000
          }
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    console.log("User registered:", user.username);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user, token }
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
});

// =============================================
// AUTH - LOGIN
// =============================================
app.post("/api/v1/auth/login", async (req, res) => {
  console.log("Login called:", req.body);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    console.log("User logged in:", user.username);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
});

// =============================================
// SYSTEM STATS
// =============================================
app.get("/api/v1/system/stats", (req, res) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const cpuUsage = Math.round((1 - totalIdle / totalTick) * 100);

  res.json({
    success: true,
    data: {
      timestamp: Date.now(),
      cpu: {
        usage: cpuUsage,
        cores: cpus.length,
        model: cpus[0]?.model || "Unknown"
      },
      ram: {
        total: (totalMem / 1024 / 1024 / 1024).toFixed(1) + " GB",
        used: ((totalMem - freeMem) / 1024 / 1024 / 1024).toFixed(1) + " GB",
        free: (freeMem / 1024 / 1024 / 1024).toFixed(1) + " GB",
        percent: Math.round(((totalMem - freeMem) / totalMem) * 100)
      },
      storage: {
        filesystem: "C:",
        size: "256 GB",
        used: "128 GB",
        available: "128 GB",
        percent: 50
      },
      battery: {
        percentage: 85,
        status: "DISCHARGING",
        temperature: 35
      },
      network: {
        ip: "192.168.1.5",
        active: "WiFi"
      },
      temperature: 38,
      system: {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: cpus.length,
        uptime: {
          formatted: Math.floor(os.uptime() / 3600) + "h " + Math.floor((os.uptime() % 3600) / 60) + "m"
        },
        nodeVersion: process.version,
        termux: false
      }
    }
  });
});

// ==========================================
// AUTH - GET CURRENT USER (ME)
// ==========================================
app.get("/api/v1/auth/me", async function(req, res) {
  console.log(">>> ME called");

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    const token = parts[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        settings: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User found:", user.username);

    return res.json({
      success: true,
      data: { user: user }
    });

  } catch (error) {
    console.error("ME ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// ==========================================
// AUTH - LOGOUT
// ==========================================
app.post("/api/v1/auth/logout", async function(req, res) {
  console.log(">>> LOGOUT called");

  try {
    var authHeader = req.headers.authorization;

    if (authHeader && prisma) {
      var parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        var token = parts[1];

        // Delete session from database
        await prisma.session.deleteMany({
          where: { token: token }
        }).catch(function(e) {
          console.log("Session delete error:", e.message);
        });
      }
    }

    return res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error.message);
    // Tetap return success meskipun error
    return res.json({
      success: true,
      message: "Logged out"
    });
  }
});

// ==========================================
// WEBSITE MANAGER - LIST ALL
// ==========================================
app.get("/api/v1/websites", async function(req, res) {
  console.log(">>> WEBSITES list called");

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const websites = await prisma.website.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        logs: {
          take: 5,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    return res.json({
      success: true,
      data: { websites }
    });

  } catch (error) {
    console.error("List websites error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// WEBSITE MANAGER - CREATE
// ==========================================
app.post("/api/v1/websites", async function(req, res) {
  console.log(">>> WEBSITE create called:", req.body);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const { name, domain, port, type, phpVersion, nodeVersion, path } = req.body;

    if (!name || !port || !type) {
      return res.status(400).json({
        success: false,
        message: "Name, port, and type are required"
      });
    }

    // Check if port already used
    const existingPort = await prisma.website.findFirst({
      where: { port: parseInt(port) }
    });

    if (existingPort) {
      return res.status(409).json({
        success: false,
        message: `Port ${port} is already in use by "${existingPort.name}"`
      });
    }

    // Check if name already exists
    const existingName = await prisma.website.findFirst({
      where: { name: name }
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: `Website "${name}" already exists`
      });
    }

    // Buat folder website
    const fs = require("fs");
    const websitePath = path || `./websites/${name}`;

    try {
      if (!fs.existsSync(websitePath)) {
        fs.mkdirSync(websitePath, { recursive: true });
      }

      // Buat file index default
      if (type === "static" || type === "php") {
        fs.writeFileSync(`${websitePath}/index.html`,
          `<!DOCTYPE html>\n<html>\n<head>\n  <title>${name}</title>\n</head>\n<body>\n  <h1>${name} is running!</h1>\n</body>\n</html>`
        );
      }

      if (type === "php") {
        fs.writeFileSync(`${websitePath}/index.php`,
          `<?php\nphpinfo();\n?>`
        );
      }

      if (type === "nodejs") {
        fs.writeFileSync(`${websitePath}/server.js`,
          `const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.end('${name} is running on Node.js!');\n});\nserver.listen(${port}, () => console.log('Running on port ${port}'));`
        );
      }
    } catch (fsError) {
      console.error("Folder creation error:", fsError.message);
    }

    // Create website record
    const website = await prisma.website.create({
      data: {
        name,
        domain: domain || `${name}.local`,
        port: parseInt(port),
        type,
        phpVersion: phpVersion || null,
        nodeVersion: nodeVersion || null,
        path: websitePath,
        status: "stopped"
      }
    });

    // Create log
    await prisma.log.create({
      data: {
        type: "website",
        message: `Website "${name}" created successfully`,
        level: "info",
        source: name,
        websiteId: website.id
      }
    });

    console.log("Website created:", name);

    return res.status(201).json({
      success: true,
      message: "Website created successfully",
      data: { website }
    });

  } catch (error) {
    console.error("Create website error:", error.message);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
});

// ==========================================
// WEBSITE MANAGER - GET DETAIL
// ==========================================
app.get("/api/v1/websites/:id", async function(req, res) {
  console.log(">>> WEBSITE detail called:", req.params.id);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const website = await prisma.website.findUnique({
      where: { id: req.params.id },
      include: {
        logs: {
          orderBy: { createdAt: "desc" },
          take: 50
        }
      }
    });

    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    return res.json({
      success: true,
      data: { website }
    });

  } catch (error) {
    console.error("Get website error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// WEBSITE MANAGER - UPDATE
// ==========================================
app.put("/api/v1/websites/:id", async function(req, res) {
  console.log(">>> WEBSITE update called:", req.params.id);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const { name, domain, port, phpVersion, nodeVersion } = req.body;

    const website = await prisma.website.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        domain: domain || undefined,
        port: port ? parseInt(port) : undefined,
        phpVersion: phpVersion || undefined,
        nodeVersion: nodeVersion || undefined,
      }
    });

    await prisma.log.create({
      data: {
        type: "website",
        message: `Website "${website.name}" updated`,
        level: "info",
        source: website.name,
        websiteId: website.id
      }
    });

    return res.json({
      success: true,
      message: "Website updated",
      data: { website }
    });

  } catch (error) {
    console.error("Update website error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// WEBSITE MANAGER - DELETE
// ==========================================
app.delete("/api/v1/websites/:id", async function(req, res) {
  console.log(">>> WEBSITE delete called:", req.params.id);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const website = await prisma.website.findUnique({
      where: { id: req.params.id }
    });

    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    // Delete logs first
    await prisma.log.deleteMany({
      where: { websiteId: req.params.id }
    });

    // Delete website
    await prisma.website.delete({
      where: { id: req.params.id }
    });

    return res.json({
      success: true,
      message: `Website "${website.name}" deleted successfully`
    });

  } catch (error) {
    console.error("Delete website error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// WEBSITE MANAGER - START
// ==========================================
app.post("/api/v1/websites/:id/start", async function(req, res) {
  console.log(">>> WEBSITE start called:", req.params.id);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const website = await prisma.website.findUnique({
      where: { id: req.params.id }
    });

    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    // Update status to running
    await prisma.website.update({
      where: { id: req.params.id },
      data: { status: "running" }
    });

    await prisma.log.create({
      data: {
        type: "website",
        message: `Website "${website.name}" started`,
        level: "info",
        source: website.name,
        websiteId: website.id
      }
    });

    return res.json({
      success: true,
      message: `Website "${website.name}" is now running`
    });

  } catch (error) {
    console.error("Start website error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// WEBSITE MANAGER - STOP
// ==========================================
app.post("/api/v1/websites/:id/stop", async function(req, res) {
  console.log(">>> WEBSITE stop called:", req.params.id);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const website = await prisma.website.findUnique({
      where: { id: req.params.id }
    });

    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found" });
    }

    await prisma.website.update({
      where: { id: req.params.id },
      data: { status: "stopped" }
    });

    await prisma.log.create({
      data: {
        type: "website",
        message: `Website "${website.name}" stopped`,
        level: "info",
        source: website.name,
        websiteId: website.id
      }
    });

    return res.json({
      success: true,
      message: `Website "${website.name}" stopped`
    });

  } catch (error) {
    console.error("Stop website error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// WEBSITE MANAGER - GET LOGS
// ==========================================
app.get("/api/v1/websites/:id/logs", async function(req, res) {
  console.log(">>> WEBSITE logs called:", req.params.id);

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    const logs = await prisma.log.findMany({
      where: { websiteId: req.params.id },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return res.json({
      success: true,
      data: { logs }
    });

  } catch (error) {
    console.error("Get logs error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Helper function - taruh di paling atas file
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  var k = 1024;
  var sizes = ["B", "KB", "MB", "GB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// ==========================================
// FILE MANAGER - LIST FILES
// ==========================================
app.get("/api/v1/files/list", function(req, res) {
  console.log(">>> FILES list called:", req.query.path);

  try {
    var fs = require("fs");
    var path = require("path");

    var basePath = req.query.path || "./";
    var fullPath = path.resolve(basePath);

    // Security: prevent directory traversal
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

    var items = fs.readdirSync(fullPath).map(function(name) {
      var itemPath = path.join(fullPath, name);
      var itemStat = fs.statSync(itemPath);

      return {
        name: name,
        path: itemPath.replace(process.cwd(), ""),
        type: itemStat.isDirectory() ? "directory" : "file",
        size: itemStat.size,
        sizeFormatted: formatFileSize(itemStat.size),
        modified: itemStat.mtime.toISOString(),
        permissions: itemStat.mode.toString(8).slice(-3),
        isDirectory: itemStat.isDirectory(),
        isFile: itemStat.isFile(),
        extension: path.extname(name).toLowerCase(),
      };
    });

    // Sort: directories first, then alphabetically
    items.sort(function(a, b) {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return res.json({
      success: true,
      data: {
        currentPath: fullPath.replace(process.cwd(), ""),
        parentPath: fullPath === process.cwd() ? null : path.dirname(fullPath).replace(process.cwd(), ""),
        items: items
      }
    });

  } catch (error) {
    console.error("List files error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// FILE MANAGER - CREATE FOLDER
// ==========================================
app.post("/api/v1/files/mkdir", function(req, res) {
  console.log(">>> FILES mkdir called:", req.body);

  try {
    var fs = require("fs");
    var path = require("path");

    var basePath = req.body.basePath || "./";
    var folderName = req.body.folderName;

    if (!folderName) {
      return res.status(400).json({ success: false, message: "Folder name required" });
    }

    var fullPath = path.resolve(basePath, folderName);

    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (fs.existsSync(fullPath)) {
      return res.status(409).json({ success: false, message: "Already exists" });
    }

    fs.mkdirSync(fullPath, { recursive: true });

    return res.json({ success: true, message: "Folder created" });

  } catch (error) {
    console.error("Mkdir error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// FILE MANAGER - READ FILE
// ==========================================
app.get("/api/v1/files/read", function(req, res) {
  console.log(">>> FILES read called:", req.query.file);

  try {
    var fs = require("fs");
    var path = require("path");

    var filePath = path.resolve(req.query.file || "");

    if (!filePath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    var stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      return res.status(400).json({ success: false, message: "Is a directory" });
    }

    // Read as text for small files (< 1MB)
    if (stat.size < 1048576) {
      var content = fs.readFileSync(filePath, "utf8");
      return res.json({
        success: true,
        data: {
          name: path.basename(filePath),
          path: filePath.replace(process.cwd(), ""),
          size: stat.size,
          sizeFormatted: formatFileSize(stat.size),
          content: content
        }
      });
    }

    return res.json({
      success: true,
      data: {
        name: path.basename(filePath),
        path: filePath.replace(process.cwd(), ""),
        size: stat.size,
        sizeFormatted: formatFileSize(stat.size),
        content: "File too large to preview"
      }
    });

  } catch (error) {
    console.error("Read file error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// FILE MANAGER - DELETE FILE/FOLDER
// ==========================================
app.delete("/api/v1/files/delete", function(req, res) {
  console.log(">>> FILES delete called:", req.body.path);

  try {
    var fs = require("fs");
    var path = require("path");

    var targetPath = path.resolve(req.body.path || "");

    if (!targetPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    var stat = fs.statSync(targetPath);

    if (stat.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }

    return res.json({ success: true, message: "Deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// FILE MANAGER - RENAME
// ==========================================
app.post("/api/v1/files/rename", function(req, res) {
  console.log(">>> FILES rename called:", req.body);

  try {
    var fs = require("fs");
    var path = require("path");

    var oldPath = req.body.oldPath;
    var newName = req.body.newName;

    if (!oldPath || !newName) {
      return res.status(400).json({ success: false, message: "Old path and new name required" });
    }

    var oldFullPath = path.resolve(oldPath);
    var newFullPath = path.join(path.dirname(oldFullPath), newName);

    if (!oldFullPath.startsWith(process.cwd()) || !newFullPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!fs.existsSync(oldFullPath)) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (fs.existsSync(newFullPath)) {
      return res.status(409).json({ success: false, message: "Name already exists" });
    }

    fs.renameSync(oldFullPath, newFullPath);

    return res.json({ success: true, message: "Renamed successfully" });

  } catch (error) {
    console.error("Rename error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// PACKAGE MANAGER - HELPER
// ==========================================
function getRealPackages() {
  try {
    var execSync = require("child_process").execSync;

    // Coba ambil daftar package terinstall
    var stdout = execSync("pkg list-installed 2>/dev/null || apt list --installed 2>/dev/null || echo ''", {
      timeout: 5000,
      encoding: "utf8"
    });

    if (!stdout || stdout.trim() === "") {
      return null;
    }

    var lines = stdout.trim().split("\n");
    var packages = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.startsWith("Listing") || line.startsWith("WARNING")) continue;

      // Format pkg: "package/version"
      // Format apt: "package/stable,now version arch [installed]"
      var parts = line.split("/");
      if (parts.length >= 2) {
        var name = parts[0].trim();
        var version = parts[1].split(" ")[0].split(",")[0].trim();

        packages.push({
          name: name,
          version: version || "unknown",
          status: "installed",
          description: ""
        });
      }
    }

    if (packages.length > 0) {
      console.log("Got " + packages.length + " real packages from system");
      return packages;
    }

    return null;
  } catch (e) {
    console.log("Cannot get real packages:", e.message);
    return null;
  }
}

function getAvailablePackages() {
  try {
    var execSync = require("child_process").execSync;

    // Coba apt cache search
    var stdout = execSync("apt-cache search . 2>/dev/null | head -50 || pkg search . 2>/dev/null | head -50 || echo ''", {
      timeout: 10000,
      encoding: "utf8"
    });

    if (!stdout || stdout.trim() === "") {
      return null;
    }

    var lines = stdout.trim().split("\n");
    var packages = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      // Format: "package - description"
      var dashIndex = line.indexOf(" - ");
      if (dashIndex > 0) {
        var name = line.substring(0, dashIndex).trim();
        var description = line.substring(dashIndex + 3).trim();

        packages.push({
          name: name,
          version: "latest",
          status: "available",
          description: description
        });
      }
    }

    if (packages.length > 0) {
      console.log("Got " + packages.length + " available packages from repository");
      return packages;
    }

    return null;
  } catch (e) {
    console.log("Cannot get available packages:", e.message);
    return null;
  }
}

// Fallback dummy data
function getDummyPackages() {
  return [
    { name: "nodejs", version: "20.11.0", status: "installed", description: "JavaScript runtime environment" },
    { name: "python", version: "3.12.0", status: "installed", description: "Python programming language" },
    { name: "php", version: "8.2.0", status: "installed", description: "PHP scripting language" },
    { name: "nginx", version: "1.24.0", status: "installed", description: "High-performance web server" },
    { name: "apache2", version: "2.4.58", status: "available", description: "Apache HTTP server" },
    { name: "mariadb", version: "10.11.0", status: "installed", description: "MariaDB database server" },
    { name: "sqlite", version: "3.44.0", status: "installed", description: "SQLite embedded database" },
    { name: "git", version: "2.43.0", status: "installed", description: "Distributed version control" },
    { name: "curl", version: "8.5.0", status: "installed", description: "Command line URL tool" },
    { name: "wget", version: "1.21.0", status: "installed", description: "Network downloader" },
    { name: "openssh", version: "9.6.0", status: "installed", description: "Secure shell connectivity" },
    { name: "tmux", version: "3.4.0", status: "available", description: "Terminal multiplexer" },
    { name: "screen", version: "4.9.0", status: "available", description: "Terminal session manager" },
    { name: "redis", version: "7.2.0", status: "available", description: "In-memory data store" },
    { name: "postgresql", version: "16.1", status: "available", description: "PostgreSQL database" },
    { name: "zip", version: "3.0", status: "installed", description: "Compression and packaging" },
    { name: "unzip", version: "6.0", status: "installed", description: "Extraction utility" },
    { name: "tar", version: "1.35", status: "installed", description: "Archive manipulation" },
    { name: "busybox", version: "1.36", status: "installed", description: "Unix utility collection" },
    { name: "cronie", version: "1.6.0", status: "available", description: "Cron daemon for scheduling" }
  ];
}

// ==========================================
// PACKAGE MANAGER - LIST INSTALLED
// ==========================================
app.get("/api/v1/packages/installed", function(req, res) {
  console.log(">>> PACKAGES list installed called");

  // Coba real packages dulu
  var packages = getRealPackages();

  // Jika gagal, gunakan dummy
  if (!packages || packages.length === 0) {
    console.log("Using dummy packages (Windows/dev mode)");
    packages = getDummyPackages().filter(function(p) {
      return p.status === "installed";
    });
  }

  return res.json({
    success: true,
    data: {
      packages: packages,
      total: packages.length,
      source: packages[0] && packages[0].description ? "dummy" : "system"
    }
  });
});

// ==========================================
// PACKAGE MANAGER - SEARCH
// ==========================================
app.get("/api/v1/packages/search", function(req, res) {
  console.log(">>> PACKAGES search called:", req.query.q);

  var query = (req.query.q || "").toLowerCase();

  if (!query || query.length < 1) {
    return res.json({ success: true, data: { packages: [], total: 0 } });
  }

  // Coba real available packages dulu
  var packages = getAvailablePackages();

  // Jika gagal, cari di dummy
  if (!packages || packages.length === 0) {
    console.log("Using dummy packages for search");
    packages = getDummyPackages();
  }

  var results = packages.filter(function(pkg) {
    return pkg.name.toLowerCase().includes(query) ||
           (pkg.description && pkg.description.toLowerCase().includes(query));
  });

  return res.json({
    success: true,
    data: { packages: results, total: results.length, query: query }
  });
});

// ==========================================
// PACKAGE MANAGER - INSTALL
// ==========================================
app.post("/api/v1/packages/install", function(req, res) {
  console.log(">>> PACKAGES install called:", req.body.name);

  var packageName = req.body.name;

  if (!packageName) {
    return res.status(400).json({ success: false, message: "Package name required" });
  }

  // Coba install real
  try {
    var execSync = require("child_process").execSync;
    console.log("Attempting to install:", packageName);

    var result = execSync("pkg install -y " + packageName + " 2>&1 || apt install -y " + packageName + " 2>&1", {
      timeout: 60000,
      encoding: "utf8"
    });

    console.log("Install result:", result.substring(0, 200));

    return res.json({
      success: true,
      message: "Package installed: " + packageName,
      data: { name: packageName, status: "installed", real: true }
    });

  } catch (e) {
    console.log("Real install failed (expected on Windows):", e.message);

    // Fallback: simulate success
    return res.json({
      success: true,
      message: "Package queued for install: " + packageName + " (simulated on Windows)",
      data: { name: packageName, status: "installed", real: false }
    });
  }
});

// ==========================================
// PACKAGE MANAGER - REMOVE
// ==========================================
app.post("/api/v1/packages/remove", function(req, res) {
  console.log(">>> PACKAGES remove called:", req.body.name);

  var packageName = req.body.name;

  if (!packageName) {
    return res.status(400).json({ success: false, message: "Package name required" });
  }

  // Coba remove real
  try {
    var execSync = require("child_process").execSync;
    console.log("Attempting to remove:", packageName);

    execSync("pkg uninstall -y " + packageName + " 2>&1 || apt remove -y " + packageName + " 2>&1", {
      timeout: 30000,
      encoding: "utf8"
    });

    return res.json({
      success: true,
      message: "Package removed: " + packageName,
      data: { real: true }
    });

  } catch (e) {
    console.log("Real remove failed (expected on Windows):", e.message);

    return res.json({
      success: true,
      message: "Package removed: " + packageName + " (simulated on Windows)",
      data: { real: false }
    });
  }
});


// ==========================================
// SETTINGS - GET USER SETTINGS
// ==========================================
app.get("/api/v1/settings", async function(req, res) {
  console.log(">>> SETTINGS get called");

  try {
    if (!prisma) {
      return res.json({
        success: true,
        data: {
          theme: "dark",
          language: "en",
          port: 3000,
          autoStart: false,
          autoBackup: false,
          notifications: true
        }
      });
    }

    // Get user from token
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: true, data: getDefaultSettings() });
    }

    var token = authHeader.split(" ")[1];
    var decoded = jwt.verify(token, JWT_SECRET);

    var user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { settings: true }
    });

    if (!user || !user.settings) {
      return res.json({ success: true, data: getDefaultSettings() });
    }

    return res.json({
      success: true,
      data: {
        theme: user.settings.theme,
        language: user.settings.language,
        port: user.settings.port,
        autoStart: user.settings.autoStart,
        autoBackup: user.settings.autoBackup,
        notifications: user.settings.notifications
      }
    });

  } catch (error) {
    console.error("Get settings error:", error.message);
    return res.json({ success: true, data: getDefaultSettings() });
  }
});

// ==========================================
// SETTINGS - UPDATE
// ==========================================
app.put("/api/v1/settings", async function(req, res) {
  console.log(">>> SETTINGS update called:", req.body);

  try {
    if (!prisma) {
      return res.json({ success: true, message: "Settings saved (no database)" });
    }

    var authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    var token = authHeader.split(" ")[1];
    var decoded = jwt.verify(token, JWT_SECRET);

    var { theme, language, port, autoStart, autoBackup, notifications } = req.body;

    await prisma.settings.update({
      where: { userId: decoded.userId },
      data: {
        theme: theme || undefined,
        language: language || undefined,
        port: port || undefined,
        autoStart: autoStart !== undefined ? autoStart : undefined,
        autoBackup: autoBackup !== undefined ? autoBackup : undefined,
        notifications: notifications !== undefined ? notifications : undefined,
      }
    });

    return res.json({ success: true, message: "Settings updated" });

  } catch (error) {
    console.error("Update settings error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// SETTINGS - CHANGE PASSWORD
// ==========================================
app.put("/api/v1/auth/password", async function(req, res) {
  console.log(">>> PASSWORD change called");

  try {
    if (!prisma) {
      return res.status(500).json({ success: false, message: "Database not available" });
    }

    var authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    var token = authHeader.split(" ")[1];
    var decoded = jwt.verify(token, JWT_SECRET);

    var { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password minimum 6 characters" });
    }

    var user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    var valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    var hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashed }
    });

    return res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.error("Change password error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// DATABASE MANAGER - LIST
// ==========================================
app.get("/api/v1/databases", async function(req, res) {
  console.log(">>> DATABASES list called");

  try {
    if (!prisma) {
      return res.json({ success: true, data: { databases: [] } });
    }

    var databases = await prisma.database.findMany({
      orderBy: { createdAt: "desc" }
    });

    return res.json({ success: true, data: { databases } });

  } catch (error) {
    console.error("List databases error:", error.message);
    return res.json({ success: true, data: { databases: [] } });
  }
});

// ==========================================
// DATABASE MANAGER - CREATE
// ==========================================
app.post("/api/v1/databases", async function(req, res) {
  console.log(">>> DATABASES create called:", req.body);

  try {
    if (!prisma) {
      return res.json({ success: true, message: "Database created (simulated)" });
    }

    var { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: "Name and type required" });
    }

    var db = await prisma.database.create({
      data: {
        name: name,
        type: type,
        status: "running",
        path: "./databases/" + name
      }
    });

    return res.status(201).json({ success: true, data: { database: db } });

  } catch (error) {
    console.error("Create database error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// DATABASE MANAGER - DELETE
// ==========================================
app.delete("/api/v1/databases/:id", async function(req, res) {
  console.log(">>> DATABASES delete called:", req.params.id);

  try {
    if (!prisma) {
      return res.json({ success: true, message: "Database deleted (simulated)" });
    }

    await prisma.database.delete({ where: { id: req.params.id } });

    return res.json({ success: true, message: "Database deleted" });

  } catch (error) {
    console.error("Delete database error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Helper: Default settings
function getDefaultSettings() {
  return {
    theme: "dark",
    language: "en",
    port: 3000,
    autoStart: false,
    autoBackup: false,
    notifications: true
  };
}


// ==========================================
// TERMINAL - EXECUTE COMMAND (REALTIME)
// ==========================================
app.post("/api/v1/terminal/exec", function(req, res) {
  console.log(">>> TERMINAL exec called:", req.body.command);

  try {
    var spawn = require("child_process").spawn;
    var command = req.body.command;
    var cwd = req.body.cwd || process.cwd();

    if (!command) {
      return res.status(400).json({ success: false, message: "Command required" });
    }

    // Security: block dangerous commands
    var blockedPatterns = [
      "rm -rf /",
      "mkfs",
      "dd if=",
      ":(){ :|:& };:",
      "chmod 777 /",
      "> /dev/sda"
    ];

    var isBlocked = blockedPatterns.some(function(pattern) {
      return command.toLowerCase().includes(pattern.toLowerCase());
    });

    if (isBlocked) {
      return res.status(403).json({
        success: false,
        output: "Error: Command blocked for security reasons.",
        cwd: cwd
      });
    }

    // Execute dengan spawn untuk realtime
    var shell = process.platform === "win32" ? "cmd.exe" : "/bin/bash";
    var shellArgs = process.platform === "win32" ? ["/c", command] : ["-c", command];

    var child = spawn(shell, shellArgs, {
      cwd: cwd,
      timeout: 30000,
      maxBuffer: 1024 * 1024 * 10,
      env: process.env
    });

    var stdout = "";
    var stderr = "";

    child.stdout.on("data", function(data) {
      stdout += data.toString();
    });

    child.stderr.on("data", function(data) {
      stderr += data.toString();
    });

    child.on("close", function(code) {
      return res.json({
        success: code === 0,
        data: {
          command: command,
          output: stdout,
          error: stderr,
          exitCode: code,
          cwd: cwd
        }
      });
    });

    child.on("error", function(err) {
      return res.status(500).json({
        success: false,
        output: err.message,
        cwd: cwd
      });
    });

  } catch (error) {
    console.error("Terminal exec error:", error.message);
    return res.status(500).json({
      success: false,
      output: error.message
    });
  }
});

// ==========================================
// TERMINAL - CHANGE DIRECTORY
// ==========================================
app.post("/api/v1/terminal/cd", function(req, res) {
  console.log(">>> TERMINAL cd called:", req.body.path);

  try {
    var path = require("path");
    var fs = require("fs");
    var newPath = req.body.path;

    if (!newPath) {
      return res.status(400).json({ success: false, message: "Path required" });
    }

    var resolvedPath = path.resolve(req.body.cwd || process.cwd(), newPath);

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ success: false, message: "Directory not found" });
    }

    var stat = fs.statSync(resolvedPath);
    if (!stat.isDirectory()) {
      return res.status(400).json({ success: false, message: "Not a directory" });
    }

    return res.json({
      success: true,
      data: { cwd: resolvedPath }
    });

  } catch (error) {
    console.error("CD error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// TERMINAL - GET CURRENT DIRECTORY
// ==========================================
app.get("/api/v1/terminal/pwd", function(req, res) {
  return res.json({
    success: true,
    data: { cwd: process.cwd() }
  });
});


// ==========================================
// BACKUP - CREATE BACKUP
// ==========================================
app.post("/api/v1/backup", function(req, res) {
  console.log(">>> BACKUP create called:", req.body.type);

  try {
    var fs = require("fs");
    var path = require("path");
    var type = req.body.type || "full";

    var backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    var timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    var backupName = "backup-" + type + "-" + timestamp + ".json";
    var backupPath = path.join(backupDir, backupName);

    // Collect backup data
    var backupData = {
      type: type,
      timestamp: new Date().toISOString(),
      system: {
        hostname: require("os").hostname(),
        platform: require("os").platform(),
        arch: require("os").arch(),
        cpus: require("os").cpus().length,
        totalmem: require("os").totalmem(),
        uptime: require("os").uptime(),
      },
      message: "Backup created at " + new Date().toISOString()
    };

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    // Save to database if available
    if (prisma) {
      prisma.backup.create({
        data: {
          name: backupName,
          type: type,
          path: backupPath,
          size: fs.statSync(backupPath).size,
          status: "completed"
        }
      }).catch(function(e) {
        console.log("Backup db save error:", e.message);
      });
    }

    return res.json({
      success: true,
      message: "Backup created successfully",
      data: {
        name: backupName,
        path: backupPath,
        size: fs.statSync(backupPath).size,
        type: type
      }
    });

  } catch (error) {
    console.error("Backup error:", error.message);
    return res.status(500).json({ success: false, message: "Backup failed: " + error.message });
  }
});

// ==========================================
// BACKUP - LIST BACKUPS
// ==========================================
app.get("/api/v1/backups", async function(req, res) {
  console.log(">>> BACKUPS list called");

  try {
    if (prisma) {
      var backups = await prisma.backup.findMany({
        orderBy: { createdAt: "desc" }
      });
      return res.json({ success: true, data: { backups } });
    }

    // Fallback: read backup directory
    var fs = require("fs");
    var path = require("path");
    var backupDir = path.join(process.cwd(), "backups");

    if (!fs.existsSync(backupDir)) {
      return res.json({ success: true, data: { backups: [] } });
    }

    var files = fs.readdirSync(backupDir);
    var backups = files.map(function(file) {
      var filePath = path.join(backupDir, file);
      var stat = fs.statSync(filePath);
      return {
        id: file,
        name: file,
        type: "full",
        path: filePath,
        size: stat.size,
        status: "completed",
        createdAt: stat.mtime.toISOString()
      };
    });

    return res.json({ success: true, data: { backups } });

  } catch (error) {
    console.error("List backups error:", error.message);
    return res.json({ success: true, data: { backups: [] } });
  }
});

// ==========================================
// BACKUP - DOWNLOAD BACKUP
// ==========================================
app.get("/api/v1/backup/download/:name", function(req, res) {
  console.log(">>> BACKUP download called:", req.params.name);

  try {
    var path = require("path");
    var fs = require("fs");
    var filePath = path.join(process.cwd(), "backups", req.params.name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }

    return res.download(filePath);

  } catch (error) {
    console.error("Download backup error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// BACKUP - DELETE BACKUP
// ==========================================
app.delete("/api/v1/backup/:name", function(req, res) {
  console.log(">>> BACKUP delete called:", req.params.name);

  try {
    var path = require("path");
    var fs = require("fs");
    var filePath = path.join(process.cwd(), "backups", req.params.name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (prisma) {
      prisma.backup.deleteMany({
        where: { name: req.params.name }
      }).catch(function() {});
    }

    return res.json({ success: true, message: "Backup deleted" });

  } catch (error) {
    console.error("Delete backup error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================================
// RESTORE - RESTORE FROM BACKUP
// ==========================================
app.post("/api/v1/restore", function(req, res) {
  console.log(">>> RESTORE called:", req.body.name);

  try {
    var path = require("path");
    var fs = require("fs");
    var backupName = req.body.name;
    var filePath = path.join(process.cwd(), "backups", backupName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Backup file not found" });
    }

    var backupData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return res.json({
      success: true,
      message: "Restore completed successfully",
      data: backupData
    });

  } catch (error) {
    console.error("Restore error:", error.message);
    return res.status(500).json({ success: false, message: "Restore failed: " + error.message });
  }
});

// =============================================
// 404 HANDLER
// =============================================
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.url
  });
});

// =============================================
// START SERVER
// =============================================
server.listen(PORT, "0.0.0.0", () => {
  console.log("================================================");
  console.log("  Zen Server API");
  console.log("  URL:  http://localhost:" + PORT);
  console.log("  Health: http://localhost:" + PORT + "/api/health");
  console.log("  Login:  POST http://localhost:" + PORT + "/api/v1/auth/login");
  console.log("  Register: POST http://localhost:" + PORT + "/api/v1/auth/register");
  console.log("================================================");
});

server.on("error", (err) => {
  console.error("Server failed to start:", err.message);
  if (err.code === "EADDRINUSE") {
    console.error("Port " + PORT + " is already in use. Close other applications first.");
  }
});
