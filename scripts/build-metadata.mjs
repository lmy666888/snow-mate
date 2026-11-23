import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve,dirname } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const version=readFileSync(resolve(root,'VERSION'),'utf8').trim();
let sha=process.env.GITHUB_SHA?.slice(0,7)??'unknown';
try{sha=execFileSync('git',['rev-parse','--short=7','HEAD'],{cwd:root}).toString().trim();}catch{/* Source archives have no Git. */}
const [major,minor]=version.split('.');
const value={version,milestone:`M${major}.${minor}`,sha,development:version.includes('-')};
const directory=resolve(root,'apps/mobile/src/generated');mkdirSync(directory,{recursive:true});
writeFileSync(resolve(directory,'build.json'),JSON.stringify(value,null,2)+'\n');
console.log(`Build metadata: ${value.milestone} ${version} ${sha}`);
