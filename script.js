// ==========================================
// CONFIG AREA
// ==========================================
const apiUrl = 'https://script.google.com/macros/s/AKfycbzMYFD8jahEVLOktUxUh_6NbFzndyd7YHqKTPsBiPZ_f_62Tb8kV-DSKqY9hwgnS1X2KA/exec';
const formUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfARz3k2fBImp4DrEIcWu4QrcvFRFoxOEu2129lYaGF5K01rw/formResponse';

const listPromo = ["Cicil Emas", "Tab Haji", "Gadai Emas", "BSI Oto", "Griya", "Mitraguna", "Tabungan Emas", "Deposito", "BYOND"];
const listProduk = ["Cicil Emas", "Tab Haji", "Gadai Emas", "BSI Oto", "Griya", "Mitraguna", "Tabungan Emas", "Deposito", "Reksadana", "Sukuk Berharga"];

let timerValue = 60; 
let countdownInterval;
let isProcessing = false; 

const btnStart = document.getElementById('btnStart');
const btnManual = document.getElementById('btnManual');
const btnStop = document.getElementById('btnStop');
const statusText = document.getElementById('statusText');
const logBox = document.getElementById('logBox');
const countdownText = document.getElementById('countdownText');
const mainCard = document.getElementById('mainCard');

function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    logBox.innerHTML += `<div>[${time}] ${msg}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function prosesOtomasi(isManual = false) {
    if (isProcessing) return;
    isProcessing = true;

    addLog(isManual ? "Cek data (Manual)..." : "Cek data (Otomatis)...");

    try {
        // Fetch data via Apps Script API (Avoid CSV Cache)
        const response = await fetch(`${apiUrl}?t=${Date.now()}`);
        const resJson = await response.json();

        if (resJson.status === "empty") {
            addLog("INFO: Spreadsheet kosong.");
            isProcessing = false;
            if (!isManual) stopScript();
            return;
        }

        addLog(`Inputting: ${resJson.nama}...`);

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

        // 2. Delete row via POST
        await fetch(`${apiUrl}?nama=${encodeURIComponent(resJson.nama)}`, {
            method: 'POST',
            mode: 'no-cors'
        });

        addLog(`SUKSES: ${resJson.nama} terkirim & dihapus.`);
        if (isManual) timerValue = 300; 

    } catch (e) {
        addLog("ERROR: Kegagalan API/Koneksi.");
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
    
    addLog("Otomasi dimulai (Interval 5 Menit).");
    prosesOtomasi();
    
    countdownInterval = setInterval(() => {
        timerValue--;
        countdownText.innerText = `${Math.floor(timerValue / 60)}m ${timerValue % 60}s`;
        if (timerValue <= 0) {
            prosesOtomasi();
            timerValue = 300;
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
    addLog("Otomasi dihentikan.");

}
