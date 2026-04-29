import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Saving to Sheets (Simulated)
  app.post("/api/save-to-sheets", (req, res) => {
    const reportData = req.body;
    console.log("-----------------------------------------");
    console.log("INCOMING AUDIT ARCHIVE FOR THE LAB SHEETS");
    console.log("DOCTOR:", reportData.doctorName);
    console.log("SPECIALTY:", reportData.specialty);
    console.log("CONTACT:", reportData.contactInfo);
    console.log("OVERALL SCORE:", reportData.overallScore);
    console.log("SUMMARY:", reportData.summary);
    console.log("-----------------------------------------");
    
    // In a real scenario, you would use googleapis npm package to append to a sheet here.
    // For now, we simulate success.
    res.json({ success: true, message: "Data archived successfully in THE LAB Cloud." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`THE LAB Audit System Running on http://localhost:${PORT}`);
  });
}

startServer();
