const CW = 1060;
const CH = 1100;

const NODES = [
  { id: 'mcit',         x: 390, y: 20,  w: 140, h: 36, label: 'MCIT' },

  { id: 'core',         x: 100, y: 100, w: 140, h: 36, label: 'Core Courses' },
  { id: 'teaching',     x: 390, y: 100, w: 140, h: 36, label: 'Teaching' },
  { id: 'engent',       x: 700, y: 100, w: 180, h: 36, label: 'Eng Entrepreneurship' },

  { id: 'ra',           x: 20,  y: 195, w: 130, h: 36, label: 'RA: AI-4-AI' },
  { id: 'silvercreek',  x: 170, y: 195, w: 120, h: 36, label: 'SilverCreek' },
  { id: 'ta',           x: 340, y: 195, w: 100, h: 36, label: 'TA: CIT' },
  { id: 'aiteach',      x: 462, y: 195, w: 150, h: 36, label: "AI Teaching (sum '26)" },
  { id: 'negotiation',  x: 638, y: 195, w: 120, h: 36, label: 'Negotiation' },
  { id: 'greensvard',   x: 778, y: 195, w: 165, h: 36, label: "Greensvard VC (sum '26)" },

  { id: 'nlp',          x: 50,  y: 295, w: 100, h: 36, label: 'NLP' },
  { id: 'aiinstruct',   x: 360, y: 295, w: 160, h: 36, label: 'AI Instruction' },
  { id: 'vcdeal',       x: 730, y: 295, w: 140, h: 36, label: 'VC / Deal Flow' },

  { id: 'ai',           x: 200, y: 390, w: 100, h: 36, label: 'AI' },
  { id: 'mbds',         x: 400, y: 390, w: 160, h: 36, label: 'MBDS (2027–28)' },
  { id: 'operator',     x: 720, y: 390, w: 160, h: 36, label: 'Operator Track' },

  { id: 'research',     x: 220, y: 480, w: 150, h: 36, label: 'Research Paper', sub: 'NLP + behavioral' },
  { id: 'book',         x: 400, y: 480, w: 160, h: 36, label: 'Architect of Calm', sub: 'scholarly backbone' },
  { id: 'credential',   x: 590, y: 480, w: 150, h: 36, label: 'Credential', sub: 'behavioral lens' },

  { id: 'healthcare',   x: 40,  y: 580, w: 170, h: 44, label: 'Healthcare AI / CDO\n$175–275k' },
  { id: 'consulting',   x: 380, y: 580, w: 170, h: 44, label: 'Consulting\n$175–260k' },
  { id: 'entrepreneur', x: 730, y: 580, w: 170, h: 44, label: 'Entrepreneurship\n$180–260k' },

  { id: 'leadership',   x: 330, y: 685, w: 270, h: 44, label: 'Leadership\n$200–300k base' },

  // Split terminal nodes
  { id: 'corp',         x: 20,  y: 810, w: 190, h: 60, label: 'Corporate Salary', sub: 'CDO/VP · Philly health system\n$200–280k total comp\nno equity, stable, real' },
  { id: 'vc',          x: 230, y: 810, w: 190, h: 60, label: 'VC Operating Partner', sub: 'Base $130–200k\n+ carry (illiquid, 10yr horizon)\ndon\'t count carry as income' },
  { id: 'speaking',    x: 440, y: 810, w: 190, h: 60, label: 'Speaking / Thought Leader', sub: '$20–60k/yr supplemental\n10–15 talks @ $2–5k each\nNOT a primary income' },
  { id: 'board',       x: 650, y: 810, w: 190, h: 60, label: 'Board Member', sub: 'Advisory: $0–25k or equity\nPrivate board: $25–75k\nPublic: 2035+ at earliest' },

  // Total stack
  { id: 'stack',       x: 280, y: 940, w: 380, h: 50, label: 'Realistic Total Stack by 2035', sub: 'Corp ($230k) + SilverCreek ($50–80k) + Speaking ($30k) = $310–380k' },
];

const NM = Object.fromEntries(NODES.map(n => [n.id, n]));

const pt = (id, side) => {
  const n = NM[id];
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  if (side === 'T') return [cx, n.y];
  if (side === 'B') return [cx, n.y + n.h];
  if (side === 'L') return [n.x, cy];
  if (side === 'R') return [n.x + n.w, cy];
  return [cx, cy];
};

const EDGES = [
  ['mcit','B','core','T'],
  ['mcit','B','teaching','T'],
  ['mcit','B','engent','T'],

  ['core','B','ra','T'],
  ['core','B','silvercreek','T'],
  ['teaching','B','ta','T'],
  ['teaching','B','aiteach','T'],
  ['engent','B','negotiation','T'],
  ['engent','B','greensvard','T'],

  ['ra','B','nlp','T'],
  ['ta','B','aiinstruct','T'],
  ['aiteach','B','aiinstruct','T'],
  ['negotiation','B','vcdeal','T'],
  ['greensvard','B','vcdeal','T'],

  ['nlp','B','ai','T'],
  ['aiinstruct','B','ai','T'],
  ['aiinstruct','B','mbds','T'],
  ['vcdeal','B','operator','T'],
  ['vcdeal','B','mbds','T'],
  ['silvercreek','R','consulting','T'],

  ['mbds','B','research','T'],
  ['mbds','B','book','T'],
  ['mbds','B','credential','T'],

  ['ai','B','healthcare','T'],
  ['ai','B','consulting','T'],
  ['research','B','healthcare','T'],
  ['book','B','consulting','T'],
  ['book','B','speaking','T'],
  ['credential','B','consulting','T'],
  ['credential','B','entrepreneur','T'],
  ['operator','B','entrepreneur','T'],
  ['operator','B','consulting','T'],

  ['healthcare','B','leadership','T'],
  ['consulting','B','leadership','T'],
  ['entrepreneur','B','leadership','T'],

  ['leadership','B','corp','T'],
  ['leadership','B','vc','T'],
  ['leadership','B','speaking','T'],
  ['leadership','B','board','T'],

  ['corp','B','stack','T'],
  ['speaking','B','stack','T'],
];

function bezier(x1, y1, x2, y2) {
  const dy = Math.abs(y2 - y1);
  return `M ${x1} ${y1} C ${x1} ${y1 + dy * 0.5}, ${x2} ${y2 - dy * 0.5}, ${x2} ${y2}`;
}

export default function FlowMap() {
  return (
    <div style={{ background: '#fff', padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: 12 }}>
        <strong style={{ fontSize: 14 }}>Career Map · Fee Wiley</strong>
        <span style={{ fontSize: 11, color: '#888', marginLeft: 12 }}>7+ yrs exp · MCIT 2027 · MBDS 2028 · Hyper-realistic</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={CW} height={CH} style={{ display: 'block' }}>
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#999" />
            </marker>
          </defs>

          {EDGES.map(([from, fs, to, ts], i) => {
            const [x1, y1] = pt(from, fs);
            const [x2, y2] = pt(to, ts);
            return (
              <path key={i} d={bezier(x1,y1,x2,y2)}
                fill="none" stroke="#ccc" strokeWidth={1} markerEnd="url(#arr)" />
            );
          })}

          {NODES.map(n => {
            const lines = n.label.split('\n');
            const subLines = n.sub ? n.sub.split('\n') : [];
            const isNew = ['aiteach','greensvard'].includes(n.id);
            const isAnchor = ['mcit','leadership','stack'].includes(n.id);
            const isMBDS = n.id === 'mbds';
            const isMBDSOut = ['research','book','credential'].includes(n.id);
            const isTerminal = ['corp','vc','speaking','board'].includes(n.id);

            const termColors = { corp: '#1a6b3a', vc: '#7B5EA7', speaking: '#b5770d', board: '#1a4a7a' };
            const termBg = { corp: '#f0faf4', vc: '#F5F0FF', speaking: '#FFFBEA', board: '#f0f4fa' };

            return (
              <g key={n.id}>
                <rect
                  x={n.x} y={n.y} width={n.w} height={n.h} rx={4}
                  fill={
                    isNew ? '#FFFBEA' :
                    isMBDSOut ? '#F5F0FF' :
                    isTerminal ? termBg[n.id] :
                    n.id === 'stack' ? '#f5f5f5' :
                    '#fff'
                  }
                  stroke={
                    isNew ? '#D4A800' :
                    isAnchor ? '#333' :
                    isMBDS || isMBDSOut ? '#7B5EA7' :
                    isTerminal ? termColors[n.id] :
                    '#bbb'
                  }
                  strokeWidth={isAnchor || isMBDS || isTerminal ? 2 : isNew ? 1.5 : 1}
                  strokeDasharray={isMBDSOut ? '4 2' : 'none'}
                />

                {/* Main label lines */}
                {lines.map((line, li) => (
                  <text key={li}
                    x={n.x + n.w / 2}
                    y={subLines.length > 0
                      ? n.y + 10 + li * 13
                      : n.y + n.h / 2 - ((lines.length - 1) * 6) + li * 13}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={li === 1 ? 9 : isTerminal ? 11 : 10.5}
                    fill={
                      li === 1 ? '#888' :
                      isNew ? '#9A7000' :
                      isMBDS || isMBDSOut ? '#5A3E8A' :
                      isTerminal ? termColors[n.id] :
                      n.id === 'stack' ? '#333' :
                      '#222'
                    }
                    fontWeight={isAnchor && li === 0 ? 700 : isMBDS || isTerminal ? 600 : 400}
                  >{line}</text>
                ))}

                {/* Sub lines */}
                {subLines.map((line, li) => (
                  <text key={`sub-${li}`}
                    x={n.x + n.w / 2}
                    y={n.y + 24 + li * 11}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={isTerminal ? 8.5 : 8}
                    fill={isTerminal ? termColors[n.id] + 'bb' : '#999'}
                  >{line}</text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 12, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          ['#FFFBEA','#D4A800', "New Summer '26"],
          ['#F5F0FF','#7B5EA7', 'MBDS outputs'],
          ['#f0faf4','#1a6b3a', 'Corporate path'],
          ['#F5F0FF','#7B5EA7', 'VC path'],
          ['#FFFBEA','#b5770d', 'Speaking path'],
          ['#f0f4fa','#1a4a7a', 'Board path'],
        ].map(([bg, border, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: bg, border: `1.5px solid ${border}` }} />
            <span style={{ fontSize: 10, color: '#666' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}