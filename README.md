# Ramayana (2026) - Web Cinema Player 🎬

Aapki local video file ke liye ek modern, full-featured OTT/Cinema style web player ready hai!

## 📁 Files:
- [index.html](file:///C:/Users/HP/Downloads/Ramayana/index.html) - Main Cinema Web Player (HTML5 UI)
- [style.css](file:///C:/Users/HP/Downloads/Ramayana/style.css) - Modern Dark OTT Theme styling
- [app.js](file:///C:/Users/HP/Downloads/Ramayana/app.js) - Player controls, keyboard shortcuts, scrubbing logic
- [server.js](file:///C:/Users/HP/Downloads/Ramayana/server.js) - High-speed local Node.js streaming server (HTTP 206 Partial Content / Range support)
- [server.py](file:///C:/Users/HP/Downloads/Ramayana/server.py) - Python 3 alternative streaming server
- [start_player.bat](file:///C:/Users/HP/Downloads/Ramayana/start_player.bat) - 1-Click launcher (double-click to start server & open browser)

---

## 🚀 Kaise Chalayein (How to Run):

### Tarika 1: 1-Click Launcher (Sabse best aur fast)
1. Is folder mein **`start_player.bat`** file par double click karein.
2. Ye automatically local server start karke browser mein player open kar dega (`http://localhost:3000`).
3. 3.6 GB ki video bina lag ke turant seek aur play hogi.

### Tarika 2: Direct Browser Open
1. **`index.html`** file ko apne browser (Chrome/Edge) mein direct double click karke open karein.
2. Agar browser direct MKV link restrict kare, to page par diye gaye **"📁 Select Ramayana File"** button par click karke folder se apni `.mkv` file select karein ya drag & drop karein.

---

## ⌨️ Keyboard Shortcuts:
- **Space / K**: Play / Pause
- **Left / Right Arrow**: 10 seconds rewind / forward
- **Up / Down Arrow**: Volume increase / decrease
- **F**: Fullscreen toggle
- **T**: Theater Mode toggle
- **M**: Mute / Unmute
- **0 - 9**: Jump directly to 0% - 90% of the movie
