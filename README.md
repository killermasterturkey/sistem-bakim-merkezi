# Sistem Bakim Merkezi v1.1

<div align="center">

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-yellow.svg)
![Platform](https://img.shields.io/badge/platform-Linux-orange.svg)

**Kapsamli Linux Sistem Bakim ve Optimizasyon Araci**

[Turkce](#turkce) | [English](#english) | [Deutsch](#deutsch) | [Francais](#francais) | [Pусский](#russian)

</div>

---

<a name="turkce"></a>
## Turkce

### Proje Hakkinda

**Sistem Bakim Merkezi**, Linux sistemlerinizi tek bir modern web arayuzunden yonetmenizi saglayan kapsamli bir sistem bakim aracidir. Gercek zamanli performans izleme, otomatik temizlik, sistem optimizasyonu ve zamanlanmis gorevler gibi profesyonel ozellikler sunmaktadir.

Bu proje, Linux kullanicilarinin sistem bakimini kolaylastirmak ve profesyonel sistem yonetim araclarinin sagladigi islevselligi ucretsiz ve acik kaynakli olarak sunmak amaciyla gelistirilmistir.

### Ozellikler

- **Gercek Zamanli Performans Izleme**: CPU, RAM, disk ve ag kullanimini canli grafiklerle takip edin
- **Sistem Temizligi**: APT onbellek, gecici dosyalar, log dosyalari, tarayici onbellekleri otomatik temizleme
- **Sistem Optimizasyonu**: Swappiness, I/O zamanlayici, onbellek yonetimi ayarlari
- **Zamanlanmis Gorevler**: Otomatik bakim gorevleri planlama
- **Coklu Dil Destegi**: Turkce, Ingilizce, Almanca, Fransizca, Rusca
- **Modern Arayuz**: Glassmorphism tasarim, karanlik tema, tam ekran modu
- **Guvenli Erisim**: Sudo sifre dogrulamasi ile guvenli sistem erisimi

### Kod Yapisi

```
sistem_bakim/
├── app.py                 # Ana Flask uygulamasi ve API endpoint'leri
├── requirements.txt       # Python bagimliliklari
├── static/
│   ├── css/
│   │   └── style.css     # Tum stiller ve animasyonlar
│   └── js/
│       ├── app.js        # Ana JavaScript uygulamasi
│       └── translations.js # Coklu dil ceviri dosyasi
└── templates/
    └── index.html        # Ana HTML sablonu
```

### Kurulum

1. **Depoyu klonlayin:**
```bash
git clone https://github.com/killermasterturkey/sistem-bakim-merkezi.git
cd sistem-bakim-merkezi
```

2. **Bagimliliklari yukleyin:**
```bash
pip install -r requirements.txt
```

3. **Uygulamayi calistirin:**
```bash
python3 app.py
```

4. **Tarayicinizda acin:**
```
http://localhost:5000
```

5. **Sudo sifrenizi girin ve sisteminizi yonetmeye baslayin!**

### Neden Bu Proje?

- **Tamamen Ucretsiz ve Acik Kaynak**: Herhangi bir gizli ucret veya sinirlandirma yok
- **Gercek Zamanli Izleme**: Socket.IO ile anlik sistem verileri
- **Guvenli**: Sudo sifreniz sadece oturumda tutulur, hicbir yere kaydedilmez
- **Modern Tasarim**: Profesyonel gorunumlu, kullanici dostu arayuz
- **Genisletilebilir**: Kolayca yeni ozellikler eklenebilir
- **Hafif**: Minimum sistem kaynak kullanimi

---

<a name="english"></a>
## English

### About the Project

**System Maintenance Center** is a comprehensive system maintenance tool that allows you to manage your Linux systems from a single modern web interface. It offers professional features such as real-time performance monitoring, automatic cleanup, system optimization, and scheduled tasks.

This project was developed to simplify system maintenance for Linux users and to provide the functionality of professional system management tools for free and open source.

### Features

- **Real-Time Performance Monitoring**: Track CPU, RAM, disk, and network usage with live charts
- **System Cleanup**: Automatic cleaning of APT cache, temporary files, log files, browser caches
- **System Optimization**: Swappiness, I/O scheduler, cache management settings
- **Scheduled Tasks**: Plan automatic maintenance tasks
- **Multi-Language Support**: Turkish, English, German, French, Russian
- **Modern Interface**: Glassmorphism design, dark theme, fullscreen mode
- **Secure Access**: Secure system access with sudo password verification

### Code Structure

```
sistem_bakim/
├── app.py                 # Main Flask application and API endpoints
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css     # All styles and animations
│   └── js/
│       ├── app.js        # Main JavaScript application
│       └── translations.js # Multi-language translation file
└── templates/
    └── index.html        # Main HTML template
```

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/killermasterturkey/sistem-bakim-merkezi.git
cd sistem-bakim-merkezi
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the application:**
```bash
python3 app.py
```

4. **Open in your browser:**
```
http://localhost:5000
```

5. **Enter your sudo password and start managing your system!**

### Why This Project?

- **Completely Free and Open Source**: No hidden fees or limitations
- **Real-Time Monitoring**: Instant system data with Socket.IO
- **Secure**: Your sudo password is only kept in session, never saved anywhere
- **Modern Design**: Professional-looking, user-friendly interface
- **Extensible**: New features can be easily added
- **Lightweight**: Minimum system resource usage

---

<a name="deutsch"></a>
## Deutsch

### Uber das Projekt

**System Maintenance Center** ist ein umfassendes Systemwartungstool, mit dem Sie Ihre Linux-Systeme uber eine moderne Weboberflache verwalten konnen. Es bietet professionelle Funktionen wie Echtzeit-Leistungsuberwachung, automatische Bereinigung, Systemoptimierung und geplante Aufgaben.

Dieses Projekt wurde entwickelt, um die Systemwartung fur Linux-Benutzer zu vereinfachen und die Funktionalitat professioneller Systemverwaltungstools kostenlos und quelloffen bereitzustellen.

### Funktionen

- **Echtzeit-Leistungsuberwachung**: Verfolgen Sie CPU-, RAM-, Festplatten- und Netzwerknutzung mit Live-Diagrammen
- **Systembereinigung**: Automatische Bereinigung von APT-Cache, temporaren Dateien, Protokolldateien, Browser-Caches
- **Systemoptimierung**: Swappiness-, I/O-Scheduler-, Cache-Verwaltungseinstellungen
- **Geplante Aufgaben**: Automatische Wartungsaufgaben planen
- **Mehrsprachige Unterstutzung**: Turkisch, Englisch, Deutsch, Franzosisch, Russisch
- **Moderne Oberflache**: Glassmorphism-Design, dunkles Thema, Vollbildmodus
- **Sicherer Zugriff**: Sicherer Systemzugriff mit Sudo-Passwortverifizierung

### Codestruktur

```
sistem_bakim/
├── app.py                 # Haupt-Flask-Anwendung und API-Endpunkte
├── requirements.txt       # Python-Abhangigkeiten
├── static/
│   ├── css/
│   │   └── style.css     # Alle Stile und Animationen
│   └── js/
│       ├── app.js        # Haupt-JavaScript-Anwendung
│       └── translations.js # Mehrsprachige Ubersetzungsdatei
└── templates/
    └── index.html        # Haupt-HTML-Vorlage
```

### Installation

1. **Repository klonen:**
```bash
git clone https://github.com/killermasterturkey/sistem-bakim-merkezi.git
cd sistem-bakim-merkezi
```

2. **Abhangigkeiten installieren:**
```bash
pip install -r requirements.txt
```

3. **Anwendung starten:**
```bash
python3 app.py
```

4. **Im Browser offnen:**
```
http://localhost:5000
```

5. **Geben Sie Ihr Sudo-Passwort ein und beginnen Sie mit der Verwaltung Ihres Systems!**

### Warum dieses Projekt?

- **Vollig kostenlos und Open Source**: Keine versteckten Gebuhren oder Einschrankungen
- **Echtzeit-Uberwachung**: Sofortige Systemdaten mit Socket.IO
- **Sicher**: Ihr Sudo-Passwort wird nur in der Sitzung gespeichert, nirgendwo anders
- **Modernes Design**: Professionell aussehende, benutzerfreundliche Oberflache
- **Erweiterbar**: Neue Funktionen konnen leicht hinzugefugt werden
- **Leichtgewichtig**: Minimale Systemressourcennutzung

---

<a name="francais"></a>
## Francais

### A propos du projet

**System Maintenance Center** est un outil de maintenance systeme complet qui vous permet de gerer vos systemes Linux a partir d'une interface web moderne unique. Il offre des fonctionnalites professionnelles telles que la surveillance des performances en temps reel, le nettoyage automatique, l'optimisation du systeme et les taches planifiees.

Ce projet a ete developpe pour simplifier la maintenance du systeme pour les utilisateurs Linux et fournir gratuitement et en open source les fonctionnalites des outils de gestion de systeme professionnels.

### Fonctionnalites

- **Surveillance des performances en temps reel**: Suivez l'utilisation du CPU, de la RAM, du disque et du reseau avec des graphiques en direct
- **Nettoyage du systeme**: Nettoyage automatique du cache APT, des fichiers temporaires, des fichiers journaux, des caches de navigateur
- **Optimisation du systeme**: Parametres de swappiness, planificateur I/O, gestion du cache
- **Taches planifiees**: Planifier des taches de maintenance automatiques
- **Support multilingue**: Turc, Anglais, Allemand, Francais, Russe
- **Interface moderne**: Design glassmorphism, theme sombre, mode plein ecran
- **Acces securise**: Acces systeme securise avec verification du mot de passe sudo

### Structure du code

```
sistem_bakim/
├── app.py                 # Application Flask principale et points de terminaison API
├── requirements.txt       # Dependances Python
├── static/
│   ├── css/
│   │   └── style.css     # Tous les styles et animations
│   └── js/
│       ├── app.js        # Application JavaScript principale
│       └── translations.js # Fichier de traduction multilingue
└── templates/
    └── index.html        # Modele HTML principal
```

### Installation

1. **Cloner le depot:**
```bash
git clone https://github.com/killermasterturkey/sistem-bakim-merkezi.git
cd sistem-bakim-merkezi
```

2. **Installer les dependances:**
```bash
pip install -r requirements.txt
```

3. **Executer l'application:**
```bash
python3 app.py
```

4. **Ouvrir dans votre navigateur:**
```
http://localhost:5000
```

5. **Entrez votre mot de passe sudo et commencez a gerer votre systeme!**

### Pourquoi ce projet?

- **Entierement gratuit et open source**: Pas de frais caches ni de limitations
- **Surveillance en temps reel**: Donnees systeme instantanees avec Socket.IO
- **Securise**: Votre mot de passe sudo est uniquement conserve en session, jamais enregistre ailleurs
- **Design moderne**: Interface professionnelle et conviviale
- **Extensible**: De nouvelles fonctionnalites peuvent etre facilement ajoutees
- **Leger**: Utilisation minimale des ressources systeme

---

<a name="russian"></a>
## Pусский

### О проекте

**System Maintenance Center** - это комплексный инструмент обслуживания системы, который позволяет управлять вашими Linux-системами из единого современного веб-интерфейса. Он предлагает профессиональные функции, такие как мониторинг производительности в реальном времени, автоматическая очистка, оптимизация системы и запланированные задачи.

Этот проект был разработан для упрощения обслуживания системы для пользователей Linux и бесплатного предоставления функциональности профессиональных инструментов управления системой с открытым исходным кодом.

### Возможности

- **Мониторинг производительности в реальном времени**: Отслеживайте использование CPU, RAM, диска и сети с помощью живых графиков
- **Очистка системы**: Автоматическая очистка кэша APT, временных файлов, лог-файлов, кэшей браузера
- **Оптимизация системы**: Настройки swappiness, планировщик I/O, управление кэшем
- **Запланированные задачи**: Планирование автоматических задач обслуживания
- **Многоязычная поддержка**: Турецкий, Английский, Немецкий, Французский, Русский
- **Современный интерфейс**: Glassmorphism дизайн, темная тема, полноэкранный режим
- **Безопасный доступ**: Безопасный доступ к системе с проверкой пароля sudo

### Структура кода

```
sistem_bakim/
├── app.py                 # Основное приложение Flask и конечные точки API
├── requirements.txt       # Зависимости Python
├── static/
│   ├── css/
│   │   └── style.css     # Все стили и анимации
│   └── js/
│       ├── app.js        # Основное JavaScript приложение
│       └── translations.js # Многоязычный файл переводов
└── templates/
    └── index.html        # Основной HTML шаблон
```

### Установка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/killermasterturkey/sistem-bakim-merkezi.git
cd sistem-bakim-merkezi
```

2. **Установите зависимости:**
```bash
pip install -r requirements.txt
```

3. **Запустите приложение:**
```bash
python3 app.py
```

4. **Откройте в браузере:**
```
http://localhost:5000
```

5. **Введите пароль sudo и начните управлять своей системой!**

### Почему этот проект?

- **Полностью бесплатный и открытый**: Никаких скрытых платежей или ограничений
- **Мониторинг в реальном времени**: Мгновенные системные данные с Socket.IO
- **Безопасно**: Ваш пароль sudo хранится только в сессии, нигде не сохраняется
- **Современный дизайн**: Профессионально выглядящий, удобный интерфейс
- **Расширяемый**: Новые функции можно легко добавить
- **Легкий**: Минимальное использование системных ресурсов

---

## Screenshots / Ekran Goruntuleri

### Login Screen / Giris Ekrani
![Login](screenshots/login.png)

### Dashboard / Kontrol Paneli
![Dashboard](screenshots/dashboard.png)

### Performance Monitoring / Performans Izleme
![Performance](screenshots/performance.png)

---

## Developer / Gelistirici

**Killer Master TURKEY**
- Email: killermasterturkey@gmail.com
- GitHub: [@killermasterturkey](https://github.com/killermasterturkey)

## License / Lisans

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Bu proje MIT Lisansi altinda lisanslanmistir - detaylar icin [LICENSE](LICENSE) dosyasina bakiniz.

---

<div align="center">

**Made with love for the Linux community**

</div>
