// ==========================================
// CONFIG AREA
// ==========================================
const apiUrl = 'https://script.google.com/macros/s/AKfycbzMYFD8jahEVLOktUxUh_6NbFzndyd7YHqKTPsBiPZ_f_62Tb8kV-DSKqY9hwgnS1X2KA/exec';
const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfARz3k2fBImp4DrEIcWu4QrcvFRFoxOEu2129lYaGF5K01rw/formResponse';

const listPromo = ["Cicil Emas", "Tab Haji", "Gadai Emas", "BSI Oto", "Griya", "Mitraguna", "Tabungan Emas", "Deposito", "BYOND"];
const listProduk = ["Cicil Emas", "Tab Haji", "Gadai Emas", "BSI Oto", "Griya", "Mitraguna", "Tabungan Emas", "Deposito", "Reksadana", "Sukuk Berharga"];

// SETTING TURBO: 10 Detik
const turboInterval = 10;
let timerValue = turboInterval; 
let countdownInterval;
let isProcessing = false; 
let successCount = 0;

const btnStart = document.getElementById('btnStart');
const btnManual = document.getElementById('btnManual');
const btnStop = document.getElementById('btnStop');
const statusText = document.getElementById('statusText');
const logBox = document.getElementById('logBox');
const countdownText = document.getElementById('countdownText');
const mainCard = document.getElementById('mainCard');

function addLog(msg) {
    const time = new Date().toLocaleTimeString('id-ID');
    // Proteksi Memory: Bersihkan log jika lebih dari 50 baris agar tidak lag
    if (logBox.children.length > 50) {
        logBox.innerHTML = '<div>[SYSTEM] Log cleared for performance...</div>';
    }
    logBox.innerHTML += `<div><span style="color:#636e72">[${time}]</span> ${msg}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function prosesOtomasi(isManual = false) {
    if (isProcessing) return;
    isProcessing = true;

    addLog(isManual ? "<span style='color:#3498db'>[MANUAL]</span> Checking..." : "<span style='color:#f39200'>[TURBO]</span> Fetching...");

    try {
        // Fetch data via API (Timestamp t digunakan untuk bypass cache Google)
        const response = await fetch(`${apiUrl}?t=${Date.now()}`);
        const resJson = await response.json();

        if (resJson.status === "empty") {
            addLog("<span style='color:#e74c3c'>[INFO]</span> Data habis/Spreadsheet kosong.");
            isProcessing = false;
            if (!isManual) stopScript();
            return;
        }

        addLog(`Inputting: <b>${resJson.nama}</b>`);

        let promo = getRandom(listPromo);
        let produk = getRandom(listProduk);
        while (produk === promo) { produk = getRandom(listProduk); }

        // 1. Submit Google Form
        const payload = new URLSearchParams();
        payload.append('entry.262853679', resJson.nama);
        payload.append('entry.1966912910', resJson.wa);
        payload.append('entry.1500659051', resJson.cabang.toUpperCase());
        payload.append('entry.1727869846', promo);
        payload.append('entry.161088095', produk);
        payload.append('entry.1446262211', "Bersedia");
        payload.append('entry.665311139', resJson.domisili);

        await fetch(formUrl, { method: 'POST', mode: 'no-cors', body: payload });

        // 2. Delete row via POST ke Apps Script
        await fetch(`${apiUrl}?nama=${encodeURIComponent(resJson.nama)}`, {
            method: 'POST',
            mode: 'no-cors'
        });

        successCount++;
        addLog(`<span style='color:#27ae60'>[SUCCESS]</span> <b>${resJson.nama}</b> (#${successCount})`);
        
        // Reset timer ke 10 detik setelah berhasil
        timerValue = turboInterval; 

    } catch (e) {
        addLog("<span style='color:#e74c3c'>[ERROR]</span> Kegagalan API/Koneksi.");
    } finally {
        isProcessing = false;
    }
}

btnStart.onclick = () => {
    btnStart.disabled = true;
    btnStop.disabled = false;
    mainCard.classList.add('running');
    statusText.innerText = "RUNNING";
    statusText.style.color = "var(--success)";
    
    addLog("Turbo Engine Started (10s interval).");
    prosesOtomasi();
    
    countdownInterval = setInterval(() => {
        timerValue--;
        // Tampilan timer lebih ringkas untuk Turbo Mode
        countdownText.innerText = `${timerValue}s`;
        
        if (timerValue <= 0) {
            prosesOtomasi();
            timerValue = turboInterval;
        }
    }, 1000);
};

btnManual.onclick = () => {
    prosesOtomasi(true);
};

btnStop.onclick = stopScript;

function stopScript() {
    btnStart.disabled = false;
    btnStop.disabled = true;
    mainCard.classList.remove('running');
    statusText.innerText = "OFFLINE";
    statusText.style.color = "var(--danger)";
    clearInterval(countdownInterval);
    countdownText.innerText = "--:--";
    addLog("Engine stopped.");
}

// Clock Update
setInterval(() => {
    const clock = document.getElementById('realTimeClock');
    if(clock) clock.innerText = new Date().toLocaleTimeString('id-ID');
}, 1000);
