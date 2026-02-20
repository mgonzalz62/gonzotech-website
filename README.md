# 🌐 GonzoTech.us | Command Center

Welcome to the official repository for **GonzoTech.us**. This is a lightweight, high-performance tech portal hosted on **Cloudflare Pages**, designed with a "Command Center" aesthetic featuring a Teal, Black, and Midnight Blue color scheme.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Variables)
- **Logic:** Vanilla JavaScript (ES6+)
- **Data:** JSON-driven content management
- **Hosting:** Cloudflare Pages
- **Deployment:** GitHub Actions / Automatic Sync

---

## 📂 File Structure & Purpose

| File | Description |
| :--- | :--- |
| `index.html` | The core structure. It contains the containers that JavaScript fills with data. |
| `style.css` | The global stylesheet. Defines the Midnight Blue theme and Teal accents. |
| `script.js` | The "brain" of the site. Handles tab switching, the live clock, system vitals, and fetching JSON data. |
| `data.json` | **The Content Hub.** This is the only file you need to edit to update projects or logs. |

---

## 🚀 How to Update Content

You do **not** need to touch the HTML to update the site content. Follow these steps:

1. Open `data.json`.
2. **To Add a Project:** Add a new object to the `"projects"` array.
3. **To Update Logs:** Add a new entry to the `"system_logs"` array.
4. **Commit Changes:** Once you save and commit to GitHub, Cloudflare Pages will automatically rebuild the site in ~60 seconds.



---

## 🖥️ Local Development

To view the site locally on your computer:
1. Clone the repository.
2. Open `index.html` in your browser.
   * *Note:* Because the site uses the `fetch()` API for the JSON file, some browsers (like Chrome) may block the data from loading for security. For the best local experience, use a "Live Server" extension in VS Code or upload to GitHub.

---

## 📡 System Status
- **UI:** Responsive (Mobile Optimized)
- **Uplink:** Secure
- **Data Source:** Local JSON
