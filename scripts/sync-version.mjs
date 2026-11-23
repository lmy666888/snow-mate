import fs from 'node:fs';
const version = fs.readFileSync('VERSION', 'utf8').trim();
if (!/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(version)) throw new Error('Invalid VERSION');
for (const file of ['package.json','apps/mobile/package.json']) {
 const value = JSON.parse(fs.readFileSync(file, 'utf8'));
 if (process.argv.includes('--check')) { if (value.version !== version) throw new Error(`${file} must be synchronized from VERSION`); }
 else { value.version = version; fs.writeFileSync(file, JSON.stringify(value,null,2)+'\n'); }
}
console.log(`VERSION ${version}: ${process.argv.includes('--check') ? 'checked' : 'synchronized'}`);
