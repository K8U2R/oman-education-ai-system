// sovereign-radar/web/server.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { scanProject } from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static UI files
app.use(express.static(path.join(__dirname, 'ui')));

// API endpoint
app.get('/api/scan', async (req, res) => {
    try {
        const target = req.query.path || 'apps/frontend/src/presentation/pages';
        const result = await scanProject(target);
        res.json(result);
    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ Sovereign Radar UI running at http://localhost:${PORT}`);
    console.log(`   (المسح عبر: http://localhost:${PORT}/api/scan)`);
});