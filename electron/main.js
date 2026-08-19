const {app, BrowserWindow} = require("electron");
const {spawn} = require("child_process");
const path = require("path");

let backendProcess = null;

function getPythonPath() {
  if (process.platform === "win32") {
    return path.join(__dirname, "..", ".venv", "Scripts", "python.exe");
  }

  return path.join(__dirname, "..", ".venv", "bin", "python");
}

function startBackend(){
  const pythonPath = getPythonPath();

  backendProcess = spawn(
    pythonPath, ["-m", "uvicorn", "app.main:app"],
    {
      cwd: path.join(__dirname, ".."),
      shell: false
    }
  );

  backendProcess.stdout.on("data", (data) => {
    console.log(`backend: ${data}`);
  });

backendProcess.stderr.on("data", (data) => {
    console.error(`backend error: ${data}`);
  });

}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
  });

  mainWindow.maximize()

  mainWindow.loadURL("http://127.0.0.1:8000");
}

app.whenReady().then(() => {
  startBackend();

  setTimeout(() => {
    createWindow();
  }, 1500)
});

app.on("before-quit", () => {
    if (backendProcess) {
        backendProcess.kill();
    }
});