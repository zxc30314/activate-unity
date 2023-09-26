const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');
const unity = require('./unity');
const fs = require('fs');
async function run() {
    try {
        const unityPath = core.getInput('unity-path') || process.env.UNITY_PATH;
        if (!unityPath) {
            throw new Error('unity path not found');
        }
        const unityUsername = core.getInput('unity-username', { required: true });
        const unityPassword = core.getInput('unity-password', { required: true });
        const unityAuthenticatorKey = core.getInput('unity-authenticator-key');
        const unitySerial = core.getInput('unity-serial');
        const unityAlfPath = core.getInput('unity-alf-path');

        if (unitySerial) {
            await unity.activateSerialLicense(unityPath, unityUsername, unityPassword, unitySerial);
        } else {
            await exec.exec('npm install puppeteer@"^13.x"', [], { cwd: path.join(__dirname, '..') }); // install puppeteer for current platform
            const licenseRobot = require('./license-robot');
           // const licenseRequestFile = await unity.createManualActivationFile(unityPath);
            const licenseData = await licenseRobot.getPersonalLicense(unityAlfPath, unityUsername, unityPassword, unityAuthenticatorKey);
            fs.appendFileSync(process.env.GITHUB_ENV, `${ULF}=${licenseData}\n`, 'utf8');
            // await unity.activateManualLicense(unityPath, licenseData);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

