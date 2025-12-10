#!/bin/bash
# Sistem Bakım Merkezi Başlatıcı

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=============================================="
echo "     SİSTEM BAKIM MERKEZİ"
echo "=============================================="
echo ""

# Python kontrolü
if ! command -v python3 &> /dev/null; then
    echo "[HATA] Python3 bulunamadı!"
    echo "Kurulum: sudo apt install python3"
    exit 1
fi

# Gerekli modül kontrolü
if ! python3 -c "import flask, flask_socketio, psutil" 2>/dev/null; then
    echo "[HATA] Gerekli Python modülleri eksik!"
    echo ""
    echo "Kurulum için şu komutu çalıştırın:"
    echo "  sudo apt install python3-flask python3-psutil python3-flask-socketio"
    echo ""
    echo "veya pip ile:"
    echo "  pip3 install flask flask-socketio psutil"
    exit 1
fi

echo "[OK] Tüm bağımlılıklar mevcut"
echo ""
echo "Web arayüzü: http://localhost:5000"
echo "Çıkış için:  Ctrl+C"
echo "=============================================="
echo ""

# Tarayıcıyı aç (arka planda)
(sleep 2 && xdg-open "http://localhost:5000" 2>/dev/null) &

# Uygulamayı başlat
python3 app.py
