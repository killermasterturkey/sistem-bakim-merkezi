// ======================= KAPSAMLI DİL ÇEVİRİLERİ =======================
const translations = {
    tr: {
        // Genel
        app_title: 'Sistem Bakım Merkezi',
        login: 'Giriş Yap',
        logout: 'Çıkış',
        sudo_password: 'Sudo Şifresi',
        login_info: 'Yönetici yetkileri için sudo şifrenizi girin',
        connected: 'Bağlı',
        disconnected: 'Bağlantı Kesildi',
        notifications_on: 'Açık',
        notifications_off: 'Kapalı',
        refresh: 'Yenile',
        apply: 'Uygula',
        start: 'Başlat',
        stop: 'Durdur',
        clean: 'Temizle',
        remove: 'Kaldır',
        search: 'Ara',
        loading: 'Yükleniyor...',
        operation_started: 'İşlem Başlatıldı',
        starting: 'başlatılıyor',
        running: 'Çalışıyor',
        completed: 'Tamamlandı',
        error: 'Hata',
        success: 'Başarılı',
        warning: 'Uyarı',
        info: 'Bilgi',
        current: 'Mevcut',

        // Menü
        menu_dashboard: 'Kontrol Paneli',
        menu_performance: 'Performans',
        menu_maintenance: 'Bakım İşlemleri',
        menu_optimization: 'Optimizasyon',
        menu_scheduled: 'Zamanlanmış',
        menu_logs: 'Log Görüntüleyici',
        menu_updates: 'Güncellemeler',
        menu_processes: 'Süreçler',
        menu_services: 'Servisler',
        menu_disk: 'Disk Analizi',
        menu_security: 'Güvenlik',
        menu_packages: 'Paketler',
        new_badge: 'Yeni',

        // Dashboard
        system_status: 'Sistem Durumu',
        cpu_usage: 'CPU Kullanımı',
        memory_usage: 'Bellek Kullanımı',
        disk_usage: 'Disk Kullanımı',
        battery_status: 'Pil Durumu',
        cpu_cores: 'CPU Çekirdekleri',
        system_info: 'Sistem Bilgileri',
        network_info: 'Ağ Bilgileri',
        disk_partitions: 'Disk Bölümleri',
        uptime: 'Çalışma Süresi',
        load_avg: 'Yük Ortalaması',

        // Performans
        performance_graphs: 'Performans Grafikleri',
        realtime: 'Gerçek Zamanlı',
        cpu_history: 'CPU Kullanım Geçmişi',
        memory_history: 'Bellek Kullanım Geçmişi',
        disk_io: 'Disk I/O Hızı',
        network_traffic: 'Ağ Trafiği',
        instant_perf_stats: 'Anlık Performans İstatistikleri',
        disk_read: 'Disk Okuma',
        disk_write: 'Disk Yazma',
        net_download: 'Ağ İndirme',
        net_upload: 'Ağ Yükleme',

        // Bakım
        maintenance_ops: 'Bakım İşlemleri',
        full_maintenance: 'Tam Bakım',
        full_maintenance_desc: 'Tüm temizlik işlemlerini tek seferde gerçekleştir',
        apt_cache_clean: 'APT Önbellek Temizliği',
        apt_cache_clean_desc: 'Paket yöneticisi önbelleğini temizle',
        remove_old_kernels: 'Eski Kernelleri Kaldır',
        remove_old_kernels_desc: 'Kullanılmayan eski çekirdekleri sil',
        clean_log_files: 'Log Dosyalarını Temizle',
        clean_log_files_desc: 'Eski sistem loglarını temizle',
        clean_temp_files: 'Geçici Dosyaları Temizle',
        clean_temp_files_desc: 'Tmp ve önbellek klasörlerini temizle',
        empty_trash: 'Çöp Kutusunu Boşalt',
        empty_trash_desc: 'Silinen dosyaları kalıcı olarak kaldır',
        memory_optimization: 'Bellek Optimizasyonu',
        memory_optimization_desc: 'RAM önbelleğini temizle',
        fix_broken_packages: 'Bozuk Paketleri Onar',
        fix_broken_packages_desc: 'dpkg ve apt sorunlarını düzelt',
        optimize: 'Optimize Et',
        repair: 'Onar',
        empty: 'Boşalt',

        // Optimizasyon
        system_optimization: 'Sistem Optimizasyonu',
        optimization_profiles: 'Optimizasyon Profilleri',
        optimization_profiles_desc: 'Tek tıkla sisteminizi kullanım amacınıza göre optimize edin',
        desktop: 'Masaüstü',
        desktop_desc: 'Günlük kullanım için dengeli ayarlar',
        performance: 'Performans',
        performance_desc: 'Maksimum performans, daha fazla RAM kullanımı',
        laptop: 'Laptop',
        laptop_desc: 'Pil ömrünü uzatan tasarruflu ayarlar',
        server: 'Sunucu',
        server_desc: 'Kararlılık ve verimlilik odaklı',
        advanced_settings: 'Gelişmiş Sistem Ayarları',
        advanced_settings_desc: 'Kernel parametrelerini manuel olarak ayarlayın',
        swappiness: 'Swappiness',
        swappiness_desc: 'RAM dolduğunda swap kullanım agresifliği (0-100)',
        vfs_cache: 'VFS Cache Pressure',
        vfs_cache_desc: 'Dosya sistemi önbellek baskısı (0-200)',
        dirty_ratio: 'Dirty Ratio',
        dirty_ratio_desc: 'Yazma önbelleği boyutu yüzdesi (1-50)',
        io_scheduler: 'I/O Scheduler',
        io_scheduler_desc: 'Disk I/O zamanlama algoritması',

        // Zamanlanmış Görevler
        scheduled_maintenance: 'Zamanlanmış Bakım',
        new_scheduled_task: 'Yeni Zamanlanmış Görev',
        maintenance_type: 'Bakım Türü',
        schedule: 'Zamanlama',
        time: 'Saat',
        add_task: 'Görevi Ekle',
        active_scheduled_tasks: 'Aktif Zamanlanmış Görevler',
        tasks_loading: 'Görevler yükleniyor...',
        daily: 'Her Gün',
        weekly: 'Haftalık',
        monthly: 'Aylık',
        apt_clean: 'APT Temizliği',
        log_clean: 'Log Temizliği',
        tmp_clean: 'Tmp Temizliği',
        trash_empty: 'Çöp Boşaltma',

        // Log Görüntüleyici
        log_viewer: 'Log Görüntüleyici',
        log_type: 'Log Türü',
        line_count: 'Satır Sayısı',
        filter: 'Filtre',
        keyword: 'Anahtar kelime...',
        load_logs: 'Logları Yükle',
        select_log_file: 'Log dosyası seçin ve yükleyin',
        log_placeholder: 'Log içeriğini görmek için yukarıdan bir log türü seçip "Logları Yükle" butonuna tıklayın.',
        copy: 'Kopyala',
        download: 'İndir',
        syslog: 'Sistem (syslog)',
        auth_log: 'Kimlik Doğrulama',
        kern_log: 'Kernel',
        dpkg_log: 'Paket Yöneticisi',
        boot_log: 'Önyükleme',
        journal_log: 'Systemd Journal',
        lines_50: '50 Satır',
        lines_100: '100 Satır',
        lines_200: '200 Satır',
        lines_500: '500 Satır',

        // Güncellemeler
        system_updates: 'Sistem Güncellemeleri',
        check_updates: 'Güncellemeleri Kontrol Et',
        check_updates_desc: 'Paket listesini güncelle ve güncellemeleri kontrol et',
        full_upgrade: 'Tam Güncelleme',
        full_upgrade_desc: 'Tüm paketleri ve sistemi güncelle',
        check: 'Kontrol Et',
        update: 'Güncelle',

        // Süreçler
        running_processes: 'Çalışan Süreçler',
        search_process: 'Süreç ara...',
        pid: 'PID',
        name: 'İsim',
        user: 'Kullanıcı',
        cpu_percent: 'CPU %',
        memory_percent: 'Bellek %',
        status: 'Durum',
        action: 'İşlem',
        kill: 'Sonlandır',

        // Servisler
        system_services: 'Sistem Servisleri',

        // Disk
        disk_analysis: 'Disk Analizi',
        disk_health_check: 'Disk Sağlık Kontrolü',
        disk_health_check_desc: 'SMART durumu ve dosya sistemi kontrolü',
        disk_usage_analysis: 'Disk Kullanım Analizi',
        disk_usage_analysis_desc: 'En büyük dosya ve klasörleri bul',
        analyze: 'Analiz Et',

        // Güvenlik
        security: 'Güvenlik',
        security_scan: 'Güvenlik Taraması',
        security_scan_desc: 'Sistem güvenliğini kontrol et',
        scan: 'Tara',

        // Paketler
        installed_packages: 'Yüklü Paketler',
        search_package: 'Paket ara...',
        package_name: 'Paket Adı',
        version: 'Versiyon',
        size: 'Boyut'
    },

    en: {
        // General
        app_title: 'System Maintenance Center',
        login: 'Login',
        logout: 'Logout',
        sudo_password: 'Sudo Password',
        login_info: 'Enter your sudo password for admin privileges',
        connected: 'Connected',
        disconnected: 'Disconnected',
        notifications_on: 'On',
        notifications_off: 'Off',
        refresh: 'Refresh',
        apply: 'Apply',
        start: 'Start',
        stop: 'Stop',
        clean: 'Clean',
        remove: 'Remove',
        search: 'Search',
        loading: 'Loading...',
        operation_started: 'Operation Started',
        starting: 'starting',
        running: 'Running',
        completed: 'Completed',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info',
        current: 'Current',

        // Menu
        menu_dashboard: 'Dashboard',
        menu_performance: 'Performance',
        menu_maintenance: 'Maintenance',
        menu_optimization: 'Optimization',
        menu_scheduled: 'Scheduled',
        menu_logs: 'Log Viewer',
        menu_updates: 'Updates',
        menu_processes: 'Processes',
        menu_services: 'Services',
        menu_disk: 'Disk Analysis',
        menu_security: 'Security',
        menu_packages: 'Packages',
        new_badge: 'New',

        // Dashboard
        system_status: 'System Status',
        cpu_usage: 'CPU Usage',
        memory_usage: 'Memory Usage',
        disk_usage: 'Disk Usage',
        battery_status: 'Battery Status',
        cpu_cores: 'CPU Cores',
        system_info: 'System Information',
        network_info: 'Network Information',
        disk_partitions: 'Disk Partitions',
        uptime: 'Uptime',
        load_avg: 'Load Average',

        // Performance
        performance_graphs: 'Performance Graphs',
        realtime: 'Real-time',
        cpu_history: 'CPU Usage History',
        memory_history: 'Memory Usage History',
        disk_io: 'Disk I/O Speed',
        network_traffic: 'Network Traffic',
        instant_perf_stats: 'Instant Performance Statistics',
        disk_read: 'Disk Read',
        disk_write: 'Disk Write',
        net_download: 'Net Download',
        net_upload: 'Net Upload',

        // Maintenance
        maintenance_ops: 'Maintenance Operations',
        full_maintenance: 'Full Maintenance',
        full_maintenance_desc: 'Perform all cleanup operations at once',
        apt_cache_clean: 'APT Cache Cleanup',
        apt_cache_clean_desc: 'Clean package manager cache',
        remove_old_kernels: 'Remove Old Kernels',
        remove_old_kernels_desc: 'Delete unused old kernels',
        clean_log_files: 'Clean Log Files',
        clean_log_files_desc: 'Clean old system logs',
        clean_temp_files: 'Clean Temporary Files',
        clean_temp_files_desc: 'Clean tmp and cache folders',
        empty_trash: 'Empty Trash',
        empty_trash_desc: 'Permanently remove deleted files',
        memory_optimization: 'Memory Optimization',
        memory_optimization_desc: 'Clear RAM cache',
        fix_broken_packages: 'Fix Broken Packages',
        fix_broken_packages_desc: 'Fix dpkg and apt issues',
        optimize: 'Optimize',
        repair: 'Repair',
        empty: 'Empty',

        // Optimization
        system_optimization: 'System Optimization',
        optimization_profiles: 'Optimization Profiles',
        optimization_profiles_desc: 'Optimize your system with one click according to your usage',
        desktop: 'Desktop',
        desktop_desc: 'Balanced settings for daily use',
        performance: 'Performance',
        performance_desc: 'Maximum performance, more RAM usage',
        laptop: 'Laptop',
        laptop_desc: 'Power-saving settings to extend battery life',
        server: 'Server',
        server_desc: 'Focused on stability and efficiency',
        advanced_settings: 'Advanced System Settings',
        advanced_settings_desc: 'Manually adjust kernel parameters',
        swappiness: 'Swappiness',
        swappiness_desc: 'Swap usage aggressiveness when RAM is full (0-100)',
        vfs_cache: 'VFS Cache Pressure',
        vfs_cache_desc: 'Filesystem cache pressure (0-200)',
        dirty_ratio: 'Dirty Ratio',
        dirty_ratio_desc: 'Write cache size percentage (1-50)',
        io_scheduler: 'I/O Scheduler',
        io_scheduler_desc: 'Disk I/O scheduling algorithm',

        // Scheduled Tasks
        scheduled_maintenance: 'Scheduled Maintenance',
        new_scheduled_task: 'New Scheduled Task',
        maintenance_type: 'Maintenance Type',
        schedule: 'Schedule',
        time: 'Time',
        add_task: 'Add Task',
        active_scheduled_tasks: 'Active Scheduled Tasks',
        tasks_loading: 'Loading tasks...',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        apt_clean: 'APT Cleanup',
        log_clean: 'Log Cleanup',
        tmp_clean: 'Tmp Cleanup',
        trash_empty: 'Trash Empty',

        // Log Viewer
        log_viewer: 'Log Viewer',
        log_type: 'Log Type',
        line_count: 'Line Count',
        filter: 'Filter',
        keyword: 'Keyword...',
        load_logs: 'Load Logs',
        select_log_file: 'Select and load a log file',
        log_placeholder: 'Select a log type above and click "Load Logs" to view log content.',
        copy: 'Copy',
        download: 'Download',
        syslog: 'System (syslog)',
        auth_log: 'Authentication',
        kern_log: 'Kernel',
        dpkg_log: 'Package Manager',
        boot_log: 'Boot',
        journal_log: 'Systemd Journal',
        lines_50: '50 Lines',
        lines_100: '100 Lines',
        lines_200: '200 Lines',
        lines_500: '500 Lines',

        // Updates
        system_updates: 'System Updates',
        check_updates: 'Check Updates',
        check_updates_desc: 'Update package list and check for updates',
        full_upgrade: 'Full Upgrade',
        full_upgrade_desc: 'Update all packages and system',
        check: 'Check',
        update: 'Update',

        // Processes
        running_processes: 'Running Processes',
        search_process: 'Search process...',
        pid: 'PID',
        name: 'Name',
        user: 'User',
        cpu_percent: 'CPU %',
        memory_percent: 'Memory %',
        status: 'Status',
        action: 'Action',
        kill: 'Kill',

        // Services
        system_services: 'System Services',

        // Disk
        disk_analysis: 'Disk Analysis',
        disk_health_check: 'Disk Health Check',
        disk_health_check_desc: 'SMART status and filesystem check',
        disk_usage_analysis: 'Disk Usage Analysis',
        disk_usage_analysis_desc: 'Find largest files and folders',
        analyze: 'Analyze',

        // Security
        security: 'Security',
        security_scan: 'Security Scan',
        security_scan_desc: 'Check system security',
        scan: 'Scan',

        // Packages
        installed_packages: 'Installed Packages',
        search_package: 'Search package...',
        package_name: 'Package Name',
        version: 'Version',
        size: 'Size'
    },

    de: {
        // Allgemein
        app_title: 'Systemwartungszentrum',
        login: 'Anmelden',
        logout: 'Abmelden',
        sudo_password: 'Sudo-Passwort',
        login_info: 'Geben Sie Ihr Sudo-Passwort für Administratorrechte ein',
        connected: 'Verbunden',
        disconnected: 'Getrennt',
        notifications_on: 'An',
        notifications_off: 'Aus',
        refresh: 'Aktualisieren',
        apply: 'Anwenden',
        start: 'Starten',
        stop: 'Stoppen',
        clean: 'Bereinigen',
        remove: 'Entfernen',
        search: 'Suchen',
        loading: 'Laden...',
        operation_started: 'Vorgang gestartet',
        starting: 'startet',
        running: 'Läuft',
        completed: 'Abgeschlossen',
        error: 'Fehler',
        success: 'Erfolg',
        warning: 'Warnung',
        info: 'Info',
        current: 'Aktuell',

        // Menü
        menu_dashboard: 'Dashboard',
        menu_performance: 'Leistung',
        menu_maintenance: 'Wartung',
        menu_optimization: 'Optimierung',
        menu_scheduled: 'Geplant',
        menu_logs: 'Log-Viewer',
        menu_updates: 'Updates',
        menu_processes: 'Prozesse',
        menu_services: 'Dienste',
        menu_disk: 'Festplattenanalyse',
        menu_security: 'Sicherheit',
        menu_packages: 'Pakete',
        new_badge: 'Neu',

        // Dashboard
        system_status: 'Systemstatus',
        cpu_usage: 'CPU-Auslastung',
        memory_usage: 'Speicherauslastung',
        disk_usage: 'Festplattennutzung',
        battery_status: 'Akkustatus',
        cpu_cores: 'CPU-Kerne',
        system_info: 'Systeminformationen',
        network_info: 'Netzwerkinformationen',
        disk_partitions: 'Festplattenpartitionen',
        uptime: 'Betriebszeit',
        load_avg: 'Lastdurchschnitt',

        // Leistung
        performance_graphs: 'Leistungsdiagramme',
        realtime: 'Echtzeit',
        cpu_history: 'CPU-Nutzungsverlauf',
        memory_history: 'Speichernutzungsverlauf',
        disk_io: 'Festplatten-I/O-Geschwindigkeit',
        network_traffic: 'Netzwerkverkehr',
        instant_perf_stats: 'Sofortige Leistungsstatistiken',
        disk_read: 'Festplatte lesen',
        disk_write: 'Festplatte schreiben',
        net_download: 'Netz-Download',
        net_upload: 'Netz-Upload',

        // Wartung
        maintenance_ops: 'Wartungsoperationen',
        full_maintenance: 'Vollständige Wartung',
        full_maintenance_desc: 'Alle Bereinigungsvorgänge auf einmal durchführen',
        apt_cache_clean: 'APT-Cache-Bereinigung',
        apt_cache_clean_desc: 'Paketmanager-Cache bereinigen',
        remove_old_kernels: 'Alte Kernel entfernen',
        remove_old_kernels_desc: 'Unbenutzte alte Kernel löschen',
        clean_log_files: 'Log-Dateien bereinigen',
        clean_log_files_desc: 'Alte Systemprotokolle bereinigen',
        clean_temp_files: 'Temporäre Dateien bereinigen',
        clean_temp_files_desc: 'Tmp- und Cache-Ordner bereinigen',
        empty_trash: 'Papierkorb leeren',
        empty_trash_desc: 'Gelöschte Dateien dauerhaft entfernen',
        memory_optimization: 'Speicheroptimierung',
        memory_optimization_desc: 'RAM-Cache leeren',
        fix_broken_packages: 'Defekte Pakete reparieren',
        fix_broken_packages_desc: 'dpkg- und apt-Probleme beheben',
        optimize: 'Optimieren',
        repair: 'Reparieren',
        empty: 'Leeren',

        // Optimierung
        system_optimization: 'Systemoptimierung',
        optimization_profiles: 'Optimierungsprofile',
        optimization_profiles_desc: 'Optimieren Sie Ihr System mit einem Klick entsprechend Ihrer Nutzung',
        desktop: 'Desktop',
        desktop_desc: 'Ausgewogene Einstellungen für den täglichen Gebrauch',
        performance: 'Leistung',
        performance_desc: 'Maximale Leistung, mehr RAM-Nutzung',
        laptop: 'Laptop',
        laptop_desc: 'Stromsparende Einstellungen zur Verlängerung der Akkulaufzeit',
        server: 'Server',
        server_desc: 'Fokus auf Stabilität und Effizienz',
        advanced_settings: 'Erweiterte Systemeinstellungen',
        advanced_settings_desc: 'Kernel-Parameter manuell anpassen',
        swappiness: 'Swappiness',
        swappiness_desc: 'Swap-Nutzungsaggressivität bei vollem RAM (0-100)',
        vfs_cache: 'VFS Cache Pressure',
        vfs_cache_desc: 'Dateisystem-Cache-Druck (0-200)',
        dirty_ratio: 'Dirty Ratio',
        dirty_ratio_desc: 'Schreib-Cache-Größe in Prozent (1-50)',
        io_scheduler: 'I/O-Scheduler',
        io_scheduler_desc: 'Festplatten-I/O-Planungsalgorithmus',

        // Geplante Aufgaben
        scheduled_maintenance: 'Geplante Wartung',
        new_scheduled_task: 'Neue geplante Aufgabe',
        maintenance_type: 'Wartungstyp',
        schedule: 'Zeitplan',
        time: 'Zeit',
        add_task: 'Aufgabe hinzufügen',
        active_scheduled_tasks: 'Aktive geplante Aufgaben',
        tasks_loading: 'Aufgaben werden geladen...',
        daily: 'Täglich',
        weekly: 'Wöchentlich',
        monthly: 'Monatlich',
        apt_clean: 'APT-Bereinigung',
        log_clean: 'Log-Bereinigung',
        tmp_clean: 'Tmp-Bereinigung',
        trash_empty: 'Papierkorb leeren',

        // Log-Viewer
        log_viewer: 'Log-Viewer',
        log_type: 'Log-Typ',
        line_count: 'Zeilenanzahl',
        filter: 'Filter',
        keyword: 'Stichwort...',
        load_logs: 'Logs laden',
        select_log_file: 'Log-Datei auswählen und laden',
        log_placeholder: 'Wählen Sie oben einen Log-Typ und klicken Sie auf "Logs laden", um den Log-Inhalt anzuzeigen.',
        copy: 'Kopieren',
        download: 'Herunterladen',
        syslog: 'System (syslog)',
        auth_log: 'Authentifizierung',
        kern_log: 'Kernel',
        dpkg_log: 'Paketmanager',
        boot_log: 'Boot',
        journal_log: 'Systemd Journal',
        lines_50: '50 Zeilen',
        lines_100: '100 Zeilen',
        lines_200: '200 Zeilen',
        lines_500: '500 Zeilen',

        // Updates
        system_updates: 'System-Updates',
        check_updates: 'Updates prüfen',
        check_updates_desc: 'Paketliste aktualisieren und nach Updates suchen',
        full_upgrade: 'Vollständiges Upgrade',
        full_upgrade_desc: 'Alle Pakete und das System aktualisieren',
        check: 'Prüfen',
        update: 'Aktualisieren',

        // Prozesse
        running_processes: 'Laufende Prozesse',
        search_process: 'Prozess suchen...',
        pid: 'PID',
        name: 'Name',
        user: 'Benutzer',
        cpu_percent: 'CPU %',
        memory_percent: 'Speicher %',
        status: 'Status',
        action: 'Aktion',
        kill: 'Beenden',

        // Dienste
        system_services: 'Systemdienste',

        // Festplatte
        disk_analysis: 'Festplattenanalyse',
        disk_health_check: 'Festplatten-Gesundheitscheck',
        disk_health_check_desc: 'SMART-Status und Dateisystemprüfung',
        disk_usage_analysis: 'Festplattennutzungsanalyse',
        disk_usage_analysis_desc: 'Größte Dateien und Ordner finden',
        analyze: 'Analysieren',

        // Sicherheit
        security: 'Sicherheit',
        security_scan: 'Sicherheitsscan',
        security_scan_desc: 'Systemsicherheit überprüfen',
        scan: 'Scannen',

        // Pakete
        installed_packages: 'Installierte Pakete',
        search_package: 'Paket suchen...',
        package_name: 'Paketname',
        version: 'Version',
        size: 'Größe'
    },

    fr: {
        // Général
        app_title: 'Centre de Maintenance Système',
        login: 'Connexion',
        logout: 'Déconnexion',
        sudo_password: 'Mot de passe Sudo',
        login_info: 'Entrez votre mot de passe sudo pour les privilèges administrateur',
        connected: 'Connecté',
        disconnected: 'Déconnecté',
        notifications_on: 'Activé',
        notifications_off: 'Désactivé',
        refresh: 'Actualiser',
        apply: 'Appliquer',
        start: 'Démarrer',
        stop: 'Arrêter',
        clean: 'Nettoyer',
        remove: 'Supprimer',
        search: 'Rechercher',
        loading: 'Chargement...',
        operation_started: 'Opération démarrée',
        starting: 'démarrage',
        running: 'En cours',
        completed: 'Terminé',
        error: 'Erreur',
        success: 'Succès',
        warning: 'Avertissement',
        info: 'Info',
        current: 'Actuel',

        // Menu
        menu_dashboard: 'Tableau de bord',
        menu_performance: 'Performance',
        menu_maintenance: 'Maintenance',
        menu_optimization: 'Optimisation',
        menu_scheduled: 'Planifié',
        menu_logs: 'Visionneuse de logs',
        menu_updates: 'Mises à jour',
        menu_processes: 'Processus',
        menu_services: 'Services',
        menu_disk: 'Analyse de disque',
        menu_security: 'Sécurité',
        menu_packages: 'Paquets',
        new_badge: 'Nouveau',

        // Tableau de bord
        system_status: 'État du système',
        cpu_usage: 'Utilisation CPU',
        memory_usage: 'Utilisation mémoire',
        disk_usage: 'Utilisation disque',
        battery_status: 'État de la batterie',
        cpu_cores: 'Cœurs CPU',
        system_info: 'Informations système',
        network_info: 'Informations réseau',
        disk_partitions: 'Partitions de disque',
        uptime: 'Temps de fonctionnement',
        load_avg: 'Charge moyenne',

        // Performance
        performance_graphs: 'Graphiques de performance',
        realtime: 'Temps réel',
        cpu_history: 'Historique d\'utilisation CPU',
        memory_history: 'Historique d\'utilisation mémoire',
        disk_io: 'Vitesse E/S disque',
        network_traffic: 'Trafic réseau',
        instant_perf_stats: 'Statistiques de performance instantanées',
        disk_read: 'Lecture disque',
        disk_write: 'Écriture disque',
        net_download: 'Téléchargement',
        net_upload: 'Téléversement',

        // Maintenance
        maintenance_ops: 'Opérations de maintenance',
        full_maintenance: 'Maintenance complète',
        full_maintenance_desc: 'Effectuer toutes les opérations de nettoyage en une fois',
        apt_cache_clean: 'Nettoyage du cache APT',
        apt_cache_clean_desc: 'Nettoyer le cache du gestionnaire de paquets',
        remove_old_kernels: 'Supprimer les anciens noyaux',
        remove_old_kernels_desc: 'Supprimer les anciens noyaux inutilisés',
        clean_log_files: 'Nettoyer les fichiers logs',
        clean_log_files_desc: 'Nettoyer les anciens journaux système',
        clean_temp_files: 'Nettoyer les fichiers temporaires',
        clean_temp_files_desc: 'Nettoyer les dossiers tmp et cache',
        empty_trash: 'Vider la corbeille',
        empty_trash_desc: 'Supprimer définitivement les fichiers supprimés',
        memory_optimization: 'Optimisation mémoire',
        memory_optimization_desc: 'Vider le cache RAM',
        fix_broken_packages: 'Réparer les paquets cassés',
        fix_broken_packages_desc: 'Corriger les problèmes dpkg et apt',
        optimize: 'Optimiser',
        repair: 'Réparer',
        empty: 'Vider',

        // Optimisation
        system_optimization: 'Optimisation système',
        optimization_profiles: 'Profils d\'optimisation',
        optimization_profiles_desc: 'Optimisez votre système en un clic selon votre utilisation',
        desktop: 'Bureau',
        desktop_desc: 'Paramètres équilibrés pour un usage quotidien',
        performance: 'Performance',
        performance_desc: 'Performance maximale, plus d\'utilisation RAM',
        laptop: 'Portable',
        laptop_desc: 'Paramètres d\'économie d\'énergie pour prolonger l\'autonomie',
        server: 'Serveur',
        server_desc: 'Axé sur la stabilité et l\'efficacité',
        advanced_settings: 'Paramètres système avancés',
        advanced_settings_desc: 'Ajuster manuellement les paramètres du noyau',
        swappiness: 'Swappiness',
        swappiness_desc: 'Agressivité de l\'utilisation du swap quand la RAM est pleine (0-100)',
        vfs_cache: 'VFS Cache Pressure',
        vfs_cache_desc: 'Pression du cache du système de fichiers (0-200)',
        dirty_ratio: 'Dirty Ratio',
        dirty_ratio_desc: 'Pourcentage de la taille du cache d\'écriture (1-50)',
        io_scheduler: 'Ordonnanceur E/S',
        io_scheduler_desc: 'Algorithme de planification E/S disque',

        // Tâches planifiées
        scheduled_maintenance: 'Maintenance planifiée',
        new_scheduled_task: 'Nouvelle tâche planifiée',
        maintenance_type: 'Type de maintenance',
        schedule: 'Planification',
        time: 'Heure',
        add_task: 'Ajouter la tâche',
        active_scheduled_tasks: 'Tâches planifiées actives',
        tasks_loading: 'Chargement des tâches...',
        daily: 'Quotidien',
        weekly: 'Hebdomadaire',
        monthly: 'Mensuel',
        apt_clean: 'Nettoyage APT',
        log_clean: 'Nettoyage logs',
        tmp_clean: 'Nettoyage tmp',
        trash_empty: 'Vider corbeille',

        // Visionneuse de logs
        log_viewer: 'Visionneuse de logs',
        log_type: 'Type de log',
        line_count: 'Nombre de lignes',
        filter: 'Filtre',
        keyword: 'Mot-clé...',
        load_logs: 'Charger les logs',
        select_log_file: 'Sélectionnez et chargez un fichier log',
        log_placeholder: 'Sélectionnez un type de log ci-dessus et cliquez sur "Charger les logs" pour afficher le contenu.',
        copy: 'Copier',
        download: 'Télécharger',
        syslog: 'Système (syslog)',
        auth_log: 'Authentification',
        kern_log: 'Noyau',
        dpkg_log: 'Gestionnaire de paquets',
        boot_log: 'Démarrage',
        journal_log: 'Journal Systemd',
        lines_50: '50 Lignes',
        lines_100: '100 Lignes',
        lines_200: '200 Lignes',
        lines_500: '500 Lignes',

        // Mises à jour
        system_updates: 'Mises à jour système',
        check_updates: 'Vérifier les mises à jour',
        check_updates_desc: 'Mettre à jour la liste des paquets et vérifier les mises à jour',
        full_upgrade: 'Mise à jour complète',
        full_upgrade_desc: 'Mettre à jour tous les paquets et le système',
        check: 'Vérifier',
        update: 'Mettre à jour',

        // Processus
        running_processes: 'Processus en cours',
        search_process: 'Rechercher un processus...',
        pid: 'PID',
        name: 'Nom',
        user: 'Utilisateur',
        cpu_percent: 'CPU %',
        memory_percent: 'Mémoire %',
        status: 'Statut',
        action: 'Action',
        kill: 'Terminer',

        // Services
        system_services: 'Services système',

        // Disque
        disk_analysis: 'Analyse de disque',
        disk_health_check: 'Vérification de santé du disque',
        disk_health_check_desc: 'État SMART et vérification du système de fichiers',
        disk_usage_analysis: 'Analyse de l\'utilisation du disque',
        disk_usage_analysis_desc: 'Trouver les fichiers et dossiers les plus volumineux',
        analyze: 'Analyser',

        // Sécurité
        security: 'Sécurité',
        security_scan: 'Analyse de sécurité',
        security_scan_desc: 'Vérifier la sécurité du système',
        scan: 'Analyser',

        // Paquets
        installed_packages: 'Paquets installés',
        search_package: 'Rechercher un paquet...',
        package_name: 'Nom du paquet',
        version: 'Version',
        size: 'Taille'
    },

    ru: {
        // Общее
        app_title: 'Центр обслуживания системы',
        login: 'Войти',
        logout: 'Выйти',
        sudo_password: 'Пароль Sudo',
        login_info: 'Введите пароль sudo для прав администратора',
        connected: 'Подключено',
        disconnected: 'Отключено',
        notifications_on: 'Вкл',
        notifications_off: 'Выкл',
        refresh: 'Обновить',
        apply: 'Применить',
        start: 'Запустить',
        stop: 'Остановить',
        clean: 'Очистить',
        remove: 'Удалить',
        search: 'Поиск',
        loading: 'Загрузка...',
        operation_started: 'Операция запущена',
        starting: 'запуск',
        running: 'Выполняется',
        completed: 'Завершено',
        error: 'Ошибка',
        success: 'Успех',
        warning: 'Предупреждение',
        info: 'Информация',
        current: 'Текущее',

        // Меню
        menu_dashboard: 'Панель управления',
        menu_performance: 'Производительность',
        menu_maintenance: 'Обслуживание',
        menu_optimization: 'Оптимизация',
        menu_scheduled: 'Запланировано',
        menu_logs: 'Просмотр логов',
        menu_updates: 'Обновления',
        menu_processes: 'Процессы',
        menu_services: 'Службы',
        menu_disk: 'Анализ диска',
        menu_security: 'Безопасность',
        menu_packages: 'Пакеты',
        new_badge: 'Новое',

        // Панель управления
        system_status: 'Состояние системы',
        cpu_usage: 'Загрузка CPU',
        memory_usage: 'Использование памяти',
        disk_usage: 'Использование диска',
        battery_status: 'Состояние батареи',
        cpu_cores: 'Ядра CPU',
        system_info: 'Информация о системе',
        network_info: 'Информация о сети',
        disk_partitions: 'Разделы диска',
        uptime: 'Время работы',
        load_avg: 'Средняя нагрузка',

        // Производительность
        performance_graphs: 'Графики производительности',
        realtime: 'В реальном времени',
        cpu_history: 'История использования CPU',
        memory_history: 'История использования памяти',
        disk_io: 'Скорость ввода-вывода диска',
        network_traffic: 'Сетевой трафик',
        instant_perf_stats: 'Мгновенная статистика производительности',
        disk_read: 'Чтение диска',
        disk_write: 'Запись диска',
        net_download: 'Загрузка',
        net_upload: 'Выгрузка',

        // Обслуживание
        maintenance_ops: 'Операции обслуживания',
        full_maintenance: 'Полное обслуживание',
        full_maintenance_desc: 'Выполнить все операции очистки за один раз',
        apt_cache_clean: 'Очистка кэша APT',
        apt_cache_clean_desc: 'Очистить кэш менеджера пакетов',
        remove_old_kernels: 'Удалить старые ядра',
        remove_old_kernels_desc: 'Удалить неиспользуемые старые ядра',
        clean_log_files: 'Очистить файлы логов',
        clean_log_files_desc: 'Очистить старые системные журналы',
        clean_temp_files: 'Очистить временные файлы',
        clean_temp_files_desc: 'Очистить папки tmp и кэш',
        empty_trash: 'Очистить корзину',
        empty_trash_desc: 'Удалить удаленные файлы навсегда',
        memory_optimization: 'Оптимизация памяти',
        memory_optimization_desc: 'Очистить кэш RAM',
        fix_broken_packages: 'Исправить сломанные пакеты',
        fix_broken_packages_desc: 'Исправить проблемы dpkg и apt',
        optimize: 'Оптимизировать',
        repair: 'Исправить',
        empty: 'Очистить',

        // Оптимизация
        system_optimization: 'Оптимизация системы',
        optimization_profiles: 'Профили оптимизации',
        optimization_profiles_desc: 'Оптимизируйте систему одним кликом в соответствии с вашим использованием',
        desktop: 'Рабочий стол',
        desktop_desc: 'Сбалансированные настройки для ежедневного использования',
        performance: 'Производительность',
        performance_desc: 'Максимальная производительность, больше использования RAM',
        laptop: 'Ноутбук',
        laptop_desc: 'Настройки энергосбережения для продления времени автономной работы',
        server: 'Сервер',
        server_desc: 'Фокус на стабильность и эффективность',
        advanced_settings: 'Расширенные настройки системы',
        advanced_settings_desc: 'Вручную настроить параметры ядра',
        swappiness: 'Swappiness',
        swappiness_desc: 'Агрессивность использования swap при полной RAM (0-100)',
        vfs_cache: 'VFS Cache Pressure',
        vfs_cache_desc: 'Давление кэша файловой системы (0-200)',
        dirty_ratio: 'Dirty Ratio',
        dirty_ratio_desc: 'Процент размера кэша записи (1-50)',
        io_scheduler: 'Планировщик ввода-вывода',
        io_scheduler_desc: 'Алгоритм планирования ввода-вывода диска',

        // Запланированные задачи
        scheduled_maintenance: 'Запланированное обслуживание',
        new_scheduled_task: 'Новая запланированная задача',
        maintenance_type: 'Тип обслуживания',
        schedule: 'Расписание',
        time: 'Время',
        add_task: 'Добавить задачу',
        active_scheduled_tasks: 'Активные запланированные задачи',
        tasks_loading: 'Загрузка задач...',
        daily: 'Ежедневно',
        weekly: 'Еженедельно',
        monthly: 'Ежемесячно',
        apt_clean: 'Очистка APT',
        log_clean: 'Очистка логов',
        tmp_clean: 'Очистка tmp',
        trash_empty: 'Очистка корзины',

        // Просмотр логов
        log_viewer: 'Просмотр логов',
        log_type: 'Тип лога',
        line_count: 'Количество строк',
        filter: 'Фильтр',
        keyword: 'Ключевое слово...',
        load_logs: 'Загрузить логи',
        select_log_file: 'Выберите и загрузите файл лога',
        log_placeholder: 'Выберите тип лога выше и нажмите "Загрузить логи" для отображения содержимого.',
        copy: 'Копировать',
        download: 'Скачать',
        syslog: 'Система (syslog)',
        auth_log: 'Аутентификация',
        kern_log: 'Ядро',
        dpkg_log: 'Менеджер пакетов',
        boot_log: 'Загрузка',
        journal_log: 'Журнал Systemd',
        lines_50: '50 Строк',
        lines_100: '100 Строк',
        lines_200: '200 Строк',
        lines_500: '500 Строк',

        // Обновления
        system_updates: 'Обновления системы',
        check_updates: 'Проверить обновления',
        check_updates_desc: 'Обновить список пакетов и проверить обновления',
        full_upgrade: 'Полное обновление',
        full_upgrade_desc: 'Обновить все пакеты и систему',
        check: 'Проверить',
        update: 'Обновить',

        // Процессы
        running_processes: 'Запущенные процессы',
        search_process: 'Поиск процесса...',
        pid: 'PID',
        name: 'Имя',
        user: 'Пользователь',
        cpu_percent: 'CPU %',
        memory_percent: 'Память %',
        status: 'Статус',
        action: 'Действие',
        kill: 'Завершить',

        // Службы
        system_services: 'Системные службы',

        // Диск
        disk_analysis: 'Анализ диска',
        disk_health_check: 'Проверка здоровья диска',
        disk_health_check_desc: 'Статус SMART и проверка файловой системы',
        disk_usage_analysis: 'Анализ использования диска',
        disk_usage_analysis_desc: 'Найти самые большие файлы и папки',
        analyze: 'Анализировать',

        // Безопасность
        security: 'Безопасность',
        security_scan: 'Сканирование безопасности',
        security_scan_desc: 'Проверить безопасность системы',
        scan: 'Сканировать',

        // Пакеты
        installed_packages: 'Установленные пакеты',
        search_package: 'Поиск пакета...',
        package_name: 'Имя пакета',
        version: 'Версия',
        size: 'Размер'
    }
};

let currentLang = localStorage.getItem('language') || 'tr';

function t(key) {
    return translations[currentLang]?.[key] || translations['tr'][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    // Ana uygulama dil kodunu güncelle
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) {
        currentLangEl.textContent = lang.toUpperCase();
    }

    // Login dil kodunu güncelle
    const loginCurrentLangEl = document.getElementById('login-current-lang');
    if (loginCurrentLangEl) {
        loginCurrentLangEl.textContent = lang.toUpperCase();
    }

    // Ana uygulama aktif dil seçeneğini güncelle
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === lang) {
            opt.classList.add('active');
        }
    });

    // Login aktif dil seçeneğini güncelle
    document.querySelectorAll('.login-lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === lang) {
            opt.classList.add('active');
        }
    });

    // Tüm çevrilebilir elementleri güncelle
    updateTranslations();

    // Dropdown'ları kapat
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.classList.remove('open');
    }
    const loginLangSelector = document.getElementById('login-language-selector');
    if (loginLangSelector) {
        loginLangSelector.classList.remove('open');
    }
}

function updateTranslations() {
    // data-i18n attribute'u olan tüm elementleri güncelle
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    // data-i18n-title attribute'u olan elementler için title güncelle
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        el.title = t(key);
    });

    // Sayfa başlığını güncelle
    document.title = t('app_title') + ' v2.0';
}

// Sayfa yüklendiğinde dil ayarını uygula
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'tr';
    currentLang = savedLang;

    // Ana uygulama dil kodunu güncelle
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) {
        currentLangEl.textContent = savedLang.toUpperCase();
    }

    // Login dil kodunu güncelle
    const loginCurrentLangEl = document.getElementById('login-current-lang');
    if (loginCurrentLangEl) {
        loginCurrentLangEl.textContent = savedLang.toUpperCase();
    }

    // Ana uygulama dil seçeneklerini güncelle
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === savedLang) {
            opt.classList.add('active');
        }
    });

    // Login dil seçeneklerini güncelle
    document.querySelectorAll('.login-lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === savedLang) {
            opt.classList.add('active');
        }
    });

    updateTranslations();
});

// Dil seçici olayları
document.addEventListener('DOMContentLoaded', () => {
    // Ana uygulama dil seçici
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('language-selector').classList.toggle('open');
        });
    }

    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            setLanguage(opt.dataset.lang);
        });
    });

    // Login dil seçici
    const loginLangBtn = document.getElementById('login-lang-btn');
    if (loginLangBtn) {
        loginLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('login-language-selector').classList.toggle('open');
        });
    }

    document.querySelectorAll('.login-lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            setLanguage(opt.dataset.lang);
        });
    });

    // Dışarı tıklandığında dropdown'ları kapat
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            const langSelector = document.getElementById('language-selector');
            if (langSelector) {
                langSelector.classList.remove('open');
            }
        }
        if (!e.target.closest('.login-language-selector')) {
            const loginLangSelector = document.getElementById('login-language-selector');
            if (loginLangSelector) {
                loginLangSelector.classList.remove('open');
            }
        }
    });
});
