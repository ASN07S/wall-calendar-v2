"use client";

import { CalendarTheme, MONTHS } from "../types/calendar";

interface Props { month: number; year: number; theme: CalendarTheme; }

type SceneFn = (t: CalendarTheme) => React.ReactNode;

const SCENES: SceneFn[] = [
  // 0 Jan — snowy peaks at dusk
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2c3e6b"/><stop offset="100%" stopColor="#8baad4"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <polygon points="0,190 130,70 260,155 400,40 540,130 680,50 820,110 900,70 900,240 0,240" fill="#b8cfe0" opacity="0.5"/>
    <polygon points="0,210 90,150 180,190 320,110 460,175 600,120 760,165 900,130 900,240 0,240" fill="white" opacity="0.15"/>
    <polygon points="380,40 400,5 420,40" fill="white" opacity="0.9"/>
    <polygon points="660,50 680,12 700,50" fill="white" opacity="0.85"/>
    {[...Array(22)].map((_,i)=><circle key={i} cx={(i*43+15)%900} cy={(i*31+10)%100+10} r={i%3===0?1.5:0.9} fill="white" opacity={0.4+0.4*(i%2)}/>)}
  </>),

  // 1 Feb — aurora borealis
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#020818"/><stop offset="100%" stopColor="#071a38"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <ellipse cx="350" cy="90" rx="380" ry="55" fill={t.accent} opacity="0.2"/>
    <ellipse cx="550" cy="70" rx="280" ry="40" fill={t.accentLight} opacity="0.12"/>
    <ellipse cx="200" cy="110" rx="220" ry="35" fill={t.accent} opacity="0.15"/>
    <polygon points="0,200 900,200 900,240 0,240" fill="#020818"/>
    {[...Array(35)].map((_,i)=><circle key={i} cx={(i*27+5)%900} cy={(i*19+5)%140+5} r={i%4===0?1.8:0.7} fill="white" opacity={0.3+0.6*(i%3===0?1:0)}/>)}
  </>),

  // 2 Mar — cherry blossoms
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fce4ec"/><stop offset="100%" stopColor="#f8bbd0"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <rect x="0" y="200" width="900" height="40" fill="#e8d5b7"/>
    {[80,260,480,660,820].map((x,i)=><g key={i}>
      <line x1={x} y1="240" x2={x} y2={140-i%2*20} stroke="#7b4f3a" strokeWidth={i%2===0?8:6}/>
      <ellipse cx={x} cy={130-i%2*20} rx={55+i*5} ry={50+i*3} fill={i%2===0?"#f48fb1":"#f06292"} opacity="0.75"/>
    </g>)}
    {[...Array(18)].map((_,i)=><circle key={i} cx={(i*53+20)%900} cy={(i*37+15)%160+30} r="4" fill="#fce4ec" opacity="0.8"/>)}
  </>),

  // 3 Apr — mountain hiker (original reference scene)
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b0c4d8"/><stop offset="100%" stopColor="#dce8f0"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <polygon points="0,190 140,65 280,150 420,35 560,135 700,55 840,115 900,85 900,240 0,240" fill="#8a9fb5"/>
    <polygon points="0,210 90,155 200,185 350,115 510,178 660,128 820,170 900,145 900,240 0,240" fill="#a0b5c5" opacity="0.7"/>
    {[...Array(12)].map((_,i)=><line key={i} x1={75*i} y1={0} x2={75*i-8} y2={25} stroke={t.accentLight} strokeWidth="0.7" opacity="0.45"/>)}
    <g transform="translate(580,100)">
      <circle cx="0" cy="-18" r="6" fill="#e07050"/>
      <line x1="0" y1="-12" x2="0" y2="8" stroke="#e07050" strokeWidth="2.5"/>
      <line x1="0" y1="-4" x2="-10" y2="4" stroke="#e07050" strokeWidth="2"/>
      <line x1="0" y1="-4" x2="10" y2="2" stroke="#e07050" strokeWidth="2"/>
      <line x1="0" y1="8" x2="-8" y2="22" stroke="#e07050" strokeWidth="2.5"/>
      <line x1="0" y1="8" x2="8" y2="22" stroke="#e07050" strokeWidth="2.5"/>
      <line x1="10" y1="2" x2="14" y2="18" stroke="#c0a080" strokeWidth="1.5"/>
    </g>
  </>),

  // 4 May — lush green valley
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#87ceeb"/><stop offset="100%" stopColor="#c5e8f5"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <ellipse cx="450" cy="260" rx="600" ry="120" fill="#4caf50"/>
    <ellipse cx="450" cy="280" rx="520" ry="100" fill="#388e3c"/>
    {[0,100,200,340,480,580,680,780,880].map((x,i)=><g key={i}>
      <polygon points={`${x+20},240 ${x+45},${115-i%3*18} ${x+70},240`} fill={i%2===0?"#2e7d32":"#388e3c"}/>
    </g>)}
    <circle cx="760" cy="55" r="38" fill="#fff9c4" opacity="0.95"/>
  </>),

  // 5 Jun — golden beach
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff7043"/><stop offset="50%" stopColor="#ffb300"/><stop offset="100%" stopColor="#ffe082"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <ellipse cx="450" cy="260" rx="600" ry="85" fill="#0277bd"/>
    <ellipse cx="450" cy="270" rx="520" ry="65" fill="#01579b"/>
    <rect x="0" y="195" width="900" height="45" fill="#f5deb3"/>
    <circle cx="160" cy="65" r="42" fill="#ffee58" opacity="0.98"/>
    {[100,300,500,700].map((x,i)=><ellipse key={i} cx={x} cy="185" rx="20" ry="6" fill="white" opacity="0.25"/>)}
  </>),

  // 6 Jul — monsoon rain
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#546e7a"/><stop offset="100%" stopColor="#90a4ae"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <polygon points="0,180 150,80 300,150 460,60 620,140 780,70 900,110 900,240 0,240" fill="#455a64" opacity="0.8"/>
    {[...Array(30)].map((_,i)=><line key={i} x1={(i*31+5)%900} y1={0} x2={(i*31+5)%900-12} y2={35} stroke="#b0bec5" strokeWidth="0.8" opacity="0.55"/>)}
    <rect x="0" y="200" width="900" height="40" fill="#37474f"/>
    {[80,200,340,500,640,780].map((x,i)=><g key={i}>
      <rect x={x} y={160-i%2*20} width="50" height={45+i%2*20} fill="#455a64"/>
      <rect x={x+15} y={170-i%2*20} width="12" height="15" fill="#80cbc4" opacity="0.6"/>
    </g>)}
  </>),

  // 7 Aug — sunflower field
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#29b6f6"/><stop offset="100%" stopColor="#81d4fa"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <rect x="0" y="170" width="900" height="70" fill="#558b2f"/>
    {[30,120,220,320,420,520,620,720,820].map((x,i)=><g key={i}>
      <line x1={x+15} y1="240" x2={x+15} y2={140-i%3*15} stroke="#33691e" strokeWidth="4"/>
      {[0,60,120,180,240,300].map(a=><line key={a} x1={x+15} y1={130-i%3*15} x2={x+15+18*Math.cos(a*Math.PI/180)} y2={130-i%3*15+18*Math.sin(a*Math.PI/180)} stroke="#f9a825" strokeWidth="5" strokeLinecap="round"/>)}
      <circle cx={x+15} cy={130-i%3*15} r="9" fill="#4e342e"/>
    </g>)}
  </>),

  // 8 Sep — autumn foliage
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bf360c"/><stop offset="100%" stopColor="#ff8f00"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <rect x="0" y="205" width="900" height="35" fill="#6d4c41"/>
    {[0,170,360,560,740].map((x,i)=><g key={i}>
      <line x1={x+55} y1="240" x2={x+55} y2={105-i%2*18} stroke="#4e342e" strokeWidth={8-i%2}/>
      <ellipse cx={x+55} cy={92-i%2*18} rx={60+i*4} ry={58+i*2} fill={["#e64a19","#f57c00","#d84315","#ef6c00","#bf360c"][i]} opacity="0.88"/>
    </g>)}
    {[...Array(12)].map((_,i)=><ellipse key={i} cx={(i*80+30)%900} cy={(i*47+60)%120+60} rx="6" ry="9" fill={["#ff7043","#ffa726","#ff5722"][i%3]} opacity="0.7" transform={`rotate(${i*25} ${(i*80+30)%900} ${(i*47+60)%120+60})`}/>)}
  </>),

  // 9 Oct — misty forest path
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#78909c"/><stop offset="100%" stopColor="#b0bec5"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <polygon points="400,240 500,240 480,60 420,60" fill="#795548" opacity="0.6"/>
    {[100,200,300,600,700,800].map((x,i)=><g key={i}>
      <polygon points={`${x+20},240 ${x+35},${100-i%2*20} ${x+50},240`} fill="#546e7a" opacity={0.5+i*0.07}/>
    </g>)}
    <rect x="0" y="155" width="900" height="85" fill="white" opacity="0.22"/>
    <ellipse cx="450" cy="240" rx="180" ry="35" fill="#795548" opacity="0.4"/>
  </>),

  // 10 Nov — winter village
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#90a4ae"/><stop offset="100%" stopColor="#eceff1"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    <rect x="0" y="185" width="900" height="55" fill="white"/>
    {[80,230,400,570,730].map((x,i)=><g key={i}>
      <rect x={x} y={145-i%2*22} width={55+i*3} height={45+i%2*22} fill={["#78909c","#546e7a","#607d8b","#455a64","#90a4ae"][i]}/>
      <polygon points={`${x-5},${145-i%2*22} ${x+28+i},${110-i%2*22} ${x+60+i*3},${145-i%2*22}`} fill={["#546e7a","#455a64","#37474f","#263238","#78909c"][i]}/>
      <rect x={x+20} y={160-i%2*22} width="14" height="20" fill="#b0bec5"/>
    </g>)}
    {[...Array(15)].map((_,i)=><circle key={i} cx={(i*63+10)%900} cy={(i*29+5)%100+5} r="2.5" fill="white" opacity="0.7"/>)}
  </>),

  // 11 Dec — starry Christmas night
  (t) => (<>
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a0e27"/><stop offset="100%" stopColor="#1a2060"/>
      </linearGradient>
    </defs>
    <rect width="900" height="240" fill="url(#hg)"/>
    {[...Array(45)].map((_,i)=><circle key={i} cx={(i*21+7)%900} cy={(i*17+5)%130+5} r={i%5===0?2:0.9} fill="white" opacity={0.4+0.5*(i%3===0?1:0)}/>)}
    <polygon points="0,200 140,110 280,175 440,80 600,165 760,95 900,140 900,240 0,240" fill="#1a2060"/>
    <circle cx="800" cy="40" r="22" fill="#fffde7" opacity="0.9"/>
    <polygon points="440,80 450,50 460,80 490,80 466,97 476,125 450,108 424,125 434,97 410,80" fill="#ffe082" opacity="0.9"/>
  </>),
];

export default function HeroImage({ month, year, theme }: Props) {
  const Scene = SCENES[month] ?? SCENES[0];
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(160px, 26vw, 240px)" }}>
      <svg
        width="100%" height="100%"
        viewBox="0 0 900 240"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {Scene(theme)}
      </svg>

      {/* bottom-left white chevron */}
      <svg className="absolute bottom-0 left-0" width="72" height="44" viewBox="0 0 72 44" fill="none" aria-hidden="true">
        <polygon points="0,44 72,0 72,44" fill="white"/>
      </svg>
      {/* dark mode chevron */}
      <svg className="absolute bottom-0 left-0 hidden dark:block" width="72" height="44" viewBox="0 0 72 44" fill="none" aria-hidden="true">
        <polygon points="0,44 72,0 72,44" fill="#1a1a2e"/>
      </svg>

      {/* Month badge */}
      <div
        className="absolute bottom-0 right-0 text-white select-none"
        style={{
          background: theme.accent,
          clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)",
          padding: "12px 24px 16px 48px",
        }}
      >
        <span className="block text-right text-xs tracking-[0.2em] opacity-75 font-sans">{year}</span>
        <span
          className="block text-right tracking-[0.15em] leading-none font-display"
          style={{ fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 600 }}
        >
          {MONTHS[month].toUpperCase()}
        </span>
      </div>
    </div>
  );
}
