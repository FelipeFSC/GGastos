const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, cwd, env = {}) {
    console.log(`\n>> ${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd, env: { ...process.env, ...env } });
}

function guessJavaHome() {
    if (process.env.JAVA_HOME) {
        return process.env.JAVA_HOME;
    }

    try {
        const whichCmd = process.platform === 'win32' ? 'where java' : 'which java';
        const javaPath = execSync(whichCmd, { encoding: 'utf8' })
            .split(/\r?\n/)
            .find(Boolean);
        if (!javaPath) return null;

        // java binary lives in JAVA_HOME/bin/java
        return path.dirname(path.dirname(javaPath.trim()));
    } catch {
        return null;
    }
}

// caminhos
const root = path.resolve(__dirname, '..');

const frontend = path.join(root, 'GGastos-web');
const backend = path.join(root, 'ggastos-service');

const electronFrontend = path.join(__dirname, 'frontend');
const electronBackend = path.join(__dirname, 'backend');

// 1. build Angular (relative paths for Electron)
run('npm run build -- --base-href ./ --deploy-url ./', frontend);

// 2. build Spring (use Maven wrapper if available)
const mvnCmd = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';
const mvnExecutable = fs.existsSync(path.join(backend, mvnCmd)) ? mvnCmd : 'mvn';

const javaHome = guessJavaHome();
if (!javaHome) {
    console.warn('Java not found (set JAVA_HOME or ensure java is on PATH). Skipping backend build.');
} else {
    try {
        run(`${mvnExecutable} clean package`, backend, { JAVA_HOME: javaHome });
    } catch (err) {
        console.warn('Backend build failed:', err.message);
        console.warn('Continuing without packaging backend jar.');
    }
}

// 3. copiar frontend
fs.rmSync(electronFrontend, { recursive: true, force: true });
fs.mkdirSync(electronFrontend, { recursive: true });

const distPath = path.join(frontend, 'dist');
fs.cpSync(distPath, electronFrontend, { recursive: true });

// 4. copiar backend jar
fs.rmSync(electronBackend, { recursive: true, force: true });
fs.mkdirSync(electronBackend, { recursive: true });

const targetDir = path.join(backend, 'target');
const jars = fs.existsSync(targetDir)
    ? fs.readdirSync(targetDir).filter(f => f.endsWith('.jar'))
    : [];
const jarFile = jars.find(f => f.includes('SNAPSHOT')) || jars.find(f => !f.endsWith('-sources.jar'));
if (jarFile) {
    fs.copyFileSync(path.join(targetDir, jarFile), path.join(electronBackend, 'app.jar'));
} else {
    console.warn('Backend JAR not found; skipping copy. The Electron app will start without backend functionality.');
}

// 5. copiar banco de dados (H2)
const dataSource = path.join(root, 'data');
const dataDest = path.join(__dirname, 'data');

if (!fs.existsSync(dataDest)) {
    fs.cpSync(dataSource, dataDest, { recursive: true });
    console.log('📁 Pasta data copiada!');
} else {
    console.log('📁 Pasta data já existe, mantendo dados do usuário');
}

console.log('\n✅ Build finalizado!');
