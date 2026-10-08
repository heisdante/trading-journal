const progressPath = "M18 142L76 129L124 138L178 94L228 108L280 72L326 88L378 49L425 67L497 24";

export function AuthProcessChart() {
  return (
    <div className="login-review-art mb-8 hidden self-end xl:block" aria-hidden="true">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#a1b1a5]">Process in motion</p>
        <span className="font-mono text-[9px] text-[#72c994]">01 / 03</span>
      </div>
      <svg viewBox="0 0 520 190" fill="none" className="mt-3 w-full" role="presentation">
        <path d="M4 30H516M4 75H516M4 120H516M4 165H516" stroke="#29362d" strokeWidth="1" />
        <path d={progressPath} stroke="#294b37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path className="auth-process-line" d={progressPath} pathLength="100" stroke="#8ce0ad" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="178" cy="94" r="4" fill="#8ce0ad" />
        <circle cx="378" cy="49" r="4" fill="#8ce0ad" />
        <circle cx="497" cy="24" r="5" fill="#8ce0ad" />
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[.12em] text-[#9bad9e]"><span>Plan</span><span>Execute</span><span>Reflect</span></div>
    </div>
  );
}
