// One-shot setup: node setup.js   (set ADMOB_APP_ID first for the real app id; default is Google's TEST id)
const { execSync } = require('child_process'), fs = require('fs');
const run = c => { console.log('> ' + c); execSync(c, { stdio: 'inherit' }); };
const ADMOB_APP_ID = process.env.ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713';
run('npm install');
if (!fs.existsSync('android')) run('npx cap add android');
run('npx cap sync android');
const mf = 'android/app/src/main/AndroidManifest.xml';
let x = fs.readFileSync(mf, 'utf8');
if (!x.includes('com.google.android.gms.ads.APPLICATION_ID'))
  x = x.replace('</application>', '    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="' + ADMOB_APP_ID + '"/>\n    </application>');
else x = x.replace(/(com\.google\.android\.gms\.ads\.APPLICATION_ID"\s+android:value=")[^"]*/, '$1' + ADMOB_APP_ID);
if (!x.includes('permission.AD_ID')) x = x.replace('</manifest>', '    <uses-permission android:name="com.google.android.gms.permission.AD_ID"/>\n</manifest>');
if (!x.includes('screenOrientation')) x = x.replace('<activity', '<activity android:screenOrientation="portrait"');
fs.writeFileSync(mf, x);
try { run('npx @capacitor/assets generate --android'); } catch (e) { console.log('icon generation skipped'); }
console.log('\nDONE. Next: npx cap open android  (then build in Android Studio)');
