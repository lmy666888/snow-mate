import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const git = (...args) => execFileSync('git', args, { maxBuffer: 64 * 1024 * 1024 });
const files = [...new Set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z').toString().split('\0').filter(Boolean))];
const patterns = [
 ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
 ['github-token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
 ['provider-secret', /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b|\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
 ['jwt-token', /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/],
 ['credential-url', /(?:postgres(?:ql)?|https?):\/\/[^\s/:]+:[^\s/@]{3,}@/],
 ['literal-credential', /(?:api_key|service_role_key|access_token|client_secret|password)\s*[:=]\s*["'][A-Za-z0-9_+/=-]{16,}["']/i],
];
let problems = []; let checked = 0;
function scan(data, name) {
 if (data.includes(0)) return;
 const value = data.toString('utf8');
 for (const [label, pattern] of patterns) if (pattern.test(value)) problems.push(`${name}: ${label} (value redacted)`);
 checked++;
}
for (const file of files) {
 if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
 if (/(^|\/)(node_modules|\.local|\.expo|dist(?:-ios)?|build|coverage)(\/|$)|(^|\/)\.env(?!\.example$)|\.(pem|key|p12|pfx)$/.test(file)) problems.push(`${file}: forbidden commit artifact`);
 const data = fs.readFileSync(file);
 if (data.length > 5 * 1024 * 1024) problems.push(`${file}: exceeds 5 MiB review threshold`);
 scan(data, file);
}
const commits = git('rev-list', '--all').toString().trim().split('\n').filter(Boolean);
const objects = new Set();
for (const commit of commits) {
 const entries = git('ls-tree', '-r', '--format=%(objecttype) %(objectname) %(path)', commit).toString().trim().split('\n');
 for (const entry of entries) {
  const match = entry.match(/^blob ([a-f0-9]+) (.+)$/); if (!match || objects.has(match[1])) continue;
  objects.add(match[1]); scan(git('cat-file', 'blob', match[1]), `history ${commit.slice(0,7)}:${match[2]}`);
 }
}
console.log(`Scanned ${files.length} intended files; ${commits.length} commits / ${objects.size} distinct historical blobs; ${checked} text buffers.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('PASS: no credential signatures, forbidden artifacts, or oversized files detected. This bounded scanner is not a guarantee against every secret format.');
