const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { spawn, execSync } = require('child_process');

let mainWindow;
let splashWindow;
let backendProcess;
let isAppQuitting = false;

function createSplash() {
    splashWindow = new BrowserWindow({
        width: 420,
        height: 220,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const splashPath = path.join(__dirname, 'frontend', 'ggastos', 'splash.html');
    if (fs.existsSync(splashPath)) {
        splashWindow.loadFile(splashPath);
    } else {
        splashWindow.loadURL('data:text/html,<h3>Carregando GGastos...</h3>');
    }
}

function runCommand(command, cwd, env = {}) {
    console.log(`
>> ${command} (${cwd})`);
    execSync(command, { stdio: 'inherit', cwd, env: { ...process.env, ...env } });
}

function getBundledJavaHome() {
    // When the app is packaged with electron-builder, we can ship a JRE under:
    //  - Windows: resources/app.asar.unpacked/jre
    //  - Dev: electron/jre
    const candidate = app.isPackaged
        ? path.join(process.resourcesPath, 'app.asar.unpacked', 'jre')
        : path.join(__dirname, 'jre');

    const javaBin = process.platform === 'win32' ? path.join('bin', 'java.exe') : path.join('bin', 'java');
    const javaPath = path.join(candidate, javaBin);

    return fs.existsSync(javaPath) ? candidate : null;
}

function resolveJavaExecutable(javaPath) {
    try {
        return fs.realpathSync(javaPath);
    } catch {
        return javaPath;
    }
}

function findJavaExecutableInHome(javaHome) {
    if (!javaHome) return null;
    const javaBin = process.platform === 'win32' ? 'java.exe' : 'java';
    const candidate = path.join(javaHome, 'bin', javaBin);
    return fs.existsSync(candidate) ? candidate : null;
}

function guessJavaExecutable() {
    // 1) Prefer the bundled JRE (if we shipped one in the installer)
    const bundledHome = getBundledJavaHome();
    const bundledExec = findJavaExecutableInHome(bundledHome);
    if (bundledExec) {
        return bundledExec;
    }

    // 2) Use JAVA_HOME if set
    if (process.env.JAVA_HOME) {
        const exec = findJavaExecutableInHome(process.env.JAVA_HOME);
        if (exec) {
            return exec;
        }
    }

    // 3) Locate `java` via PATH (where/which)
    try {
        const whichCmd = process.platform === 'win32' ? 'where java' : 'which java';
        const javaPath = execSync(whichCmd, { encoding: 'utf8' })
            .split(/\r?\n/)
            .find(Boolean);

        if (javaPath) {
            const resolved = resolveJavaExecutable(javaPath.trim());
            if (fs.existsSync(resolved)) {
                return resolved;
            }

            // Common case on Windows: PATH points to the "javapath" shim folder.
            // Try to resolve an actual Java home from the parent directories.
            const possibleHome = path.dirname(path.dirname(resolved));
            const candidate = findJavaExecutableInHome(possibleHome);
            if (candidate) {
                return candidate;
            }
        }
    } catch {
        // ignore
    }

    // 4) Fallback: scan well-known Java install directories on Windows
    if (process.platform === 'win32') {
        const programFiles = [process.env['PROGRAMFILES'], process.env['PROGRAMFILES(X86)']].filter(Boolean);
        for (const base of programFiles) {
            const javaDirs = fs.existsSync(base)
                ? fs.readdirSync(base).filter(d => /^Java/.test(d) || /^jre/.test(d) || /^jdk/.test(d))
                : [];
            for (const dir of javaDirs) {
                const home = path.join(base, dir);
                const exec = findJavaExecutableInHome(home);
                if (exec) {
                    return exec;
                }
            }
        }
    }

    return null;
}

function ensureFrontendBuild() {
    const expectedIndex = path.join(__dirname, 'frontend', 'ggastos', 'index.html');
    if (fs.existsSync(expectedIndex)) {
        return;
    }

    const frontendRoot = path.resolve(__dirname, '..', 'GGastos-web');
    console.log('Frontend build not found. Running Angular build...');
    runCommand('npm install', frontendRoot);
    // Build for file:// serving (relative asset paths)
    runCommand('npm run build -- --base-href ./ --deploy-url ./', frontendRoot);

    const distPath = path.join(frontendRoot, 'dist');
    const targetPath = path.join(__dirname, 'frontend');
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(targetPath, { recursive: true });

    // Angular output contains a folder named after the project (ggastos)
    const builtFolder = path.join(distPath, 'ggastos');
    if (!fs.existsSync(builtFolder)) {
        throw new Error(`Expected Angular build output not found at ${builtFolder}`);
    }

    fs.cpSync(builtFolder, path.join(targetPath, 'ggastos'), { recursive: true });
}

function getBackendJarPath() {
    const devJar = path.join(__dirname, 'backend', 'app.jar');

    // During development we expect the backend jar next to main.js
    if (!app.isPackaged) {
        return fs.existsSync(devJar) ? devJar : null;
    }

    // Packaged app (ASAR): backend is unpacked to resources/app.asar.unpacked
    const unpackedJar = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'app.jar');
    if (fs.existsSync(unpackedJar)) {
        return unpackedJar;
    }

    // Fallback: check inside ASAR (may not work with java)
    const insideAsar = path.join(process.resourcesPath, 'app.asar', 'backend', 'app.jar');
    if (fs.existsSync(insideAsar)) {
        return insideAsar;
    }

    return null;
}

function getAppRootPath() {
    // When packaged, resources are located under resources/app.asar.unpacked
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'app.asar.unpacked');
    }

    // During development, the electron folder is the root
    return path.resolve(__dirname);
}

function getUserDataPath() {
    return app.getPath('userData');
}

function ensureUserDataDataFolder() {
    const userData = getUserDataPath();
    const dataFolder = path.join(userData, 'data');

    if (fs.existsSync(dataFolder)) {
        return dataFolder;
    }

    // First run: copy seeded data from the app package (if present)
    const seedFolder = path.join(getAppRootPath(), 'data');
    if (fs.existsSync(seedFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
        fs.cpSync(seedFolder, dataFolder, { recursive: true });
        console.log('Copied initial data to userData folder:', dataFolder);
        return dataFolder;
    }

    // Create an empty folder if no seed exists.
    fs.mkdirSync(dataFolder, { recursive: true });
    return dataFolder;
}

function waitForPort(port, host = '127.0.0.1', timeoutMs = 20000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const attempt = () => {
            const socket = net.connect({ port, host }, () => {
                socket.destroy();
                resolve();
            });

            socket.on('error', () => {
                socket.destroy();
                if (Date.now() - start >= timeoutMs) {
                    reject(new Error(`Timeout waiting for ${host}:${port}`));
                } else {
                    setTimeout(attempt, 250);
                }
            });
        };
        attempt();
    });
}

function ensureBackendBuild() {
    const jarPath = getBackendJarPath();
    if (jarPath) {
        return jarPath;
    }

    if (app.isPackaged) {
        console.warn('Backend jar not found in packaged app; backend will not start.');
        return null;
    }

    const backendRoot = path.resolve(__dirname, '..', 'ggastos-service');
    console.log('Backend jar not found. Attempting Maven build...');

    try {
        const mvnCmd = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';
        const mvnExecutable = fs.existsSync(path.join(backendRoot, mvnCmd)) ? mvnCmd : 'mvn';
        const javaExe = guessJavaExecutable();
        if (!javaExe) {
            throw new Error('Java not found (set JAVA_HOME or ensure java is on PATH).');
        }

        const javaHome = path.dirname(path.dirname(javaExe));
        runCommand(`${mvnExecutable} clean package -DskipTests`, backendRoot, { JAVA_HOME: javaHome });

        const targetDir = path.join(backendRoot, 'target');
        const jars = fs.readdirSync(targetDir).filter(f => f.endsWith('.jar'));
        const jarFile = jars.find(f => f.includes('SNAPSHOT')) || jars.find(f => !f.endsWith('-sources.jar'));
        if (!jarFile) {
            throw new Error('No jar file found after Maven build');
        }

        fs.rmSync(path.join(__dirname, 'backend'), { recursive: true, force: true });
        fs.mkdirSync(path.join(__dirname, 'backend'), { recursive: true });
        fs.copyFileSync(path.join(targetDir, jarFile), jarPath);

        return jarPath;
    } catch (err) {
        console.warn('Could not build backend jar:', err.message);
        console.warn('The Electron app will start without the backend.');
        return null;
    }
}

function showBackendError(title, message) {
    console.error(title, message);
    try {
        // Only show a dialog when running in a graphical environment
        if (app && app.isReady()) {
            dialog.showErrorBox(title, message);
        }
    } catch {
        // ignore
    }
}

function startBackend() {
    const jarPath = ensureBackendBuild();
    if (!jarPath) {
        const msg = 'Backend JAR not found; backend will not start. The UI will run without backend functionality.';
        console.warn(msg);
        showBackendError('Backend não encontrado', msg);
        return null;
    }

    console.log('Backend JAR found at:', jarPath);

    const javaExecutable = guessJavaExecutable();
    if (!javaExecutable) {
        const msg = 'Java not found (set JAVA_HOME or ensure java is on PATH). Backend will not start.';
        console.warn(msg);
        showBackendError('Java não encontrado', msg);
        return null;
    }

    const javaHome = path.dirname(path.dirname(javaExecutable));
    console.log('Using Java home:', javaHome);

    const bundledJava = getBundledJavaHome();
    if (bundledJava) {
        console.log('Using bundled JRE at:', bundledJava);
    }

    // Ensure user data folder is created (and seeded) before starting the backend.
    const userData = getUserDataPath();
    const userDataData = ensureUserDataDataFolder();

    const dbPath = path.join(userDataData, 'ggastos').replace(/\\/g, '/');

    // Use H2 embedded mode with AUTO_SERVER to allow reopening the database if another
    // process/previous instance kept it locked (helps avoid "Database may be already in use").
    const springDatasourceUrl = `jdbc:h2:file:${dbPath};AUTO_SERVER=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=TRUE;`;

    backendProcess = spawn(javaExecutable, ['-jar', jarPath], {
        cwd: getAppRootPath(),
        env: {
            ...process.env,
            JAVA_HOME: javaHome,
            SPRING_DATASOURCE_URL: springDatasourceUrl,
            SPRING_DATASOURCE_USERNAME: 'sa',
            SPRING_DATASOURCE_PASSWORD: '',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    backendProcess.on('error', (err) => {
        console.error('Failed to start backend process:', err);
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`BACKEND: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`BACKEND ERROR: ${data}`);
    });

    backendProcess.on('exit', (code, signal) => {
        console.log(`Backend process exited (code=${code}, signal=${signal})`);
        if (isAppQuitting) {
            console.log('App está saindo; ignorando mensagem de erro de backend encerrado.');
            return;
        }

        if (code !== 0) {
            showBackendError('Backend encerrou inesperadamente', `O processo Java terminou com código ${code} (sinal: ${signal}). Verifique os logs para mais detalhes.`);
        }
    });

    return backendProcess;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // After build, Angular output is copied to electron/frontend/ggastos
    // (see build.js copying dist/ggastos --> electron/frontend)
    const indexPath = path.join(__dirname, 'frontend', 'ggastos', 'index.html');

    try {
        mainWindow.loadFile(indexPath);
    } catch (err) {
        console.error('Failed to load index.html from', indexPath, err);
    }

    // Help debugging a white screen by logging renderer console messages in the main process
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        console.log(`RENDERER (${level}) ${sourceId}:${line} - ${message}`);
    });

    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Renderer finished loading:', indexPath);

        if (splashWindow && !splashWindow.isDestroyed()) {
            splashWindow.close();
            splashWindow = null;
        }

        mainWindow.show();

        // Capture renderer DOM at load time for debugging a blank screen
        mainWindow.webContents.executeJavaScript(`(function() {
            const body = document.body;
            return {
                innerHtml: body ? body.innerHTML : null,
                innerText: body ? body.innerText : null,
                title: document.title,
                location: window.location.href
            };
        })();`).then((snapshot) => {
            console.log('RENDERER DOM snapshot:', snapshot);
        }).catch(err => {
            console.error('Failed to capture renderer snapshot:', err);
        });
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('Failed to load renderer URL:', validatedURL, errorCode, errorDescription);
    });

    // Open devtools by default to inspect errors (remove in production)
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(async () => {
    createSplash();
    startBackend();

    // Ensure the frontend is built before loading it into the window
    try {
        ensureFrontendBuild();
    } catch (err) {
        console.error('Failed to prepare frontend build:', err);
    }

    // Wait for the backend to start responding before opening the UI.
    // This helps avoid connection-refused errors while Spring Boot is still starting.
    try {
        await waitForPort(8081, '127.0.0.1', 20000);
        console.log('Backend is reachable at http://localhost:8081');
    } catch (err) {
        console.warn('Backend did not respond within timeout; the UI may show connection errors.', err);
        showBackendError(
            'Backend não iniciou',
            'O backend não respondeu em 20 segundos. Verifique se o Java está instalado corretamente e se não há outro processo usando a porta 8081.'
        );
    }

    createWindow();
});

app.on('before-quit', () => {
    isAppQuitting = true;
    if (backendProcess) {
        backendProcess.kill();
    }
});