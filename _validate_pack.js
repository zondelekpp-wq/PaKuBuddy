#!/usr/bin/env node
/* Checks school/packs.json before publishing.  Usage: node _validate_pack.js   → prints OK or a list of problems. */
const fs=require('fs'),path=require('path');
const here=__dirname,errs=[];
const html=fs.readFileSync(path.join(here,'index.html'),'utf8');
let pack;try{pack=JSON.parse(fs.readFileSync(path.join(here,'school/packs.json'),'utf8'));}catch(e){console.log('packs.json is not valid JSON: '+e.message);process.exit(1);}
const bundledEx=new Set([...html.matchAll(/\{id:'([a-z0-9]+)',sub:'/g)].map(m=>m[1]));
const bundledSub=new Set([...html.matchAll(/\{id:'([a-z]+)',e:'[^']+',bg:'#[0-9A-Fa-f]{6}',en:\['/g)].map(m=>m[1]));
const figIds=new Set([...html.matchAll(/\{id:'([a-z0-9]+)',era:'/g)].map(m=>m[1]));
if(!Number.isInteger(pack.v)||pack.v<1)errs.push('v must be a whole number ≥ 1');
['subjects','exhibits','newIds'].forEach(k=>{if(!Array.isArray(pack[k]))errs.push(k+' must be a list');});
if(typeof pack.figs!=='object'||Array.isArray(pack.figs))errs.push('figs must be an object');
const subs=new Set(bundledSub),seen=new Set();
(pack.subjects||[]).forEach((s,i)=>{const w=`subject ${s.id||i}`;
  if(!/^[a-z]+$/.test(s.id||''))errs.push(w+': id must be lowercase letters');
  if(bundledSub.has(s.id))errs.push(w+': already exists in the app');
  if(!s.e||!/^#[0-9A-Fa-f]{6}$/.test(s.bg||''))errs.push(w+': needs e (emoji) and bg (#RRGGBB)');
  ['en','pl'].forEach(L=>{if(!Array.isArray(s[L])||s[L].length!==2||!s[L][0]||!s[L][1])errs.push(`${w}: ${L} must be [name, intro]`);});
  subs.add(s.id);});
function tagBalance(svg){const st=[];const re=/<\/?([a-zA-Z]+)[^>]*?(\/?)>/g;let m;
  while((m=re.exec(svg))){const t=m[1],close=m[0][1]==='/',self=m[2]==='/';if(self)continue;if(close){if(st.pop()!==t)return false;}else st.push(t);}return st.length===0;}
(pack.exhibits||[]).forEach((x,i)=>{const w=`exhibit ${x.id||i}`;
  if(!/^[a-z0-9]+$/.test(x.id||''))errs.push(w+': id must be lowercase letters/digits');
  if(bundledEx.has(x.id))errs.push(w+': id already exists in the app');
  if(seen.has(x.id))errs.push(w+': duplicate id in pack');seen.add(x.id);
  if(!subs.has(x.sub))errs.push(w+`: unknown subject "${x.sub}"`);
  if(x.sub==='history')errs.push(w+': history room has no exhibits (it opens the time machine)');
  if(!Number.isInteger(x.y))errs.push(w+': y must be a whole year (negative = BC)');
  if(!x.e||!/^#[0-9A-Fa-f]{6}$/.test(x.bg||''))errs.push(w+': needs e and bg');
  if(typeof x.svg!=='string'||!x.svg.includes('data-p='))errs.push(w+': svg needs <g data-p="..."> parts');
  else{if(!tagBalance(x.svg))errs.push(w+': svg tags are not balanced');
    if(/<script|on[a-z]+=|href=|xlink:|<image|<foreignObject|url\(http/i.test(x.svg))errs.push(w+': svg must not contain scripts, links, external images or event handlers');}
  const svgP=[...(x.svg||'').matchAll(/data-p="([a-z0-9]+)"/g)].map(m=>m[1]);
  if(new Set(svgP).size!==svgP.length)errs.push(w+': a data-p name is used twice');
  ['en','pl'].forEach(L=>{const d=x[L],wl=`${w} ${L}`;if(!d){errs.push(wl+': missing');return;}
    ['n','w','who','i'].forEach(k=>{if(typeof d[k]!=='string'||!d[k].trim())errs.push(`${wl}: ${k} missing`);});
    if(!Array.isArray(d.m)||d.m.length<2||d.m.some(a=>!Array.isArray(a)||a.length!==3))errs.push(wl+': m must be 2–4 [emoji, material, why]');
    if(!Array.isArray(d.s)||d.s.length<3||d.s.some(a=>!Array.isArray(a)||a.length!==2))errs.push(wl+': s must be 3–5 [text, "parts"]');
    if(!d.p||typeof d.p!=='object')errs.push(wl+': p missing');
    if(!Array.isArray(d.q)||d.q.length!==5||d.q.some(t=>typeof t!=='string'||!t))errs.push(wl+': q must be [question, correct, wrong, wrong, explanation]');
    const ps=Object.keys(d.p||{});ps.forEach(p=>{if(!svgP.includes(p))errs.push(`${wl}: part "${p}" not in svg`);if(!Array.isArray(d.p[p])||d.p[p].length!==2)errs.push(`${wl}: part "${p}" must be [name, text]`);});
    svgP.forEach(p=>{if(!ps.includes(p))errs.push(`${wl}: svg part "${p}" has no description`);});
    const stepP=(d.s||[]).flatMap(s=>(s[1]||'').split(' ').filter(Boolean));
    stepP.forEach(p=>{if(!svgP.includes(p))errs.push(`${wl}: step part "${p}" not in svg`);});
    svgP.forEach(p=>{if(!stepP.includes(p))errs.push(`${wl}: part "${p}" never appears in the steps`);});
    const all=JSON.stringify(d);if(/<|>/.test(all))errs.push(wl+': texts must not contain < or >');});
  if(x.en&&x.pl&&JSON.stringify(Object.keys(x.en.p||{}))!==JSON.stringify(Object.keys(x.pl.p||{})))errs.push(w+': en and pl parts differ');
});
Object.entries(pack.figs||{}).forEach(([s,l])=>{if(!subs.has(s))errs.push(`figs: unknown subject "${s}"`);
  (l||[]).forEach(f=>{if(!Array.isArray(f)||f.length!==2||!figIds.has(f[0])||!Number.isInteger(f[1]))errs.push(`figs ${s}: bad entry ${JSON.stringify(f)} (figure ids must exist in the app)`);});});
(pack.newIds||[]).forEach(id=>{if(!seen.has(id)&&!subs.has(id)&&!figIds.has(id))errs.push(`newIds: "${id}" is not in the pack`);});
if(errs.length){console.log(errs.join('\n'));process.exit(1);}
console.log(`OK – pack v${pack.v}: ${pack.subjects.length} subjects, ${pack.exhibits.length} exhibits, ${Object.values(pack.figs).flat().length} extra figure links`);
