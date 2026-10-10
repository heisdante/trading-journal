"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Check, CircleDot, MoveUpRight, Sparkles } from "lucide-react";

const stages = [
  { label: "Plan", eyebrow: "01 / BEFORE THE ENTRY", title: "A clear setup", note: "Capture the idea before price arrives." },
  { label: "Execute", eyebrow: "02 / DURING THE TRADE", title: "A measured trade", note: "Keep the decision and the risk together." },
  { label: "Reflect", eyebrow: "03 / AFTER THE TRADE", title: "A useful lesson", note: "Take something forward from the result." },
] as const;

export function LandingDemo() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const next = () => setActive((current) => (current + 1) % stages.length);

  return <div className="tj-demo" aria-label="Interactive sample trade journal">
    <div className="tj-demo-top">
      <div className="tj-demo-dots" aria-hidden="true"><i /><i /><i /></div>
      <span>TRADING JOURNAL / SAMPLE TRADE</span>
      <span className="tj-demo-live"><i /> INTERACTIVE PREVIEW</span>
    </div>
    <div className="tj-demo-body">
      <div className="tj-demo-tabs" role="tablist" aria-label="Trade journey">
        {stages.map((item, index) => <button key={item.label} id={`tj-stage-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="tj-stage-panel" tabIndex={active === index ? 0 : -1} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const nextIndex = (index + (event.key === "ArrowRight" ? 1 : stages.length - 1)) % stages.length; setActive(nextIndex); document.getElementById(`tj-stage-tab-${nextIndex}`)?.focus(); } }} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}
      </div>
      <div id="tj-stage-panel" role="tabpanel" aria-labelledby={`tj-stage-tab-${active}`} key={active} className="tj-demo-panel">
        <div className="tj-demo-heading">
          <div><p>{stage.eyebrow}</p><h2>{stage.title}</h2><span>{stage.note}</span></div>
          <div className="tj-demo-symbol"><MoveUpRight size={21} /></div>
        </div>

        {active === 0 && <div className="tj-demo-content">
          <div className="tj-demo-trade-line"><div><span>PAIR / DIRECTION</span><strong>EUR/USD <small>↗ LONG</small></strong></div><div><span>STATE</span><b>Planned setup</b></div></div>
          <div className="tj-demo-note"><CircleDot size={15} /><div><span>ENTRY REASON</span><p>London breakout retest with structure intact.</p></div></div>
          <div className="tj-demo-check"><Check size={14} /> Meets trading criteria</div>
        </div>}

        {active === 1 && <div className="tj-demo-content">
          <div className="tj-demo-trade-line"><div><span>PAIR / DIRECTION</span><strong>EUR/USD <small>↗ LONG</small></strong></div><div><span>STATE</span><b>Active trade</b></div></div>
          <div className="tj-demo-numbers"><div><span>ENTRY</span><strong>1.0820</strong></div><div><span>STOP</span><strong>1.0780</strong></div><div><span>RISK</span><strong>1.0%</strong></div></div>
          <div className="tj-demo-check"><Check size={14} /> Entry followed the plan</div>
        </div>}

        {active === 2 && <div className="tj-demo-content">
          <div className="tj-demo-trade-line"><div><span>PAIR / OUTCOME</span><strong>EUR/USD <small>+1.8R</small></strong></div><div><span>STATE</span><b>Reviewed</b></div></div>
          <div className="tj-demo-note"><BookOpen size={16} /><div><span>LESSON KEPT</span><p>Waiting for confirmation improved the entry.</p></div></div>
          <div className="tj-demo-check"><Sparkles size={14} /> One trade. One useful insight.</div>
        </div>}
      </div>
      <div className="tj-demo-bottom"><span>NOT YOUR DATA · ILLUSTRATIVE PREVIEW</span><button type="button" onClick={next}>{active === 2 ? "Back to plan" : `See ${stages[active + 1].label.toLowerCase()}`} <ArrowRight size={15} /></button></div>
    </div>
  </div>;
}
