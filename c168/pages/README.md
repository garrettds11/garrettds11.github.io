# SimpleTTS v0.1

**SimpleTTS** is a minimal text-to-speech application with both **local** and **cloud** modes.

- 🧩 **Local (offline) mode** — Flask + pyttsx3 + pydub.  
  Generates speech on your own machine using system voices.  
- ☁️ **Cloud mode** — AWS Lambda + Polly + S3.  
  Produces high-quality speech in the cloud and returns a presigned URL.

The **frontend** (plain HTML/CSS/JS) can talk to either one—just change the API base URL.

---

## 🧱 Project structure

```

simpletts/
├─ frontend/
│  ├─ index.html          # shared UI for local + cloud
│  └─ style.css           # modern responsive styling
├─ local/
│  ├─ app.py              # Flask API: /api/speak and /api/pull
│  └─ requirements.txt    # Flask, pyttsx3, pydub, Flask-CORS
└─ cloud/
├─ lambda_handler.py   # AWS Lambda using Polly + S3
├─ requirements.txt    # boto3 only
└─ template-sam.yaml   # optional SAM deployment template

````

---

## 🚀 Run locally (offline mode)

### 1. Clone the repo and open a shell
```bash
git clone https://github.com/<your-username>/SimpleTTS.git
cd SimpleTTS/local
````

### 2. Create and activate a virtual environment

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
# If PowerShell blocks activation:
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Install ffmpeg (needed for MP3 export)

* **Windows (Chocolatey)**
  `choco install ffmpeg`
* **macOS (Homebrew)**
  `brew install ffmpeg`
* **Ubuntu/Debian**
  `sudo apt-get install ffmpeg`

### 5. Run the Flask server

```powershell
python app.py
```

You should see:

```
* Running on http://127.0.0.1:5000
```

### 6. Open the frontend

From another terminal:

```powershell
cd ..\frontend
python -m http.server 5500
```

Then visit **[http://127.0.0.1:5500/index.html](http://127.0.0.1:5500/index.html)**

Click **Speak** for playback or **Download MP3** to save audio.

---

## ☁️ Run in the cloud (optional)

1. Install **AWS CLI** and **SAM CLI**, then configure your AWS credentials.
2. From `cloud/`, deploy with:

   ```bash
   sam build
   sam deploy --guided
   ```
3. Provide a unique S3 bucket for audio.
4. After deployment, copy the printed **API endpoint**.
5. In the browser console on `index.html`, set it:

   ```js
   localStorage.setItem('apiBase','https://<api-id>.execute-api.<region>.amazonaws.com');
   ```
6. Refresh the page—SimpleTTS now speaks via AWS Polly.

---

## ⚙️ Dependencies (SBOM v0.1)

| Component             | Version    | Purpose                           |
| --------------------- | ---------- | --------------------------------- |
| Python                | 3.11 +     | Runtime                           |
| Flask                 | 3.0.3      | Web framework                     |
| Flask-CORS            | 4.0.0      | CORS support for browser requests |
| pyttsx3               | 2.90       | Local TTS engine                  |
| pydub                 | 0.25.1     | Audio export to MP3               |
| ffmpeg                | system pkg | MP3 encoder                       |
| boto3                 | 1.34.162   | (cloud) AWS SDK                   |
| AWS Lambda, Polly, S3 | services   | Cloud speech API                  |

---

## 🧩 Endpoints

| Route        | Method | Description                                         |
| ------------ | ------ | --------------------------------------------------- |
| `/api/speak` | POST   | Returns WAV audio (local) or `{ audioUrl }` (cloud) |
| `/api/pull`  | GET    | Returns MP3; add `?download=1` to force download    |
| `/health`    | GET    | Simple 200 OK for health checks                     |

---

## 💡 Tips

* If “Failed to fetch,” ensure Flask is running and CORS is permissive.
* Serve `index.html` over HTTP (not file://) to avoid browser CORS.
* Adjust playback delay in `index.html` (`setTimeout(..., 500)`) for smoother starts.
* Add or swap voices using the system TTS engine (see `app.py`).

---

## 🏷 Version

**SimpleTTS v0.1**
*MVP with offline Flask API, MP3 download, and shared frontend.*

```
