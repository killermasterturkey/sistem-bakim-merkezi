// ======================= GLOBAL DEĞİŞKENLER =======================
let socket = null;
let isConnected = false;
let statsInterval = null;
let currentOperation = null;
let notificationsEnabled = false;

// Chart.js grafikleri
let cpuChart = null;
let memoryChart = null;
let diskIOChart = null;
let networkChart = null;
let chartsInitialized = false;

// Performans verileri
const MAX_DATA_POINTS = 60;
let performanceData = {
    labels: [],
    cpu: [],
    memory: [],
    diskRead: [],
    diskWrite: [],
    netSent: [],
    netRecv: []
};

// ======================= YARDIMCI FONKSİYONLAR =======================
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// ======================= TAM EKRAN MODU =======================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add('fullscreen');
            updateFullscreenIcons(true);
        }).catch(err => {
            console.log('Tam ekran hatası:', err);
        });
    } else {
        document.exitFullscreen().then(() => {
            document.body.classList.remove('fullscreen');
            updateFullscreenIcons(false);
        });
    }
}

function updateFullscreenIcons(isFullscreen) {
    const loginBtn = document.getElementById('login-fullscreen-btn');
    const mainBtn = document.getElementById('fullscreen-btn');

    if (loginBtn) {
        loginBtn.innerHTML = isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
    }
    if (mainBtn) {
        mainBtn.innerHTML = isFullscreen ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand"></i>';
    }
}

// Fullscreen event listener
document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    document.body.classList.toggle('fullscreen', isFullscreen);
    updateFullscreenIcons(isFullscreen);
});

// Login fullscreen button
const loginFullscreenBtn = document.getElementById('login-fullscreen-btn');
if (loginFullscreenBtn) {
    loginFullscreenBtn.addEventListener('click', toggleFullscreen);
}

// ======================= ŞİFRE GÖSTER/GİZLE =======================
const togglePasswordBtn = document.getElementById('toggle-password');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('sudo-password');
        const icon = togglePasswordBtn.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// ======================= LOGIN HATA GÖSTERİMİ =======================
function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    const errorText = errorDiv.querySelector('.error-text');
    if (errorText) {
        errorText.textContent = message;
    } else {
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i><span class="error-text">${escapeHtml(message)}</span>`;
    }
    errorDiv.classList.add('show');
}

function hideLoginError() {
    const errorDiv = document.getElementById('login-error');
    errorDiv.classList.remove('show');
}

// ======================= TOAST BİLDİRİMLERİ =======================
function showToast(type, title, message, duration = 5000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ======================= SOCKET.IO BAĞLANTISI =======================
function connectSocket() {
    socket = io();

    socket.on('connect', () => {
        isConnected = true;
        updateConnectionStatus(true);
        showToast('success', 'Bağlantı Kuruldu', 'Sunucu ile bağlantı başarılı');
    });

    socket.on('disconnect', () => {
        isConnected = false;
        updateConnectionStatus(false);
        showToast('error', 'Bağlantı Kesildi', 'Sunucu ile bağlantı koptu');
    });

    socket.on('operation_status', (data) => {
        if (data.status === 'completed') {
            showToast('success', t('completed'), data.message);
            enableAllButtons();
        } else if (data.status === 'error') {
            showToast('error', t('error'), data.message);
            enableAllButtons();
        } else if (data.status === 'running') {
            showToast('info', t('running'), data.message);
        }
    });

    socket.on('operation_output', (data) => {
        // İşlem çıktıları loglanıyor
        console.log('[Operation]', data.line);
    });

    socket.on('realtime_stats', (data) => {
        updateRealtimeStats(data);
    });
}

function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status');
    if (connected) {
        statusEl.classList.remove('disconnected');
        statusEl.querySelector('span:last-child').textContent = 'Bağlı';
    } else {
        statusEl.classList.add('disconnected');
        statusEl.querySelector('span:last-child').textContent = 'Bağlantı Kesildi';
    }
}

// ======================= GİRİŞ İŞLEMLERİ =======================
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('sudo-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    hideLoginError();

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            // Başarılı giriş animasyonu
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            connectSocket();
            loadDashboard();
            startRealtimeStats();
            initCharts();
            loadSystemTweaks();
            loadScheduledTasks();
            showToast('success', 'Hoş Geldiniz', 'Sistem Bakım Merkezi v2.0\'a giriş yapıldı');
        } else {
            showLoginError(data.message || 'Giriş başarısız. Lütfen şifrenizi kontrol edin.');
        }
    } catch (error) {
        showLoginError('Sunucu bağlantı hatası. Lütfen tekrar deneyin.');
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
});

// Çıkış
document.getElementById('logout-btn').addEventListener('click', async () => {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        await fetch('/api/logout', { method: 'POST' });
        stopRealtimeStats();
        chartsInitialized = false;
        isConnected = false;
        if (socket) socket.disconnect();
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('sudo-password').value = '';
        document.getElementById('login-error').classList.remove('show');
        showToast('info', 'Çıkış Yapıldı', 'Güvenli çıkış gerçekleştirildi');
    }
});

// ======================= MENÜ NAVİGASYONU =======================
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;

        // Aktif menü öğesini güncelle
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Aktif bölümü güncelle
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        // Bölüme göre veri yükle
        loadSectionData(section);
    });
});

function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'performance':
            loadPerformanceHistory();
            break;
        case 'processes':
            loadProcesses();
            break;
        case 'services':
            loadServices();
            break;
        case 'packages':
            loadPackages();
            break;
        case 'optimization':
            loadSystemTweaks();
            break;
        case 'scheduled':
            loadScheduledTasks();
            break;
    }
}

// ======================= DASHBOARD =======================
async function loadDashboard() {
    try {
        const response = await fetch('/api/system-info');
        const data = await response.json();

        // Sistem bilgileri
        const systemInfoList = document.getElementById('system-info-list');
        systemInfoList.innerHTML = `
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-linux"></i> İşletim Sistemi</span>
                <span class="info-item-value">${data.os_name || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-code-branch"></i> Kernel</span>
                <span class="info-item-value">${data.kernel || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-server"></i> Hostname</span>
                <span class="info-item-value">${data.hostname || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-clock"></i> Çalışma Süresi</span>
                <span class="info-item-value">${data.uptime || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-microchip"></i> İşlemci</span>
                <span class="info-item-value">${data.cpu_model || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-cube"></i> Çekirdek/Thread</span>
                <span class="info-item-value">${data.cpu_cores || '?'}C / ${data.cpu_threads || '?'}T</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-tachometer-alt"></i> CPU Frekansı</span>
                <span class="info-item-value">${data.cpu_freq || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-thermometer-half"></i> CPU Sıcaklığı</span>
                <span class="info-item-value">${data.cpu_temp || 'Okunamadı'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-tv"></i> Ekran Kartı</span>
                <span class="info-item-value">${data.gpu || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-memory"></i> Toplam RAM</span>
                <span class="info-item-value">${data.ram_total || 'Bilinmiyor'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-exchange-alt"></i> Swap</span>
                <span class="info-item-value">${data.swap_total || 'Bilinmiyor'}</span>
            </div>
        `;

        // Ağ bilgileri
        const networkInfoList = document.getElementById('network-info-list');
        let networkHtml = '';
        if (data.network && data.network.length > 0) {
            data.network.forEach(iface => {
                if (iface.ipv4) {
                    networkHtml += `
                        <div class="info-item">
                            <span class="info-item-label"><i class="fas fa-ethernet"></i> ${iface.name}</span>
                            <span class="info-item-value">${iface.ipv4}</span>
                        </div>
                    `;
                }
            });
        }
        networkHtml += `
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-upload"></i> Gönderilen</span>
                <span class="info-item-value">${data.net_sent || '0 B'}</span>
            </div>
            <div class="info-item">
                <span class="info-item-label"><i class="fas fa-download"></i> Alınan</span>
                <span class="info-item-value">${data.net_recv || '0 B'}</span>
            </div>
        `;
        networkInfoList.innerHTML = networkHtml;

        // Disk bölümleri
        const diskPartitions = document.getElementById('disk-partitions');
        if (data.disks && data.disks.length > 0) {
            diskPartitions.innerHTML = data.disks.map(disk => `
                <div class="disk-partition">
                    <div class="disk-partition-header">
                        <span class="disk-partition-name">
                            <i class="fas fa-hdd"></i>
                            ${disk.device}
                        </span>
                        <span class="disk-partition-info">${disk.mountpoint} (${disk.fstype})</span>
                    </div>
                    <div class="disk-partition-bar">
                        <div class="disk-partition-bar-fill" style="width: ${disk.percent}%"></div>
                    </div>
                    <div class="disk-partition-stats">
                        <span>Kullanılan: ${disk.used}</span>
                        <span>Boş: ${disk.free}</span>
                        <span>Toplam: ${disk.total}</span>
                        <span class="disk-percent">%${disk.percent}</span>
                    </div>
                </div>
            `).join('');

            // Ana disk kullanımını güncelle
            const rootDisk = data.disks.find(d => d.mountpoint === '/');
            if (rootDisk) {
                updateStatCard('disk', rootDisk.percent);
            }
        }

        // Bellek kullanımını güncelle
        updateStatCard('memory', data.ram_percent);

        // CPU kullanımını güncelle
        updateStatCard('cpu', data.cpu_usage);

        // Pil durumunu güncelle
        if (data.battery_percent !== null) {
            updateStatCard('battery', data.battery_percent);
            updateBatteryIcon(data.battery_percent, data.battery_plugged);
        } else {
            document.getElementById('battery-usage').textContent = 'Yok';
        }

    } catch (error) {
        console.error('Dashboard yükleme hatası:', error);
        showToast('error', 'Hata', 'Dashboard verileri yüklenemedi');
    }
}

function updateStatCard(type, percent) {
    const value = document.getElementById(`${type}-usage`);
    const bar = document.getElementById(`${type}-bar`);

    if (value) value.textContent = `${Math.round(percent)}%`;
    if (bar) bar.style.width = `${percent}%`;

    // Yüksek kullanımda renk değiştir
    if (bar && percent > 80) {
        bar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
    }
}

// ======================= GERÇEK ZAMANLI İSTATİSTİKLER =======================
function startRealtimeStats() {
    statsInterval = setInterval(() => {
        if (socket && isConnected) {
            socket.emit('get_realtime_stats');
        }
    }, 1500);
}

function stopRealtimeStats() {
    if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
    }
}

function updateRealtimeStats(data) {
    // CPU
    updateStatCard('cpu', data.cpu_percent);

    // CPU Çekirdekleri
    if (data.cpu_per_core) {
        const coresContainer = document.getElementById('cpu-cores');
        if (coresContainer) {
            coresContainer.innerHTML = data.cpu_per_core.map((usage, i) => `
                <div class="cpu-core">
                    <div class="cpu-core-header">
                        <span class="cpu-core-label">Çekirdek ${i}</span>
                        <span class="cpu-core-value">${Math.round(usage)}%</span>
                    </div>
                    <div class="cpu-core-bar">
                        <div class="cpu-core-bar-fill" style="width: ${usage}%"></div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Bellek
    updateStatCard('memory', data.memory_percent);

    // Pil
    if (data.battery) {
        updateStatCard('battery', data.battery.percent);
        updateBatteryIcon(data.battery.percent, data.battery.plugged);
    }

    // Grafikleri güncelle (performans bölümü aktifse)
    if (data.history && chartsInitialized) {
        const history = data.history;
        if (history.timestamps && history.timestamps.length > 0) {
            const labels = history.timestamps;

            if (cpuChart) {
                cpuChart.data.labels = labels;
                cpuChart.data.datasets[0].data = history.cpu || [];
                cpuChart.update('none');
            }

            if (memoryChart) {
                memoryChart.data.labels = labels;
                memoryChart.data.datasets[0].data = history.memory || [];
                memoryChart.update('none');
            }

            if (diskIOChart) {
                diskIOChart.data.labels = labels;
                diskIOChart.data.datasets[0].data = history.disk_read || [];
                diskIOChart.data.datasets[1].data = history.disk_write || [];
                diskIOChart.update('none');
            }

            if (networkChart) {
                networkChart.data.labels = labels;
                networkChart.data.datasets[0].data = history.net_recv || [];
                networkChart.data.datasets[1].data = history.net_sent || [];
                networkChart.update('none');
            }

            // Anlık hız istatistiklerini güncelle
            const lastIndex = labels.length - 1;
            if (lastIndex >= 0) {
                const diskReadEl = document.getElementById('disk-read-speed');
                const diskWriteEl = document.getElementById('disk-write-speed');
                const netDownloadEl = document.getElementById('net-download-speed');
                const netUploadEl = document.getElementById('net-upload-speed');

                if (diskReadEl) diskReadEl.textContent = formatSpeedMB(history.disk_read[lastIndex] || 0);
                if (diskWriteEl) diskWriteEl.textContent = formatSpeedMB(history.disk_write[lastIndex] || 0);
                if (netDownloadEl) netDownloadEl.textContent = formatSpeedMB(history.net_recv[lastIndex] || 0);
                if (netUploadEl) netUploadEl.textContent = formatSpeedMB(history.net_sent[lastIndex] || 0);
            }
        }
    }
}

function updateBatteryIcon(percent, plugged) {
    const icon = document.getElementById('battery-icon');
    if (!icon) return;

    if (plugged) {
        icon.className = 'fas fa-plug';
    } else if (percent > 75) {
        icon.className = 'fas fa-battery-full';
    } else if (percent > 50) {
        icon.className = 'fas fa-battery-three-quarters';
    } else if (percent > 25) {
        icon.className = 'fas fa-battery-half';
    } else if (percent > 10) {
        icon.className = 'fas fa-battery-quarter';
    } else {
        icon.className = 'fas fa-battery-empty';
    }
}

// ======================= CHART.JS GRAFİKLERİ =======================
function initCharts() {
    if (chartsInitialized) return;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 300
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#9ca3af',
                    callback: value => value + '%'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9ca3af',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#9ca3af',
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#9ca3af',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // CPU Chart
    const cpuCtx = document.getElementById('cpu-chart');
    if (cpuCtx) {
        cpuChart = new Chart(cpuCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'CPU Kullanımı',
                    data: [],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: chartOptions
        });
    }

    // Memory Chart
    const memCtx = document.getElementById('memory-chart');
    if (memCtx) {
        memoryChart = new Chart(memCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Bellek Kullanımı',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: chartOptions
        });
    }

    // Disk I/O Chart
    const diskCtx = document.getElementById('disk-io-chart');
    if (diskCtx) {
        const diskOptions = { ...chartOptions };
        diskOptions.scales.y.max = undefined;
        diskOptions.scales.y.ticks = {
            color: '#9ca3af',
            callback: value => formatSpeedMB(value)
        };

        diskIOChart = new Chart(diskCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Okuma',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Yazma',
                        data: [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: diskOptions
        });
    }

    // Network Chart
    const netCtx = document.getElementById('network-chart');
    if (netCtx) {
        const netOptions = { ...chartOptions };
        netOptions.scales.y.max = undefined;
        netOptions.scales.y.ticks = {
            color: '#9ca3af',
            callback: value => formatSpeedMB(value)
        };

        networkChart = new Chart(netCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'İndirme',
                        data: [],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Yükleme',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    }
                ]
            },
            options: netOptions
        });
    }

    chartsInitialized = true;

    // Performans geçmişini yükle
    loadPerformanceHistory();
}

async function loadPerformanceHistory() {
    try {
        const response = await fetch('/api/performance-history');
        const data = await response.json();

        // API doğrudan timestamps, cpu, memory, disk_read, disk_write, net_sent, net_recv dizileri döndürüyor
        if (data.timestamps && data.timestamps.length > 0) {
            const labels = data.timestamps;
            const cpuData = data.cpu || [];
            const memData = data.memory || [];
            const diskRead = data.disk_read || [];
            const diskWrite = data.disk_write || [];
            const netRecv = data.net_recv || [];
            const netSent = data.net_sent || [];

            // Grafikleri güncelle
            if (cpuChart) {
                cpuChart.data.labels = labels;
                cpuChart.data.datasets[0].data = cpuData;
                cpuChart.update('none');
            }

            if (memoryChart) {
                memoryChart.data.labels = labels;
                memoryChart.data.datasets[0].data = memData;
                memoryChart.update('none');
            }

            if (diskIOChart) {
                diskIOChart.data.labels = labels;
                diskIOChart.data.datasets[0].data = diskRead;
                diskIOChart.data.datasets[1].data = diskWrite;
                diskIOChart.update('none');
            }

            if (networkChart) {
                networkChart.data.labels = labels;
                networkChart.data.datasets[0].data = netRecv;
                networkChart.data.datasets[1].data = netSent;
                networkChart.update('none');
            }

            // Anlık hız istatistiklerini güncelle (son değerleri al)
            const lastIndex = data.timestamps.length - 1;
            if (lastIndex >= 0) {
                const diskReadEl = document.getElementById('disk-read-speed');
                const diskWriteEl = document.getElementById('disk-write-speed');
                const netDownloadEl = document.getElementById('net-download-speed');
                const netUploadEl = document.getElementById('net-upload-speed');

                if (diskReadEl) diskReadEl.textContent = formatSpeedMB(diskRead[lastIndex] || 0);
                if (diskWriteEl) diskWriteEl.textContent = formatSpeedMB(diskWrite[lastIndex] || 0);
                if (netDownloadEl) netDownloadEl.textContent = formatSpeedMB(netRecv[lastIndex] || 0);
                if (netUploadEl) netUploadEl.textContent = formatSpeedMB(netSent[lastIndex] || 0);
            }
        }
    } catch (error) {
        console.error('Performans geçmişi yükleme hatası:', error);
    }
}

function formatSpeed(bytesPerSec) {
    if (bytesPerSec === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
    return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Backend MB/s olarak gönderiyor, bu fonksiyon MB/s değerlerini formatlar
function formatSpeedMB(mbPerSec) {
    if (!mbPerSec || mbPerSec === 0) return '0 B/s';
    if (mbPerSec < 0.001) return '0 B/s';
    if (mbPerSec < 1) {
        const kbPerSec = mbPerSec * 1024;
        if (kbPerSec < 1) {
            return (kbPerSec * 1024).toFixed(1) + ' B/s';
        }
        return kbPerSec.toFixed(2) + ' KB/s';
    }
    if (mbPerSec >= 1024) {
        return (mbPerSec / 1024).toFixed(2) + ' GB/s';
    }
    return mbPerSec.toFixed(2) + ' MB/s';
}

// Grafikleri periyodik güncelle
setInterval(() => {
    if (isConnected && chartsInitialized && document.getElementById('performance-section').classList.contains('active')) {
        loadPerformanceHistory();
    }
}, 2000);

// ======================= LOG GÖRÜNTÜLEYİCİ =======================
document.getElementById('load-logs-btn').addEventListener('click', loadLogs);
document.getElementById('refresh-logs-btn').addEventListener('click', loadLogs);

async function loadLogs() {
    const logType = document.getElementById('log-type').value;
    const lines = document.getElementById('log-lines').value;
    const filter = document.getElementById('log-filter').value;

    const logViewer = document.getElementById('log-viewer');
    const logInfo = document.getElementById('log-info');

    logViewer.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i><span>Loglar yükleniyor...</span></div>';

    try {
        const params = new URLSearchParams({ type: logType, lines, filter });
        const response = await fetch(`/api/logs?${params}`);
        const data = await response.json();

        if (data.success) {
            if (data.lines && data.lines.length > 0) {
                logViewer.innerHTML = data.lines.map(line => {
                    let lineClass = '';
                    const lowerLine = line.toLowerCase();
                    if (lowerLine.includes('error') || lowerLine.includes('failed') || lowerLine.includes('hata')) {
                        lineClass = 'log-error';
                    } else if (lowerLine.includes('warning') || lowerLine.includes('warn') || lowerLine.includes('uyarı')) {
                        lineClass = 'log-warning';
                    } else if (lowerLine.includes('success') || lowerLine.includes('başarı')) {
                        lineClass = 'log-success';
                    }
                    return `<div class="log-line ${lineClass}">${escapeHtml(line)}</div>`;
                }).join('');
                logInfo.textContent = `${data.lines.length} satır yüklendi - ${data.source || logType}`;
            } else {
                logViewer.innerHTML = '<div class="log-placeholder"><i class="fas fa-file-alt"></i><p>Bu kriterlere uygun log bulunamadı.</p></div>';
                logInfo.textContent = 'Log bulunamadı';
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Log yükleme hatası:', error);
        logViewer.innerHTML = `<div class="log-placeholder error"><i class="fas fa-exclamation-triangle"></i><p>Log yüklenirken hata oluştu: ${error.message}</p></div>`;
        logInfo.textContent = 'Hata';
        showToast('error', 'Hata', 'Loglar yüklenemedi');
    }
}

// Log kopyala
document.getElementById('copy-logs-btn').addEventListener('click', () => {
    const logViewer = document.getElementById('log-viewer');
    const text = logViewer.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Kopyalandı', 'Log içeriği panoya kopyalandı');
    }).catch(() => {
        showToast('error', 'Hata', 'Kopyalama başarısız');
    });
});

// Log indir
document.getElementById('download-logs-btn').addEventListener('click', () => {
    const logViewer = document.getElementById('log-viewer');
    const text = logViewer.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-log-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'İndirildi', 'Log dosyası indirildi');
});

// ======================= ZAMANLANMIŞ GÖREVLER =======================
async function loadScheduledTasks() {
    const container = document.getElementById('scheduled-tasks-list');
    if (!container) return;

    try {
        const response = await fetch('/api/scheduled-tasks');
        const data = await response.json();

        // API doğrudan dizi döndürüyor
        const tasks = Array.isArray(data) ? data : (data.tasks || []);

        if (tasks.length > 0) {
            container.innerHTML = tasks.map(task => `
                <div class="scheduled-task-item">
                    <div class="task-info">
                        <div class="task-name">
                            <i class="fas ${task.type === 'systemd_timer' ? 'fa-clock' : 'fa-calendar'}"></i>
                            ${escapeHtml(task.name || task.schedule || 'Görev')}
                        </div>
                        <div class="task-schedule">
                            <i class="fas fa-tag"></i>
                            ${escapeHtml(task.type || 'cron')}
                            ${task.next ? `<span class="task-next">Sonraki: ${escapeHtml(task.next)}</span>` : ''}
                        </div>
                    </div>
                    ${task.editable ? `
                        <button class="delete-task-btn" onclick="deleteScheduledTask('${escapeHtml(task.schedule)}')" title="Görevi Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-xmark"></i>
                    <p>Henüz zamanlanmış görev yok</p>
                    <span>Yukarıdaki formu kullanarak yeni bir görev ekleyin</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Zamanlanmış görevler yükleme hatası:', error);
        container.innerHTML = '<div class="empty-state error"><i class="fas fa-exclamation-triangle"></i><p>Görevler yüklenemedi</p></div>';
    }
}

function getOperationIcon(operation) {
    const icons = {
        'full_maintenance': 'fa-magic',
        'clean_apt': 'fa-box-archive',
        'clean_journal': 'fa-file-lines',
        'clean_tmp': 'fa-folder-minus',
        'clean_trash': 'fa-trash-can',
        'optimize_memory': 'fa-memory'
    };
    return icons[operation] || 'fa-cog';
}

function getOperationName(operation) {
    const names = {
        'full_maintenance': 'Tam Bakım',
        'clean_apt': 'APT Temizliği',
        'clean_journal': 'Log Temizliği',
        'clean_tmp': 'Tmp Temizliği',
        'clean_trash': 'Çöp Boşaltma',
        'optimize_memory': 'Bellek Optimizasyonu'
    };
    return names[operation] || operation;
}

document.getElementById('add-schedule-btn').addEventListener('click', async () => {
    const operation = document.getElementById('schedule-operation').value;
    const frequency = document.getElementById('schedule-frequency').value;
    const time = document.getElementById('schedule-time').value;

    try {
        const response = await fetch('/api/scheduled-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation, frequency, time })
        });

        const data = await response.json();

        if (data.success) {
            showToast('success', 'Görev Eklendi', 'Zamanlanmış görev başarıyla oluşturuldu');
            loadScheduledTasks();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Görev ekleme hatası:', error);
        showToast('error', 'Hata', error.message || 'Görev eklenemedi');
    }
});

async function deleteScheduledTask(taskId) {
    if (!confirm('Bu zamanlanmış görevi silmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`/api/scheduled-tasks/${taskId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showToast('success', 'Görev Silindi', 'Zamanlanmış görev kaldırıldı');
            loadScheduledTasks();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Görev silme hatası:', error);
        showToast('error', 'Hata', error.message || 'Görev silinemedi');
    }
}

// ======================= SİSTEM OPTİMİZASYONU =======================
async function loadSystemTweaks() {
    try {
        const response = await fetch('/api/system-tweaks');
        const data = await response.json();

        // API { current: {...}, presets: {...} } formatında döndürüyor
        if (data.current) {
            const current = data.current;
            // Mevcut değerleri güncelle
            const swappinessEl = document.getElementById('current-swappiness');
            const swappinessSlider = document.getElementById('swappiness-slider');
            const swappinessValue = document.getElementById('swappiness-value');

            if (swappinessEl) swappinessEl.textContent = current.swappiness;
            if (swappinessSlider) swappinessSlider.value = current.swappiness;
            if (swappinessValue) swappinessValue.textContent = current.swappiness;

            const vfsEl = document.getElementById('current-vfs');
            const vfsSlider = document.getElementById('vfs-slider');
            const vfsValue = document.getElementById('vfs-value');

            if (vfsEl) vfsEl.textContent = current.vfs_cache_pressure;
            if (vfsSlider) vfsSlider.value = current.vfs_cache_pressure;
            if (vfsValue) vfsValue.textContent = current.vfs_cache_pressure;

            const dirtyEl = document.getElementById('current-dirty');
            const dirtySlider = document.getElementById('dirty-slider');
            const dirtyValue = document.getElementById('dirty-value');

            if (dirtyEl) dirtyEl.textContent = current.dirty_ratio;
            if (dirtySlider) dirtySlider.value = current.dirty_ratio;
            if (dirtyValue) dirtyValue.textContent = current.dirty_ratio;

            const schedulerEl = document.getElementById('current-scheduler');
            if (schedulerEl) schedulerEl.textContent = current.io_scheduler || 'Bilinmiyor';
        }
    } catch (error) {
        console.error('Sistem tweaks yükleme hatası:', error);
    }
}

// Slider değer güncellemeleri
const swappinessSliderEl = document.getElementById('swappiness-slider');
if (swappinessSliderEl) {
    swappinessSliderEl.addEventListener('input', (e) => {
        const valueEl = document.getElementById('swappiness-value');
        if (valueEl) valueEl.textContent = e.target.value;
    });
}

const vfsSliderEl = document.getElementById('vfs-slider');
if (vfsSliderEl) {
    vfsSliderEl.addEventListener('input', (e) => {
        const valueEl = document.getElementById('vfs-value');
        if (valueEl) valueEl.textContent = e.target.value;
    });
}

const dirtySliderEl = document.getElementById('dirty-slider');
if (dirtySliderEl) {
    dirtySliderEl.addEventListener('input', (e) => {
        const valueEl = document.getElementById('dirty-value');
        if (valueEl) valueEl.textContent = e.target.value;
    });
}

// Tweak uygula
document.querySelectorAll('.apply-tweak-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const tweak = btn.dataset.tweak;
        let value;

        if (tweak === 'swappiness') {
            value = document.getElementById('swappiness-slider').value;
        } else if (tweak === 'vfs_cache_pressure') {
            value = document.getElementById('vfs-slider').value;
        } else if (tweak === 'dirty_ratio') {
            value = document.getElementById('dirty-slider').value;
        } else if (tweak === 'io_scheduler') {
            value = document.getElementById('scheduler-select').value;
        }

        try {
            const response = await fetch('/api/apply-tweak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tweak, value })
            });

            const data = await response.json();

            if (data.success) {
                showToast('success', 'Ayar Uygulandı', `${tweak} değeri ${value} olarak ayarlandı`);
                loadSystemTweaks();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Tweak uygulama hatası:', error);
            showToast('error', 'Hata', error.message || 'Ayar uygulanamadı');
        }
    });
});

// Preset uygula
document.querySelectorAll('.preset-card').forEach(card => {
    const btn = card.querySelector('.preset-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            const preset = card.dataset.preset;

            if (!confirm(`"${card.querySelector('h4').textContent}" profilini uygulamak istediğinize emin misiniz?`)) return;

            try {
                const response = await fetch('/api/apply-preset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preset })
                });

                const data = await response.json();

                if (data.success) {
                    showToast('success', 'Profil Uygulandı', `${card.querySelector('h4').textContent} profili başarıyla uygulandı`);
                    loadSystemTweaks();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Preset uygulama hatası:', error);
                showToast('error', 'Hata', error.message || 'Profil uygulanamadı');
            }
        });
    }
});

// ======================= MASAÜSTÜ BİLDİRİMLERİ =======================
document.getElementById('notification-toggle').addEventListener('click', async () => {
    notificationsEnabled = !notificationsEnabled;
    const toggle = document.getElementById('notification-toggle');
    const status = toggle.querySelector('.toggle-status');

    if (notificationsEnabled) {
        toggle.classList.add('active');
        status.textContent = 'Açık';
        showToast('info', 'Bildirimler Açık', 'Masaüstü bildirimleri etkinleştirildi');
    } else {
        toggle.classList.remove('active');
        status.textContent = 'Kapalı';
        showToast('info', 'Bildirimler Kapalı', 'Masaüstü bildirimleri devre dışı');
    }
});

// ======================= SÜREÇLER =======================
async function loadProcesses() {
    try {
        const response = await fetch('/api/processes');
        const processes = await response.json();

        const tbody = document.getElementById('processes-table');
        tbody.innerHTML = processes.map(proc => `
            <tr>
                <td>${proc.pid}</td>
                <td>${escapeHtml(proc.name)}</td>
                <td>${escapeHtml(proc.user)}</td>
                <td>${proc.cpu}%</td>
                <td>${proc.memory}%</td>
                <td><span class="status-badge ${proc.status}">${getStatusText(proc.status)}</span></td>
                <td>
                    <button class="kill-btn" onclick="killProcess(${proc.pid}, '${escapeHtml(proc.name)}')">
                        <i class="fas fa-times"></i> Sonlandır
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Süreç listesi yükleme hatası:', error);
        showToast('error', 'Hata', 'Süreç listesi yüklenemedi');
    }
}

function getStatusText(status) {
    const statusMap = {
        'running': 'Çalışıyor',
        'sleeping': 'Uyuyor',
        'stopped': 'Durdu',
        'zombie': 'Zombie',
        'idle': 'Boşta'
    };
    return statusMap[status] || status;
}

async function killProcess(pid, name) {
    if (confirm(`"${name}" (PID: ${pid}) sürecini sonlandırmak istediğinize emin misiniz?`)) {
        try {
            const response = await fetch(`/api/kill-process/${pid}`, { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                showToast('success', 'Başarılı', `${name} süreci sonlandırıldı`);
                loadProcesses();
            } else {
                showToast('error', 'Hata', 'Süreç sonlandırılamadı');
            }
        } catch (error) {
            showToast('error', 'Hata', error.message);
        }
    }
}

// Süreç arama
document.getElementById('process-search').addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#processes-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
});

document.getElementById('refresh-processes').addEventListener('click', () => {
    loadProcesses();
    showToast('info', 'Yenilendi', 'Süreç listesi güncellendi');
});

// ======================= SERVİSLER =======================
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();

        const grid = document.getElementById('services-grid');
        grid.innerHTML = services.map(service => `
            <div class="service-card">
                <div class="service-info">
                    <div class="service-status ${service.active ? 'active' : 'inactive'}"></div>
                    <span class="service-name">${service.name}</span>
                </div>
                <button class="service-action" onclick="restartService('${service.name}')">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Servis listesi yükleme hatası:', error);
        showToast('error', 'Hata', 'Servis listesi yüklenemedi');
    }
}

async function restartService(name) {
    if (confirm(`"${name}" servisini yeniden başlatmak istediğinize emin misiniz?`)) {
        try {
            const response = await fetch(`/api/restart-service/${name}`, { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                showToast('success', 'Başarılı', `${name} servisi yeniden başlatıldı`);
                loadServices();
            } else {
                showToast('error', 'Hata', 'Servis yeniden başlatılamadı');
            }
        } catch (error) {
            showToast('error', 'Hata', error.message);
        }
    }
}

document.getElementById('refresh-services').addEventListener('click', () => {
    loadServices();
    showToast('info', 'Yenilendi', 'Servis listesi güncellendi');
});

// ======================= PAKETLER =======================
async function loadPackages() {
    try {
        const response = await fetch('/api/packages');
        const packages = await response.json();

        const tbody = document.getElementById('packages-table');
        tbody.innerHTML = packages.map(pkg => `
            <tr>
                <td>${escapeHtml(pkg.name)}</td>
                <td>${escapeHtml(pkg.version)}</td>
                <td>${pkg.size}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Paket listesi yükleme hatası:', error);
        showToast('error', 'Hata', 'Paket listesi yüklenemedi');
    }
}

// Paket arama
document.getElementById('package-search').addEventListener('input', (e) => {
    const filter = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#packages-table tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
});

document.getElementById('refresh-packages').addEventListener('click', () => {
    loadPackages();
    showToast('info', 'Yenilendi', 'Paket listesi güncellendi');
});

// ======================= İŞLEM KARTLARI =======================
document.querySelectorAll('.action-card').forEach(card => {
    const btn = card.querySelector('.action-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            const operation = card.dataset.operation;
            if (operation) {
                runOperation(operation, btn);
            }
        });
    }
});

function runOperation(operation, buttonElement) {
    const operationId = Date.now().toString();
    const operationNames = {
        'full_maintenance': 'Tam Bakım',
        'clean_apt': 'APT Temizliği',
        'clean_kernels': 'Eski Kernel Temizliği',
        'clean_journal': 'Log Temizliği',
        'clean_tmp': 'Geçici Dosya Temizliği',
        'clean_trash': 'Çöp Kutusu Boşaltma',
        'optimize_memory': 'Bellek Optimizasyonu',
        'fix_packages': 'Paket Onarımı',
        'update_system': 'Güncelleme Kontrolü',
        'full_upgrade': 'Tam Güncelleme',
        'check_disk': 'Disk Sağlık Kontrolü',
        'analyze_disk': 'Disk Analizi',
        'check_security': 'Güvenlik Taraması'
    };

    // Butonu devre dışı bırak ve animasyon ekle
    if (buttonElement) {
        buttonElement.classList.add('running');
        buttonElement.disabled = true;
        currentOperation = buttonElement;
    }

    // Tüm butonları devre dışı bırak
    disableAllButtons();

    // Bildirim göster
    const opName = operationNames[operation] || operation;
    showToast('info', t('operation_started'), opName + ' ' + t('starting') + '...');

    // İşlemi başlat
    socket.emit('run_operation', { operation, id: operationId });
}

function disableAllButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        if (!btn.classList.contains('running')) {
            btn.disabled = true;
        }
    });
}

function enableAllButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('running');
    });
    currentOperation = null;
}

// ======================= YARDIMCI FONKSİYONLAR =======================
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ======================= BAŞLANGIÇ =======================
document.addEventListener('DOMContentLoaded', () => {
    // Sayfa yüklendiğinde giriş ekranı aktif
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');

    // Dil ayarını uygula
    const savedLang = localStorage.getItem('language') || 'tr';
    document.getElementById('current-lang').textContent = savedLang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === savedLang) {
            opt.classList.add('active');
        }
    });
    updateTranslations();

    // Enter tuşu ile giriş
    document.getElementById('sudo-password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('login-form').dispatchEvent(new Event('submit'));
        }
    });
});

// Sayfa kapanırken bağlantıyı kes
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.disconnect();
    }
});
