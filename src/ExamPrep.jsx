import React, { useState } from 'react';
import { chapters } from './examContent';

export function ExamPrep({ id = 'start', go }) {
  const c = chapters.find(c => c.id === id) || chapters[0];
  return <>
    <div className="page-intro"><div><span className="eyebrow">EXAM PREP · FROM THE PROFESSOR’S MATERIALS</span><h1>{c.title}</h1><p>{c.subtitle}</p></div></div>
    <div className="exam-layout">
      <nav className="card exam-nav" aria-label="Exam chapters">
        {chapters.map((x, i) => <a key={x.id} href={'#exam/'+x.id} aria-current={c.id===x.id?'page':undefined} onClick={e=>{e.preventDefault();go('exam/'+x.id)}}><span>{String(i+1).padStart(2,'0')}</span>{x.title}</a>)}
      </nav>
      <article className="exam-reading" key={c.id}>
        <p className="source-note">Source guide: {c.source}</p>
        <div className="exam-contents"><strong>In this chapter</strong>{c.sections.map((s,i)=><button key={s.title} onClick={()=>document.getElementById('section-'+i)?.scrollIntoView({behavior:'smooth',block:'start'})}>{s.title}</button>)}</div>
        {c.id === 'greedy' && <ExchangeLab />}
        {c.id === 'approximation' && <LoadLab />}
        {c.sections.map((s,i)=><section className="card content-card exam-section" id={'section-'+i} key={s.title}>
          <span className="eyebrow">{String(i+1).padStart(2,'0')} / DEVELOP THE ARGUMENT</span><h2>{s.title}</h2>
          {s.paragraphs.map(p=><p key={p}>{p}</p>)}
          {!!s.steps.length && <ol className="reasoning-steps">{s.steps.map((p,j)=><li key={p}><strong>Step {j+1}.</strong> {p}</li>)}</ol>}
          {s.check && <div className="recall-check"><strong>Pause and reason</strong><p>{s.check}</p><details><summary>Reveal explanation</summary><p>{s.answer}</p></details></div>}
        </section>)}
        <div className="callout"><h3>Now write the argument yourself.</h3><p>Choose an exercise, work on paper, and bring your answer to chat. Hints and reference outlines stay hidden until you ask to see them.</p><button className="button" onClick={()=>go('practice')}>Choose a practice problem</button></div>
      </article>
    </div>
  </>;
}
function ExchangeLab() {
  const [wa,setWa]=useState(1),[wb,setWb]=useState(4),[show,setShow]=useState(false);
  const ab=wa+3*wb,ba=2*wb+3*wa;
  return <section className="card content-card exam-section"><span className="eyebrow">EXPERIMENT WITH THE EXCHANGE</span><h2>When should the two jobs swap?</h2>
    <p>Durations: A takes 1, B takes 2. Change the input weights. Predict which order is cheaper before revealing the comparison.</p>
    <div className="two-column"><label>A’s weight: <strong>{wa}</strong><input aria-label="Weight of A" type="range" min="1" max="8" value={wa} onChange={e=>{setWa(+e.target.value);setShow(false)}} /></label><label>B’s weight: <strong>{wb}</strong><input aria-label="Weight of B" type="range" min="1" max="8" value={wb} onChange={e=>{setWb(+e.target.value);setShow(false)}} /></label></div>
    <div className="job-timelines"><div><b>A then B</b><span className="job-a" style={{flex:1}}>A · ends 1</span><span className="job-b" style={{flex:2}}>B · ends 3</span></div><div><b>B then A</b><span className="job-b" style={{flex:2}}>B · ends 2</span><span className="job-a" style={{flex:1}}>A · ends 3</span></div></div>
    <button className="button secondary" onClick={()=>setShow(!show)}>{show?'Hide comparison':'Reveal cost comparison'}</button>
    {show && <div className="hint-box" role="status"><p>A then B: {wa} × 1 + {wb} × 3 = <b>{ab}</b>. B then A: {wb} × 2 + {wa} × 3 = <b>{ba}</b>.</p><p>Difference (AB − BA) = wB·tA − wA·tB = {wb} − {wa*2} = <b>{ab-ba}</b>. {ab<ba?'A first is better.':ab>ba?'B first is better.':'Both orders tie.'}</p><p>Both schedules remain feasible. Only after checking this do we use the sign of the cost difference.</p></div>}
  </section>;
}
function LoadLab() {
  const jobs=[3,3,2,2,2]; const [step,setStep]=useState(0); const loads=[0,0],assigned=[[],[]];
  for(let i=0;i<step;i++){const m=loads[0]<=loads[1]?0:1;loads[m]+=jobs[i];assigned[m].push(jobs[i]);}
  return <section className="card content-card exam-section"><span className="eyebrow">TRACE THE COUNTEREXAMPLE</span><h2>Greedy can be good without being optimal</h2><p>Jobs in descending order: 3, 3, 2, 2, 2. Ties go to machine 1. Place each next job on the less-loaded machine.</p>
    {loads.map((v,i)=><div className="load-row" key={i}><strong>Machine {i+1}: {v}</strong><div>{assigned[i].map((t,j)=><span key={j} style={{width:t*30}}>{t}</span>)}</div></div>)}
    <div className="button-row"><button className="button" disabled={step===jobs.length} onClick={()=>setStep(step+1)}>Assign next job</button><button className="button secondary" onClick={()=>setStep(0)}>Reset jobs</button></div>
    {step===5 && <div className="hint-box" role="status">Greedy makespan = 7. Total work / 2 = 6 is a lower bound. The partition (3+3) and (2+2+2) attains 6, so OPT = 6. This example establishes ratio ≥ 7/6 for the worst case; it does not prove a universal upper bound.</div>}
  </section>;
}

export function PracticeCard({ exercise: e }) {
  const [message,setMessage]=useState('');
  const text=`Algorithm Studio exercise ${e.id}: ${e.title}\n\n${e.prompt}\n\nPlease discuss my attempt with me. Start with feedback or a small hint rather than revealing the entire solution.\n\nMy attempt:\n`;
  async function copy(){try{await navigator.clipboard.writeText(text);setMessage('Prompt copied. Paste it into our chat with your attempt.')}catch{setMessage('Clipboard unavailable. Select the prompt below or download it.')}}
  function download(){const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download=`algorithm-studio-${e.id}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  let oldDraft=null;try{oldDraft=JSON.parse(localStorage.getItem('as-draft-'+e.id));}catch{}
  return <section className="card practice-editor offline-practice"><span className="eyebrow">{e.id.toUpperCase()} · {e.level.toUpperCase()} · SUGGESTED {e.minutes} MIN</span><h2>{e.title}</h2><p className="exercise-prompt">{e.prompt}</p>
    <div className="callout"><strong>Work on paper. Discuss it in chat.</strong><p>Bring the prompt ID and your reasoning here when you’re ready. This website has no AI calls, token usage, or automatic grading.</p></div>
    <div className="button-row"><button className="button" onClick={copy}>Copy prompt for chat</button><button className="button secondary" onClick={download}>Download prompt</button></div><p role="status">{message}</p>
    <details><summary>Show a small hint</summary><p>{e.hint}</p></details>
    <details><summary>Show self-review checklist</summary><ul>{e.rubric.map(r=><li key={r}>{r}</li>)}</ul></details>
    <details><summary>Reveal reference outline after attempting</summary><div className="reference-outline">{e.outline.map((o,i)=><div key={o}><h3>{['Approach','Justification','Time / conclusion'][i] || 'Further reasoning'}</h3><p>{o}</p></div>)}</div></details>
    {oldDraft && Object.values(oldDraft).some(Boolean) && <details><summary>Your previously saved draft</summary><p>Preserved from the earlier practice editor.</p>{Object.entries(oldDraft).map(([k,v])=><div key={k}><strong>{k}</strong><p style={{whiteSpace:'pre-wrap'}}>{v}</p></div>)}</details>}
  </section>;
}
