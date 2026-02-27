<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cheat - Jalan Tikus</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bsi-teal: #00a19d;
            --bsi-orange: #f39200;
            --dark-bg: #1a1a1a;
            --success: #27ae60;
            --danger: #e74c3c;
            --primary: #3498db;
        }

        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

        body { 
            background: linear-gradient(135deg, #f4f7f6 0%, #d1d9d9 100%);
            display: flex; justify-content: center; align-items: center; 
            min-height: 100vh; margin: 0; padding: 20px;
        }

        .card { 
            width: 100%; max-width: 600px; 
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 24px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
            padding: 40px; 
            border: 1px solid rgba(255,255,255,0.3);
            position: relative; overflow: hidden;
        }

        .card::before {
            content: ""; position: absolute; top: 0; left: 0; right: 0; height: 8px;
            background: linear-gradient(90deg, var(--bsi-teal), var(--bsi-orange));
        }

        .header { text-align: center; margin-bottom: 30px; }
        h2 { margin: 0; color: #333; font-weight: 700; letter-spacing: -0.5px; }
        p.subtitle { color: #666; margin: 5px 0 0; font-size: 14px; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }

        .status-box { 
            background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 16px; 
            text-align: center; transition: 0.3s;
        }

        .status-label { font-size: 11px; text-transform: uppercase; color: #999; font-weight: 700; margin-bottom: 5px; }
        .status-value { font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; }

        .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--danger); display: inline-block; }
        .running .pulse { background: var(--success); animation: pulse-animation 1.5s infinite; }

        @keyframes pulse-animation {
            0% { box-shadow: 0 0 0 0px rgba(39, 174, 96, 0.4); }
            100% { box-shadow: 0 0 0 10px rgba(39, 174, 96, 0); }
        }

        .control-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px; }
        
        button { 
            padding: 14px; border: none; border-radius: 12px; 
            cursor: pointer; font-weight: 600; font-size: 14px;
            transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; color: white;
        }

        .btn-start { background: var(--success); }
        .btn-manual { background: var(--primary); }
        .btn-stop { background: var(--danger); grid-column: span 2; }

        button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        button:disabled { background: #ccc; cursor: not-allowed; opacity: 0.6; }

        .log-container { background: var(--dark-bg); border-radius: 18px; overflow: hidden; }
        .log-header { background: #2a2a2a; color: #888; padding: 10px 18px; font-size: 11px; font-weight: 700; display: flex; justify-content: space-between; }
        .log-body { height: 220px; overflow-y: auto; padding: 15px; color: #00ffcc; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6; }
    </style>
</head>
<body>

    <div class="card" id="mainCard">
        <div class="header">
            <h2>BSI FEST 2026</h2>
            <p class="subtitle">Jalan Tikus - Real-Time API System</p>
        </div>

        <div class="info-grid">
            <div class="status-box">
                <div class="status-label">Engine Status</div>
                <div class="status-value">
                    <span class="pulse"></span> <span id="statusText" style="color:var(--danger)">OFFLINE</span>
                </div>
            </div>
            <div class="status-box">
                <div class="status-label">Next Sync</div>
                <div class="status-value" id="countdownText" style="color: var(--bsi-teal);">--:--</div>
            </div>
        </div>

        <div class="control-panel">
            <button id="btnStart" class="btn-start">▶ Start Auto</button>
            <button id="btnManual" class="btn-manual">✚ Manual Input</button>
            <button id="btnStop" class="btn-stop" disabled>■ Stop Engine</button>
        </div>

        <div class="log-container">
            <div class="log-header">
                <span>ACTIVITY LOG</span>
                <span id="realTimeClock">00:00:00</span>
            </div>
            <div id="logBox" class="log-body">
                <div>[SYSTEM] Tikus ready...</div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
    <script>
        setInterval(() => {
            document.getElementById('realTimeClock').innerText = new Date().toLocaleTimeString('id-ID');
        }, 1000);
    </script>
</body>
</html>