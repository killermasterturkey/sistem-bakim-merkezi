#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistem Bakım Merkezi - Kapsamlı Linux Sistem Bakım Aracı
Versiyon: 1.1.0
Lisans: MIT
Geliştirici: Killer Master TURKEY (killermasterturkey@gmail.com)
GitHub: https://github.com/killermasterturkey/sistem-bakim-merkezi
"""

import os
import sys
import json
import subprocess
import threading
import time
import re
import psutil
import shutil
from datetime import datetime, timedelta
from collections import deque
from flask import Flask, render_template, jsonify, request, Response
from flask_socketio import SocketIO, emit
import queue

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24).hex()
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global değişkenler
sudo_password = None
is_authenticated = False
operation_queue = queue.Queue()
active_operations = {}

# Performans geçmişi (son 60 veri noktası - yaklaşık 1.5 dakika)
MAX_HISTORY = 60
performance_history = {
    'cpu': deque(maxlen=MAX_HISTORY),
    'memory': deque(maxlen=MAX_HISTORY),
    'disk_read': deque(maxlen=MAX_HISTORY),
    'disk_write': deque(maxlen=MAX_HISTORY),
    'net_sent': deque(maxlen=MAX_HISTORY),
    'net_recv': deque(maxlen=MAX_HISTORY),
    'timestamps': deque(maxlen=MAX_HISTORY)
}

# Son disk/ağ değerleri (delta hesaplama için)
last_disk_io = None
last_net_io = None
last_io_time = None

# ======================= YARDIMCI FONKSİYONLAR =======================

def run_command(cmd, use_sudo=False, stream_output=False, operation_id=None):
    """Komut çalıştır ve çıktıyı döndür"""
    try:
        if use_sudo and sudo_password:
            cmd = f"echo '{sudo_password}' | sudo -S {cmd}"

        if stream_output and operation_id:
            process = subprocess.Popen(
                cmd, shell=True, stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT, text=True, bufsize=1
            )
            output_lines = []
            for line in iter(process.stdout.readline, ''):
                output_lines.append(line.strip())
                socketio.emit('operation_output', {
                    'id': operation_id,
                    'line': line.strip(),
                    'timestamp': datetime.now().strftime('%H:%M:%S')
                })
            process.wait()
            return '\n'.join(output_lines), process.returncode == 0
        else:
            result = subprocess.run(
                cmd, shell=True, capture_output=True, text=True, timeout=300
            )
            output = result.stdout + result.stderr
            if sudo_password:
                output = output.replace(sudo_password, '***')
            return output.strip(), result.returncode == 0
    except subprocess.TimeoutExpired:
        return "Komut zaman aşımına uğradı", False
    except Exception as e:
        return str(e), False

def get_size_format(bytes_size):
    """Baytı okunabilir formata çevir"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_size < 1024:
            return f"{bytes_size:.2f} {unit}"
        bytes_size /= 1024
    return f"{bytes_size:.2f} PB"

def send_desktop_notification(title, message, urgency="normal"):
    """Desktop bildirimi gönder"""
    try:
        subprocess.run([
            'notify-send',
            '-u', urgency,
            '-i', 'system-software-update',
            '-a', 'Sistem Bakım Merkezi',
            title,
            message
        ], check=False)
        return True
    except:
        return False

# ======================= SİSTEM BİLGİLERİ =======================

def get_system_info():
    """Kapsamlı sistem bilgilerini topla"""
    info = {}

    # İşletim Sistemi
    try:
        with open('/etc/os-release') as f:
            os_info = dict(line.strip().split('=', 1) for line in f if '=' in line)
            info['os_name'] = os_info.get('PRETTY_NAME', '').strip('"')
            info['os_id'] = os_info.get('ID', '').strip('"')
    except:
        info['os_name'] = 'Bilinmiyor'

    # Kernel
    info['kernel'] = os.uname().release
    info['hostname'] = os.uname().nodename
    info['architecture'] = os.uname().machine

    # Uptime
    try:
        uptime_seconds = time.time() - psutil.boot_time()
        days = int(uptime_seconds // 86400)
        hours = int((uptime_seconds % 86400) // 3600)
        minutes = int((uptime_seconds % 3600) // 60)
        info['uptime'] = f"{days} gün, {hours} saat, {minutes} dakika"
        info['boot_time'] = datetime.fromtimestamp(psutil.boot_time()).strftime('%d.%m.%Y %H:%M')
    except:
        info['uptime'] = 'Bilinmiyor'

    # CPU Bilgileri
    try:
        cpu_info = {}
        with open('/proc/cpuinfo') as f:
            for line in f:
                if ':' in line:
                    key, value = line.split(':', 1)
                    cpu_info[key.strip()] = value.strip()

        info['cpu_model'] = cpu_info.get('model name', 'Bilinmiyor')
        info['cpu_cores'] = psutil.cpu_count(logical=False)
        info['cpu_threads'] = psutil.cpu_count(logical=True)
        info['cpu_freq'] = f"{psutil.cpu_freq().current:.0f} MHz" if psutil.cpu_freq() else 'Bilinmiyor'
        info['cpu_freq_max'] = f"{psutil.cpu_freq().max:.0f} MHz" if psutil.cpu_freq() and psutil.cpu_freq().max else 'Bilinmiyor'
        info['cpu_usage'] = psutil.cpu_percent(interval=1)

        # CPU sıcaklığı
        try:
            temps = psutil.sensors_temperatures()
            if 'coretemp' in temps:
                info['cpu_temp'] = f"{temps['coretemp'][0].current:.1f}°C"
            elif 'k10temp' in temps:
                info['cpu_temp'] = f"{temps['k10temp'][0].current:.1f}°C"
            else:
                info['cpu_temp'] = 'Okunamadı'
        except:
            info['cpu_temp'] = 'Okunamadı'
    except Exception as e:
        info['cpu_model'] = 'Bilinmiyor'

    # Bellek Bilgileri
    try:
        mem = psutil.virtual_memory()
        info['ram_total'] = get_size_format(mem.total)
        info['ram_used'] = get_size_format(mem.used)
        info['ram_free'] = get_size_format(mem.available)
        info['ram_percent'] = mem.percent
        info['ram_total_bytes'] = mem.total
        info['ram_used_bytes'] = mem.used

        swap = psutil.swap_memory()
        info['swap_total'] = get_size_format(swap.total)
        info['swap_used'] = get_size_format(swap.used)
        info['swap_percent'] = swap.percent
    except:
        pass

    # Disk Bilgileri
    try:
        disks = []
        for partition in psutil.disk_partitions():
            if partition.fstype and not partition.mountpoint.startswith('/snap'):
                try:
                    usage = psutil.disk_usage(partition.mountpoint)
                    disks.append({
                        'device': partition.device,
                        'mountpoint': partition.mountpoint,
                        'fstype': partition.fstype,
                        'total': get_size_format(usage.total),
                        'used': get_size_format(usage.used),
                        'free': get_size_format(usage.free),
                        'percent': usage.percent
                    })
                except:
                    pass
        info['disks'] = disks
    except:
        info['disks'] = []

    # Ağ Bilgileri
    try:
        net_info = []
        for iface, addrs in psutil.net_if_addrs().items():
            if iface != 'lo':
                iface_info = {'name': iface, 'addresses': []}
                for addr in addrs:
                    if addr.family.name == 'AF_INET':
                        iface_info['ipv4'] = addr.address
                    elif addr.family.name == 'AF_INET6':
                        iface_info['ipv6'] = addr.address
                if 'ipv4' in iface_info:
                    net_info.append(iface_info)
        info['network'] = net_info

        net_io = psutil.net_io_counters()
        info['net_sent'] = get_size_format(net_io.bytes_sent)
        info['net_recv'] = get_size_format(net_io.bytes_recv)
    except:
        info['network'] = []

    # GPU Bilgileri
    try:
        output, _ = run_command("lspci | grep -i 'vga\\|3d\\|display'")
        if output:
            info['gpu'] = output.split(':')[-1].strip()[:60]
        else:
            info['gpu'] = 'Bilinmiyor'
    except:
        info['gpu'] = 'Bilinmiyor'

    # Pil Durumu
    try:
        battery = psutil.sensors_battery()
        if battery:
            info['battery_percent'] = battery.percent
            info['battery_plugged'] = battery.power_plugged
            if battery.secsleft > 0:
                hours = battery.secsleft // 3600
                minutes = (battery.secsleft % 3600) // 60
                info['battery_time'] = f"{hours}s {minutes}dk"
            else:
                info['battery_time'] = 'Şarjda' if battery.power_plugged else 'Hesaplanıyor'
        else:
            info['battery_percent'] = None
    except:
        info['battery_percent'] = None

    return info

def get_running_processes():
    """Çalışan süreçleri listele"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'username', 'status', 'create_time']):
        try:
            pinfo = proc.info
            processes.append({
                'pid': pinfo['pid'],
                'name': pinfo['name'],
                'cpu': round(pinfo['cpu_percent'] or 0, 1),
                'memory': round(pinfo['memory_percent'] or 0, 1),
                'user': pinfo['username'],
                'status': pinfo['status']
            })
        except:
            pass
    return sorted(processes, key=lambda x: x['cpu'], reverse=True)[:100]

def get_services_status():
    """Servis durumlarını al"""
    services = []
    important_services = [
        'NetworkManager', 'ssh', 'sshd', 'apache2', 'nginx', 'mysql', 'mariadb',
        'postgresql', 'docker', 'cups', 'bluetooth', 'ufw', 'cron', 'rsyslog',
        'systemd-journald', 'gdm', 'lightdm', 'snapd', 'avahi-daemon'
    ]

    for service in important_services:
        output, success = run_command(f"systemctl is-active {service} 2>/dev/null")
        if output and output.strip() in ['active', 'inactive', 'failed']:
            services.append({
                'name': service,
                'status': output.strip(),
                'active': output.strip() == 'active'
            })

    return services

# ======================= PERFORMANS GEÇMİŞİ =======================

def collect_performance_data():
    """Performans verilerini topla"""
    global last_disk_io, last_net_io, last_io_time

    current_time = time.time()

    # CPU ve Memory
    cpu_percent = psutil.cpu_percent(interval=0)
    mem_percent = psutil.virtual_memory().percent

    # Disk I/O (delta hesaplama)
    disk_io = psutil.disk_io_counters()
    disk_read_speed = 0
    disk_write_speed = 0

    if last_disk_io and last_io_time:
        time_delta = current_time - last_io_time
        if time_delta > 0:
            disk_read_speed = (disk_io.read_bytes - last_disk_io.read_bytes) / time_delta
            disk_write_speed = (disk_io.write_bytes - last_disk_io.write_bytes) / time_delta

    last_disk_io = disk_io

    # Network I/O (delta hesaplama)
    net_io = psutil.net_io_counters()
    net_sent_speed = 0
    net_recv_speed = 0

    if last_net_io and last_io_time:
        time_delta = current_time - last_io_time
        if time_delta > 0:
            net_sent_speed = (net_io.bytes_sent - last_net_io.bytes_sent) / time_delta
            net_recv_speed = (net_io.bytes_recv - last_net_io.bytes_recv) / time_delta

    last_net_io = net_io
    last_io_time = current_time

    # Geçmişe ekle
    timestamp = datetime.now().strftime('%H:%M:%S')
    performance_history['cpu'].append(cpu_percent)
    performance_history['memory'].append(mem_percent)
    performance_history['disk_read'].append(disk_read_speed / 1024 / 1024)  # MB/s
    performance_history['disk_write'].append(disk_write_speed / 1024 / 1024)
    performance_history['net_sent'].append(net_sent_speed / 1024 / 1024)
    performance_history['net_recv'].append(net_recv_speed / 1024 / 1024)
    performance_history['timestamps'].append(timestamp)

def get_performance_history():
    """Performans geçmişini döndür"""
    return {
        'cpu': list(performance_history['cpu']),
        'memory': list(performance_history['memory']),
        'disk_read': list(performance_history['disk_read']),
        'disk_write': list(performance_history['disk_write']),
        'net_sent': list(performance_history['net_sent']),
        'net_recv': list(performance_history['net_recv']),
        'timestamps': list(performance_history['timestamps'])
    }

# ======================= LOG YÖNETİMİ =======================

def get_system_logs(log_type='syslog', lines=100, filter_text=''):
    """Sistem loglarını oku"""
    logs = []

    log_files = {
        'syslog': '/var/log/syslog',
        'auth': '/var/log/auth.log',
        'kern': '/var/log/kern.log',
        'dpkg': '/var/log/dpkg.log',
        'boot': '/var/log/boot.log',
        'journal': None  # journalctl kullanılacak
    }

    try:
        if log_type == 'journal':
            cmd = f"journalctl -n {lines} --no-pager"
            if filter_text:
                cmd += f" | grep -i '{filter_text}'"
            output, _ = run_command(cmd, use_sudo=True)
        else:
            log_file = log_files.get(log_type, '/var/log/syslog')
            if os.path.exists(log_file):
                cmd = f"tail -n {lines} {log_file}"
                if filter_text:
                    cmd += f" | grep -i '{filter_text}'"
                output, _ = run_command(cmd, use_sudo=True)
            else:
                output = f"Log dosyası bulunamadı: {log_file}"

        if output:
            for line in output.split('\n'):
                if line.strip():
                    log_entry = {'raw': line}
                    # Log seviyesini belirle
                    line_lower = line.lower()
                    if 'error' in line_lower or 'failed' in line_lower or 'critical' in line_lower:
                        log_entry['level'] = 'error'
                    elif 'warning' in line_lower or 'warn' in line_lower:
                        log_entry['level'] = 'warning'
                    elif 'info' in line_lower:
                        log_entry['level'] = 'info'
                    else:
                        log_entry['level'] = 'default'
                    logs.append(log_entry)
    except Exception as e:
        logs.append({'raw': f'Hata: {str(e)}', 'level': 'error'})

    return logs

# ======================= ZAMANLANMIŞ GÖREVLER =======================

def get_scheduled_tasks():
    """Zamanlanmış görevleri listele"""
    tasks = []

    # Kullanıcı crontab
    try:
        output, success = run_command("crontab -l 2>/dev/null")
        if success and output and 'no crontab' not in output.lower():
            for line in output.split('\n'):
                line = line.strip()
                if line and not line.startswith('#'):
                    tasks.append({
                        'type': 'user_cron',
                        'schedule': line,
                        'editable': True
                    })
    except:
        pass

    # Sistem cron dizinleri
    cron_dirs = [
        ('/etc/cron.d', 'system'),
        ('/etc/cron.daily', 'daily'),
        ('/etc/cron.hourly', 'hourly'),
        ('/etc/cron.weekly', 'weekly'),
        ('/etc/cron.monthly', 'monthly')
    ]

    for cron_dir, cron_type in cron_dirs:
        if os.path.exists(cron_dir):
            try:
                for f in os.listdir(cron_dir):
                    tasks.append({
                        'type': cron_type,
                        'name': f,
                        'path': os.path.join(cron_dir, f),
                        'editable': False
                    })
            except:
                pass

    # Systemd timers
    try:
        output, _ = run_command("systemctl list-timers --no-pager --no-legend 2>/dev/null")
        if output:
            for line in output.split('\n')[:10]:
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 5:
                        tasks.append({
                            'type': 'systemd_timer',
                            'name': parts[-1] if parts else 'Unknown',
                            'next': ' '.join(parts[0:2]) if len(parts) > 2 else 'N/A',
                            'editable': False
                        })
    except:
        pass

    return tasks

def add_scheduled_maintenance(schedule, task_type):
    """Zamanlanmış bakım görevi ekle"""
    script_path = os.path.abspath(__file__)

    cron_commands = {
        'full_maintenance': f"0 3 * * 0 python3 {script_path} --auto-maintenance",
        'apt_clean': f"0 4 * * 0 apt-get clean && apt-get autoclean",
        'journal_clean': f"0 5 1 * * journalctl --vacuum-time=7d",
        'custom': schedule
    }

    if task_type in cron_commands:
        cron_line = cron_commands[task_type]
        # Mevcut crontab'a ekle
        output, _ = run_command("crontab -l 2>/dev/null || echo ''")
        existing = output if output else ""
        if cron_line not in existing:
            new_crontab = existing + "\n" + cron_line + "\n"
            run_command(f'echo "{new_crontab}" | crontab -')
            return True
    return False

# ======================= SİSTEM OPTİMİZASYONU =======================

def get_system_tweaks():
    """Mevcut sistem ayarlarını al"""
    tweaks = {}

    # Swappiness
    try:
        with open('/proc/sys/vm/swappiness') as f:
            tweaks['swappiness'] = int(f.read().strip())
    except:
        tweaks['swappiness'] = 60

    # VFS Cache Pressure
    try:
        with open('/proc/sys/vm/vfs_cache_pressure') as f:
            tweaks['vfs_cache_pressure'] = int(f.read().strip())
    except:
        tweaks['vfs_cache_pressure'] = 100

    # Dirty Ratio
    try:
        with open('/proc/sys/vm/dirty_ratio') as f:
            tweaks['dirty_ratio'] = int(f.read().strip())
    except:
        tweaks['dirty_ratio'] = 20

    # Dirty Background Ratio
    try:
        with open('/proc/sys/vm/dirty_background_ratio') as f:
            tweaks['dirty_background_ratio'] = int(f.read().strip())
    except:
        tweaks['dirty_background_ratio'] = 10

    # I/O Scheduler (ilk disk için)
    try:
        schedulers = []
        for disk in os.listdir('/sys/block'):
            if disk.startswith('sd') or disk.startswith('nvme'):
                sched_path = f'/sys/block/{disk}/queue/scheduler'
                if os.path.exists(sched_path):
                    with open(sched_path) as f:
                        content = f.read().strip()
                        # Aktif scheduler [] içinde
                        current = re.search(r'\[(\w+)\]', content)
                        if current:
                            tweaks['io_scheduler'] = current.group(1)
                            tweaks['io_scheduler_disk'] = disk
                            tweaks['available_schedulers'] = re.findall(r'\w+', content.replace('[', '').replace(']', ''))
                            break
    except:
        tweaks['io_scheduler'] = 'unknown'

    # TCP Congestion Control
    try:
        with open('/proc/sys/net/ipv4/tcp_congestion_control') as f:
            tweaks['tcp_congestion'] = f.read().strip()
    except:
        tweaks['tcp_congestion'] = 'cubic'

    return tweaks

def apply_system_tweak(tweak_name, value):
    """Sistem ayarını uygula"""
    tweak_commands = {
        'swappiness': f"sysctl -w vm.swappiness={value}",
        'vfs_cache_pressure': f"sysctl -w vm.vfs_cache_pressure={value}",
        'dirty_ratio': f"sysctl -w vm.dirty_ratio={value}",
        'dirty_background_ratio': f"sysctl -w vm.dirty_background_ratio={value}",
    }

    if tweak_name == 'io_scheduler':
        disk = value.get('disk', 'sda')
        scheduler = value.get('scheduler', 'mq-deadline')
        cmd = f"echo {scheduler} > /sys/block/{disk}/queue/scheduler"
        output, success = run_command(cmd, use_sudo=True)
        return success

    if tweak_name in tweak_commands:
        output, success = run_command(tweak_commands[tweak_name], use_sudo=True)
        return success

    return False

def get_optimization_presets():
    """Optimizasyon ön ayarları"""
    return {
        'desktop': {
            'name': 'Masaüstü Kullanım',
            'description': 'Günlük masaüstü kullanımı için optimize',
            'swappiness': 60,
            'vfs_cache_pressure': 100,
            'dirty_ratio': 20
        },
        'performance': {
            'name': 'Yüksek Performans',
            'description': 'Maksimum performans için RAM kullanımını artır',
            'swappiness': 10,
            'vfs_cache_pressure': 50,
            'dirty_ratio': 40
        },
        'laptop': {
            'name': 'Dizüstü / Pil Tasarrufu',
            'description': 'Pil ömrünü uzatmak için optimize',
            'swappiness': 80,
            'vfs_cache_pressure': 100,
            'dirty_ratio': 10
        },
        'server': {
            'name': 'Sunucu',
            'description': 'Sunucu workload\'ları için optimize',
            'swappiness': 10,
            'vfs_cache_pressure': 50,
            'dirty_ratio': 80
        }
    }

# ======================= BAKIM İŞLEMLERİ =======================

def clean_apt_cache(operation_id):
    """APT önbelleğini temizle"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'APT önbelleği temizleniyor...'})

    output, _ = run_command("du -sh /var/cache/apt/archives/ 2>/dev/null")
    before_size = output.split()[0] if output else "0"

    run_command("apt-get clean", use_sudo=True, stream_output=True, operation_id=operation_id)
    run_command("apt-get autoclean", use_sudo=True, stream_output=True, operation_id=operation_id)

    send_desktop_notification("APT Temizliği", f"Önbellek temizlendi. Önceki boyut: {before_size}")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'APT önbelleği temizlendi. Önceki boyut: {before_size}'})
    return True

def remove_old_kernels(operation_id):
    """Eski kernelleri kaldır"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Eski kerneller kontrol ediliyor...'})

    current_kernel = os.uname().release
    output, _ = run_command("dpkg -l 'linux-image-*' | grep '^ii' | awk '{print $2}'")

    if output:
        kernels = output.strip().split('\n')
        old_kernels = [k for k in kernels if current_kernel not in k and 'generic' in k]

        if old_kernels:
            for kernel in old_kernels[:3]:
                socketio.emit('operation_output', {'id': operation_id, 'line': f'Kaldırılıyor: {kernel}'})
                run_command(f"apt-get remove --purge -y {kernel}", use_sudo=True)

            run_command("apt-get autoremove -y", use_sudo=True)
            send_desktop_notification("Kernel Temizliği", f"{len(old_kernels)} eski kernel kaldırıldı")
            socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'{len(old_kernels)} eski kernel kaldırıldı'})
        else:
            socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Kaldırılacak eski kernel bulunamadı'})

    return True

def clean_journal_logs(operation_id):
    """Journal loglarını temizle"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Journal logları temizleniyor...'})

    output, _ = run_command("journalctl --disk-usage", use_sudo=True)
    before_size = output if output else "0"

    run_command("journalctl --vacuum-time=3d", use_sudo=True, stream_output=True, operation_id=operation_id)

    output, _ = run_command("journalctl --disk-usage", use_sudo=True)
    after_size = output if output else "0"

    send_desktop_notification("Log Temizliği", f"Önce: {before_size}, Sonra: {after_size}")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'Journal temizlendi. Önce: {before_size}, Sonra: {after_size}'})
    return True

def clean_tmp_files(operation_id):
    """Geçici dosyaları temizle"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Geçici dosyalar temizleniyor...'})

    cleaned = 0

    output, _ = run_command("find /tmp -type f -atime +7 -delete 2>/dev/null && echo 'OK'", use_sudo=True)
    if 'OK' in str(output):
        cleaned += 1

    cache_dirs = [
        '~/.cache/thumbnails',
        '~/.cache/pip',
    ]

    for cache_dir in cache_dirs:
        expanded = os.path.expanduser(cache_dir)
        if os.path.exists(expanded):
            try:
                shutil.rmtree(expanded, ignore_errors=True)
                cleaned += 1
                socketio.emit('operation_output', {'id': operation_id, 'line': f'Temizlendi: {cache_dir}'})
            except:
                pass

    send_desktop_notification("Geçici Dosya Temizliği", f"{cleaned} konum temizlendi")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'Geçici dosyalar temizlendi ({cleaned} konum)'})
    return True

def clean_trash(operation_id):
    """Çöp kutusunu boşalt"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Çöp kutusu boşaltılıyor...'})

    trash_dirs = [
        os.path.expanduser('~/.local/share/Trash/files'),
        os.path.expanduser('~/.local/share/Trash/info')
    ]

    total_freed = 0
    for trash_dir in trash_dirs:
        if os.path.exists(trash_dir):
            try:
                for item in os.listdir(trash_dir):
                    item_path = os.path.join(trash_dir, item)
                    if os.path.isfile(item_path):
                        total_freed += os.path.getsize(item_path)
                        os.remove(item_path)
                    else:
                        shutil.rmtree(item_path, ignore_errors=True)
            except:
                pass

    freed_str = get_size_format(total_freed)
    send_desktop_notification("Çöp Kutusu", f"Boşaltıldı. Kazanılan alan: {freed_str}")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'Çöp kutusu boşaltıldı. Kazanılan alan: {freed_str}'})
    return True

def update_system(operation_id):
    """Sistem güncellemesi"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Paket listesi güncelleniyor...'})

    run_command("apt-get update", use_sudo=True, stream_output=True, operation_id=operation_id)

    socketio.emit('operation_output', {'id': operation_id, 'line': '--- Güncellenebilir paketler kontrol ediliyor ---'})

    output, _ = run_command("apt list --upgradable 2>/dev/null | tail -n +2")

    if output and output.strip():
        packages = output.strip().split('\n')
        socketio.emit('operation_output', {'id': operation_id, 'line': f'{len(packages)} paket güncellenebilir'})
        send_desktop_notification("Güncelleme Kontrolü", f"{len(packages)} güncellenebilir paket bulundu")
        socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'{len(packages)} güncellenebilir paket bulundu.'})
    else:
        send_desktop_notification("Güncelleme Kontrolü", "Sistem güncel!")
        socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Sistem güncel!'})

    return True

def full_upgrade(operation_id):
    """Tam sistem güncellemesi"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Tam güncelleme başlatılıyor...'})

    run_command("apt-get update", use_sudo=True, stream_output=True, operation_id=operation_id)
    run_command("apt-get upgrade -y", use_sudo=True, stream_output=True, operation_id=operation_id)
    run_command("apt-get dist-upgrade -y", use_sudo=True, stream_output=True, operation_id=operation_id)
    run_command("apt-get autoremove -y", use_sudo=True, stream_output=True, operation_id=operation_id)

    send_desktop_notification("Sistem Güncelleme", "Tüm güncellemeler yüklendi!", urgency="normal")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Sistem güncellendi!'})
    return True

def fix_broken_packages(operation_id):
    """Bozuk paketleri onar"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Bozuk paketler onarılıyor...'})

    run_command("dpkg --configure -a", use_sudo=True, stream_output=True, operation_id=operation_id)
    run_command("apt-get install -f -y", use_sudo=True, stream_output=True, operation_id=operation_id)

    send_desktop_notification("Paket Onarımı", "Bozuk paketler onarıldı")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Bozuk paketler onarıldı'})
    return True

def check_disk_health(operation_id):
    """Disk sağlığını kontrol et"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Disk sağlığı kontrol ediliyor...'})

    output, _ = run_command("smartctl -H /dev/sda 2>/dev/null || echo 'SMART kullanılamıyor'", use_sudo=True)
    socketio.emit('operation_output', {'id': operation_id, 'line': f'SMART Durumu: {output}'})

    output, _ = run_command("df -h / | tail -1")
    if output:
        parts = output.split()
        usage = parts[4] if len(parts) > 4 else 'Bilinmiyor'
        socketio.emit('operation_output', {'id': operation_id, 'line': f'Kök dizin kullanımı: {usage}'})

    output, _ = run_command("df -i / | tail -1")
    if output:
        parts = output.split()
        inode_usage = parts[4] if len(parts) > 4 else 'Bilinmiyor'
        socketio.emit('operation_output', {'id': operation_id, 'line': f'inode kullanımı: {inode_usage}'})

    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Disk sağlık kontrolü tamamlandı'})
    return True

def analyze_disk_usage(operation_id):
    """Disk kullanımını analiz et"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Disk kullanımı analiz ediliyor...'})

    output, _ = run_command("du -sh /home/*/ 2>/dev/null | sort -rh | head -10", use_sudo=True)
    if output:
        socketio.emit('operation_output', {'id': operation_id, 'line': '--- En Büyük Kullanıcı Dizinleri ---'})
        for line in output.strip().split('\n'):
            socketio.emit('operation_output', {'id': operation_id, 'line': line})

    output, _ = run_command("find /home -type f -size +100M -exec ls -lh {} \\; 2>/dev/null | sort -k5 -rh | head -10", use_sudo=True)
    if output:
        socketio.emit('operation_output', {'id': operation_id, 'line': '--- 100MB+ Dosyalar ---'})
        for line in output.strip().split('\n'):
            if line:
                parts = line.split()
                if len(parts) >= 9:
                    size = parts[4]
                    path = ' '.join(parts[8:])
                    socketio.emit('operation_output', {'id': operation_id, 'line': f'{size}: {path}'})

    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Disk analizi tamamlandı'})
    return True

def optimize_memory(operation_id):
    """Bellek optimizasyonu"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Bellek optimize ediliyor...'})

    mem_before = psutil.virtual_memory()
    socketio.emit('operation_output', {'id': operation_id, 'line': f'Önce - Kullanılan: {get_size_format(mem_before.used)}, Boş: {get_size_format(mem_before.available)}'})

    run_command("sync && echo 1 > /proc/sys/vm/drop_caches", use_sudo=True)
    time.sleep(1)

    mem_after = psutil.virtual_memory()
    freed = mem_before.used - mem_after.used

    socketio.emit('operation_output', {'id': operation_id, 'line': f'Sonra - Kullanılan: {get_size_format(mem_after.used)}, Boş: {get_size_format(mem_after.available)}'})

    freed_str = get_size_format(max(0, freed))
    send_desktop_notification("Bellek Optimizasyonu", f"Kazanılan: {freed_str}")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'Bellek optimize edildi. Kazanılan: {freed_str}'})
    return True

def check_security(operation_id):
    """Güvenlik kontrolü"""
    socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': 'Güvenlik kontrolleri yapılıyor...'})

    issues = []

    output, _ = run_command("ufw status", use_sudo=True)
    if 'inactive' in output.lower():
        issues.append('Güvenlik duvarı (UFW) kapalı!')
    socketio.emit('operation_output', {'id': operation_id, 'line': f'Güvenlik Duvarı: {output.split(chr(10))[0] if output else "Kontrol edilemedi"}'})

    output, _ = run_command("grep -i 'PermitRootLogin' /etc/ssh/sshd_config 2>/dev/null")
    if output and 'yes' in output.lower():
        issues.append('SSH root login aktif!')

    output, _ = run_command("apt list --upgradable 2>/dev/null | wc -l")
    try:
        upgradable = int(output.strip()) - 1
        if upgradable > 10:
            issues.append(f'{upgradable} paket güncellenmemiş')
        socketio.emit('operation_output', {'id': operation_id, 'line': f'Güncellenebilir paket sayısı: {upgradable}'})
    except:
        pass

    output, _ = run_command("find /usr -perm -4000 -type f 2>/dev/null | wc -l")
    socketio.emit('operation_output', {'id': operation_id, 'line': f'SUID bit ayarlı dosya sayısı: {output.strip()}'})

    output, _ = run_command("grep 'Failed password' /var/log/auth.log 2>/dev/null | wc -l", use_sudo=True)
    if output.strip() and int(output.strip()) > 0:
        socketio.emit('operation_output', {'id': operation_id, 'line': f'Başarısız giriş denemesi: {output.strip()}'})

    if issues:
        socketio.emit('operation_output', {'id': operation_id, 'line': '--- UYARILAR ---'})
        for issue in issues:
            socketio.emit('operation_output', {'id': operation_id, 'line': f'⚠ {issue}'})
        send_desktop_notification("Güvenlik Uyarısı", f"{len(issues)} güvenlik sorunu bulundu!", urgency="critical")

    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': f'Güvenlik kontrolü tamamlandı. {len(issues)} uyarı bulundu.'})
    return True

def get_startup_apps():
    """Başlangıç uygulamalarını listele"""
    apps = []

    output, _ = run_command("systemctl --user list-unit-files --type=service --state=enabled 2>/dev/null")
    if output:
        for line in output.strip().split('\n')[1:]:
            if line and '.service' in line:
                parts = line.split()
                if len(parts) >= 1:
                    apps.append({'name': parts[0], 'type': 'systemd-user', 'enabled': True})

    autostart_dirs = [
        os.path.expanduser('~/.config/autostart'),
        '/etc/xdg/autostart'
    ]

    for dir_path in autostart_dirs:
        if os.path.exists(dir_path):
            for f in os.listdir(dir_path):
                if f.endswith('.desktop'):
                    apps.append({'name': f.replace('.desktop', ''), 'type': 'autostart', 'enabled': True})

    return apps

def get_installed_packages():
    """Yüklü paketleri listele"""
    output, _ = run_command("dpkg-query -W -f='${Package}|${Version}|${Installed-Size}\\n' | head -200")
    packages = []
    if output:
        for line in output.strip().split('\n'):
            parts = line.split('|')
            if len(parts) >= 3:
                packages.append({
                    'name': parts[0],
                    'version': parts[1],
                    'size': f"{int(parts[2])//1024} MB" if parts[2].isdigit() else parts[2]
                })
    return packages

def kill_process(pid):
    """Süreç sonlandır"""
    try:
        run_command(f"kill -15 {pid}", use_sudo=True)
        time.sleep(1)
        if psutil.pid_exists(pid):
            run_command(f"kill -9 {pid}", use_sudo=True)
        return True
    except:
        return False

def restart_service(service_name):
    """Servisi yeniden başlat"""
    output, success = run_command(f"systemctl restart {service_name}", use_sudo=True)
    return success

def toggle_service(service_name, enable):
    """Servisi etkinleştir/devre dışı bırak"""
    action = "enable" if enable else "disable"
    output, success = run_command(f"systemctl {action} {service_name}", use_sudo=True)
    return success

def run_full_maintenance(operation_id):
    """Tam bakım işlemi"""
    steps = [
        ("APT önbelleği temizleniyor...", "apt-get clean && apt-get autoclean"),
        ("Gereksiz paketler kaldırılıyor...", "apt-get autoremove -y"),
        ("Journal logları temizleniyor...", "journalctl --vacuum-time=3d"),
        ("Geçici dosyalar temizleniyor...", "find /tmp -type f -atime +7 -delete 2>/dev/null; true"),
        ("Thumbnail önbelleği temizleniyor...", f"rm -rf {os.path.expanduser('~/.cache/thumbnails/*')}"),
        ("Bellek optimize ediliyor...", "sync && echo 1 > /proc/sys/vm/drop_caches"),
    ]

    total = len(steps)
    for i, (message, cmd) in enumerate(steps, 1):
        socketio.emit('operation_status', {'id': operation_id, 'status': 'running', 'message': f'[{i}/{total}] {message}', 'progress': int(i/total*100)})
        socketio.emit('operation_output', {'id': operation_id, 'line': message})
        run_command(cmd, use_sudo=True)
        time.sleep(0.5)

    send_desktop_notification("Tam Bakım", "Tüm bakım işlemleri tamamlandı!", urgency="normal")
    socketio.emit('operation_status', {'id': operation_id, 'status': 'completed', 'message': 'Tam bakım işlemi tamamlandı!'})
    return True

# ======================= FLASK ROUTES =======================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/auth', methods=['POST'])
def authenticate():
    global sudo_password, is_authenticated
    data = request.json
    password = data.get('password', '')

    result = subprocess.run(
        f"echo '{password}' | sudo -S echo 'OK' 2>&1",
        shell=True, capture_output=True, text=True
    )

    if 'OK' in result.stdout:
        sudo_password = password
        is_authenticated = True
        return jsonify({'success': True, 'message': 'Giriş başarılı'})
    else:
        return jsonify({'success': False, 'message': 'Geçersiz şifre'})

@app.route('/api/logout', methods=['POST'])
def logout():
    global sudo_password, is_authenticated
    sudo_password = None
    is_authenticated = False
    return jsonify({'success': True})

@app.route('/api/system-info')
def api_system_info():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_system_info())

@app.route('/api/processes')
def api_processes():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_running_processes())

@app.route('/api/services')
def api_services():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_services_status())

@app.route('/api/startup-apps')
def api_startup_apps():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_startup_apps())

@app.route('/api/packages')
def api_packages():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_installed_packages())

@app.route('/api/kill-process/<int:pid>', methods=['POST'])
def api_kill_process(pid):
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    success = kill_process(pid)
    return jsonify({'success': success})

@app.route('/api/restart-service/<service_name>', methods=['POST'])
def api_restart_service(service_name):
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    success = restart_service(service_name)
    return jsonify({'success': success})

@app.route('/api/toggle-service/<service_name>', methods=['POST'])
def api_toggle_service(service_name):
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    data = request.json
    enable = data.get('enable', True)
    success = toggle_service(service_name, enable)
    return jsonify({'success': success})

@app.route('/api/performance-history')
def api_performance_history():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_performance_history())

@app.route('/api/logs')
def api_logs():
    if not is_authenticated:
        return jsonify({'success': False, 'message': 'Yetkilendirme gerekli'}), 401
    log_type = request.args.get('type', 'syslog')
    lines = int(request.args.get('lines', 100))
    filter_text = request.args.get('filter', '')

    logs_data = get_system_logs(log_type, lines, filter_text)
    # Frontend'in beklediği formatta döndür
    log_lines = [entry.get('raw', '') for entry in logs_data]

    return jsonify({
        'success': True,
        'lines': log_lines,
        'source': log_type,
        'count': len(log_lines)
    })

@app.route('/api/scheduled-tasks')
def api_scheduled_tasks():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify(get_scheduled_tasks())

@app.route('/api/add-scheduled-task', methods=['POST'])
def api_add_scheduled_task():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    data = request.json
    schedule = data.get('schedule', '')
    task_type = data.get('type', 'custom')
    success = add_scheduled_maintenance(schedule, task_type)
    return jsonify({'success': success})

@app.route('/api/system-tweaks')
def api_system_tweaks():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    return jsonify({
        'current': get_system_tweaks(),
        'presets': get_optimization_presets()
    })

@app.route('/api/apply-tweak', methods=['POST'])
def api_apply_tweak():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    data = request.json
    tweak_name = data.get('name', '')
    value = data.get('value', '')
    success = apply_system_tweak(tweak_name, value)
    return jsonify({'success': success})

@app.route('/api/apply-preset', methods=['POST'])
def api_apply_preset():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    data = request.json
    preset_name = data.get('preset', '')
    presets = get_optimization_presets()

    if preset_name in presets:
        preset = presets[preset_name]
        success = True
        for key in ['swappiness', 'vfs_cache_pressure', 'dirty_ratio']:
            if key in preset:
                if not apply_system_tweak(key, preset[key]):
                    success = False
        send_desktop_notification("Optimizasyon", f"'{preset['name']}' profili uygulandı")
        return jsonify({'success': success})
    return jsonify({'success': False})

@app.route('/api/send-notification', methods=['POST'])
def api_send_notification():
    if not is_authenticated:
        return jsonify({'error': 'Yetkilendirme gerekli'}), 401
    data = request.json
    title = data.get('title', 'Bildirim')
    message = data.get('message', '')
    success = send_desktop_notification(title, message)
    return jsonify({'success': success})

# ======================= SOCKET.IO EVENTS =======================

@socketio.on('connect')
def handle_connect():
    emit('connected', {'status': 'Bağlandı'})

@socketio.on('run_operation')
def handle_operation(data):
    if not is_authenticated:
        emit('operation_status', {'id': 'error', 'status': 'error', 'message': 'Yetkilendirme gerekli'})
        return

    operation = data.get('operation')
    operation_id = data.get('id', str(time.time()))

    operations = {
        'clean_apt': clean_apt_cache,
        'clean_kernels': remove_old_kernels,
        'clean_journal': clean_journal_logs,
        'clean_tmp': clean_tmp_files,
        'clean_trash': clean_trash,
        'update_system': update_system,
        'full_upgrade': full_upgrade,
        'fix_packages': fix_broken_packages,
        'check_disk': check_disk_health,
        'analyze_disk': analyze_disk_usage,
        'optimize_memory': optimize_memory,
        'check_security': check_security,
        'full_maintenance': run_full_maintenance,
    }

    if operation in operations:
        thread = threading.Thread(target=operations[operation], args=(operation_id,))
        thread.daemon = True
        thread.start()
    else:
        emit('operation_status', {'id': operation_id, 'status': 'error', 'message': f'Bilinmeyen işlem: {operation}'})

@socketio.on('get_realtime_stats')
def handle_realtime_stats():
    """Anlık istatistikleri gönder"""
    if not is_authenticated:
        return

    # Performans verilerini topla
    collect_performance_data()

    stats = {
        'cpu_percent': psutil.cpu_percent(interval=0.1),
        'cpu_per_core': psutil.cpu_percent(interval=0.1, percpu=True),
        'memory_percent': psutil.virtual_memory().percent,
        'memory_used': psutil.virtual_memory().used,
        'memory_total': psutil.virtual_memory().total,
        'swap_percent': psutil.swap_memory().percent,
        'disk_io': psutil.disk_io_counters()._asdict() if psutil.disk_io_counters() else {},
        'net_io': psutil.net_io_counters()._asdict(),
        'timestamp': datetime.now().strftime('%H:%M:%S'),
        'history': get_performance_history()
    }

    # Pil durumu
    battery = psutil.sensors_battery()
    if battery:
        stats['battery'] = {
            'percent': battery.percent,
            'plugged': battery.power_plugged
        }

    # CPU sıcaklığı
    try:
        temps = psutil.sensors_temperatures()
        if 'coretemp' in temps:
            stats['cpu_temp'] = temps['coretemp'][0].current
        elif 'k10temp' in temps:
            stats['cpu_temp'] = temps['k10temp'][0].current
    except:
        pass

    emit('realtime_stats', stats)

if __name__ == '__main__':
    print("=" * 60)
    print("  SİSTEM BAKIM MERKEZİ v2.0")
    print("  Linux Sistem Bakım ve Optimizasyon Aracı")
    print("=" * 60)
    print(f"\n  Web arayüzü: http://localhost:5000")
    print("  Çıkış için: Ctrl+C")
    print("=" * 60)

    socketio.run(app, host='0.0.0.0', port=5000, debug=False, allow_unsafe_werkzeug=True)
