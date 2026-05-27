const CW = 840;
const CH = 975;

const NODES = [
  // Row 0
  { id: 'mcit',             x: 350, y: 20,  w: 140, h: 36, label: 'MCIT' },

  // Row 1 — TA/RA left · Behavioral Science floating right (same row, no parent edge)
  { id: 'tara',             x: 184, y: 108, w: 165, h: 36, label: 'TA / RA: AI-4-AI' },
  { id: 'behavsci',         x: 467, y: 108, w: 190, h: 36, label: 'Behavioral Science',
    sub: 'cognitive compliance · human-AI' },

  // Row 2 — Research Paper centered under MCIT
  { id: 'research',         x: 343, y: 196, w: 155, h: 40,
    label: 'Research Paper', sub: 'NLP + behavioral' },

  // Milestone bar — no incoming edges
  { id: 'graduation',       x: 65,  y: 278, w: 710, h: 36, label: "GRADUATION '27" },

  // Below graduation — left: platform · right: career
  { id: 'books',            x: 150, y: 368, w: 215, h: 76,
    label: 'Books', sub: 'The Contrarian\nThe Voiceless\nArchitect of Calm' },
  { id: 'team_lead',        x: 483, y: 373, w: 185, h: 36,
    label: 'Team Lead / Senior IC\n$130–170k' },

  // Row 5
  { id: 'consulting',       x: 175, y: 470, w: 165, h: 44,
    label: 'Consulting\n$150–250k' },
  { id: 'manager_director', x: 473, y: 470, w: 205, h: 44,
    label: 'Manager / Director\n$160–220k' },

  // Row 6 — converge
  { id: 'leadership',       x: 289, y: 562, w: 262, h: 44,
    label: 'Leadership\n$200–320k base' },

  // Row 7 — terminals centered under leadership
  { id: 'corp',             x: 208, y: 668, w: 192, h: 65,
    label: 'Corporate Salary',
    sub: 'CDO/VP/CTO · Tech, Health, Finance\n$220–350k total comp\nno equity, stable, real' },
  { id: 'speaking',         x: 440, y: 668, w: 192, h: 65,
    label: 'Speaking / Thought Leader',
    sub: '$25–70k/yr supplemental\n10–15 talks @ $2–5k each\nNOT a primary income' },

  // Row 8 — Stack (main) · Board (side, future, dashed)
  { id: 'stack',            x: 228, y: 868, w: 384, h: 52,
    label: 'Realistic Total Stack by 2035',
    sub: 'Corp ($265k) + Consulting ($65–90k) + Speaking ($30k) = $360–385k' },
  { id: 'board',            x: 620, y: 868, w: 192, h: 65,
    label: 'Board Member',
    sub: '2033+ · after Corp credibility\nAdvisory → full seat\n$25–75k or equity' },
];

const NM = Object.fromEntries(NODES.map(n => [n.id, n]));

const pt = (id, side) => {
  const n = NM[id];
  if (!n) return [0, 0];
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  if (side === 'T') return [cx, n.y];
  if (side === 'B') return [cx, n.y + n.h];
  if (side === 'L') return [n.x, cy];
  if (side === 'R') return [n.x + n.w, cy];
  return [cx, cy];
};

// [from, fromSide, to, toSide, style?]  style: 'dashed' | 'light'
const EDGES = [
  ['mcit','B','tara','T'],

  ['tara','B','research','T'],
  ['behavsci','B','research','T'],

  // Cross graduation bar (drawn before graduation rect)
  ['behavsci','B','books','T'],
  ['research','B','books','T'],

  // Graduation fans out only
  ['graduation','B','consulting','T'],
  ['graduation','B','team_lead','T'],

  // Platform thread
  ['books','B','consulting','T'],

  // Career thread
  ['team_lead','B','manager_director','T'],

  // Converge
  ['consulting','B','leadership','T'],
  ['manager_director','B','leadership','T'],

  // Leadership → terminals
  ['leadership','B','corp','T'],
  ['leadership','B','speaking','T'],

  // Corp → Board: future, dashed, off to the side
  ['corp','R','board','T','dashed'],

  // → Stack
  ['corp','B','stack','T'],
  ['speaking','B','stack','T'],
  ['consulting','B','stack','T','light'],
];

function bezier(x1, y1, x2, y2) {
  const dy = Math.abs(y2 - y1);
  return `M ${x1} ${y1} C ${x1} ${y1 + dy * 0.5}, ${x2} ${y2 - dy * 0.5}, ${x2} ${y2}`;
}

export default function FlowMap() {
  return (
    <div style={{ background: '#fff', padding: 16, fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <strong style={{ fontSize: 14 }}>Career Map · Fee Wiley</strong>
        <span style={{ fontSize: 11, color: '#888' }}>7+ yrs exp · MCIT 2027 · Hyper-realistic</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg width={CW} height={CH} style={{ display: 'block' }}>
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#bbb" />
            </marker>
          </defs>

          {/* All edges first — graduation rect renders on top, crossing edges show through */}
          {EDGES.map(([from, fs, to, ts, style], i) => {
            const [x1, y1] = pt(from, fs);
            const [x2, y2] = pt(to, ts);
            const isDashed = style === 'dashed';
            const isLight  = style === 'light';
            return (
              <path key={i} d={bezier(x1, y1, x2, y2)}
                fill="none"
                stroke={isDashed ? '#ccc' : isLight ? '#e8e8e8' : '#ddd'}
                strokeWidth={1.2}
                strokeDasharray={isDashed ? '5 3' : 'none'}
                markerEnd="url(#arr)" />
            );
          })}

          {NODES.map(n => {
            const lines    = n.label.split('\n');
            const subLines = n.sub ? n.sub.split('\n') : [];

            const isAnchor   = ['mcit', 'leadership', 'stack'].includes(n.id);
            const isTerminal = ['corp', 'speaking'].includes(n.id);
            const isBoard    = n.id === 'board';
            const isBooks    = n.id === 'books';
            const isBehav    = n.id === 'behavsci';
            const isGrad     = n.id === 'graduation';

            const termColors = { corp: '#1a6b3a', speaking: '#b5770d' };
            const termBg     = { corp: '#f0faf4', speaking: '#FFFBEA' };

            return (
              <g key={n.id}>
                <rect
                  x={n.x} y={n.y} width={n.w} height={n.h} rx={4}
                  fill={
                    isGrad     ? 'rgba(255,251,235,0.93)' :
                    isBooks    ? '#EFF8FF' :
                    isBehav    ? '#F6F0FF' :
                    isBoard    ? '#f0f4fa' :
                    isTerminal ? termBg[n.id] :
                    n.id === 'stack' ? '#f5f5f5' :
                    '#fff'
                  }
                  stroke={
                    isGrad     ? '#D97706' :
                    isBooks    ? '#2A6496' :
                    isBehav    ? '#7B5EA7' :
                    isBoard    ? '#1a4a7a' :
                    isAnchor   ? '#333' :
                    isTerminal ? termColors[n.id] :
                    '#ccc'
                  }
                  strokeWidth={isAnchor || isTerminal || isBooks || isBehav || isGrad ? 2 : 1}
                  strokeDasharray={isBoard ? '5 3' : 'none'}
                />

                {isGrad ? (
                  <>
                    <line x1={n.x + 14} y1={n.y + 18} x2={n.x + n.w / 2 - 95} y2={n.y + 18}
                      stroke="#D97706" strokeWidth={1} strokeOpacity={0.35} />
                    <line x1={n.x + n.w / 2 + 95} y1={n.y + 18} x2={n.x + n.w - 14} y2={n.y + 18}
                      stroke="#D97706" strokeWidth={1} strokeOpacity={0.35} />
                    <text x={n.x + n.w / 2} y={n.y + 18}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={11} fill="#92400E" fontWeight={700} letterSpacing={2}>
                      {n.label}
                    </text>
                  </>
                ) : (
                  <>
                    {lines.map((line, li) => (
                      <text key={li}
                        x={n.x + n.w / 2}
                        y={subLines.length > 0
                          ? n.y + 11 + li * 13
                          : n.y + n.h / 2 - (lines.length - 1) * 6 + li * 13}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={li === 1 ? 9 : isTerminal ? 11 : isBooks ? 11 : 10.5}
                        fill={
                          li === 1   ? '#888' :
                          isBooks    ? '#1a4a7a' :
                          isBehav    ? '#5A3E8A' :
                          isBoard    ? '#1a4a7a' :
                          isTerminal ? termColors[n.id] :
                          n.id === 'stack' ? '#333' :
                          '#222'
                        }
                        fontWeight={
                          isAnchor && li === 0             ? 700 :
                          isTerminal || isBooks || isBehav ? 600 :
                          400
                        }
                      >{line}</text>
                    ))}
                    {subLines.map((line, li) => (
                      <text key={`s${li}`}
                        x={n.x + n.w / 2}
                        y={n.y + 26 + li * 11}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={isTerminal || isBoard ? 8.5 : isBooks ? 9 : 8}
                        fill={
                          isTerminal ? termColors[n.id] + 'aa' :
                          isBoard    ? '#1a4a7acc' :
                          isBooks    ? '#2A6496cc' :
                          isBehav    ? '#7B5EA7aa' :
                          '#aaa'
                        }
                      >{line}</text>
                    ))}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          ['#F6F0FF', '#7B5EA7', 'Behavioral Science'],
          ['#EFF8FF', '#2A6496', 'Books'],
          ['rgba(255,251,235,0.93)', '#D97706', "Graduation '27"],
          ['#f0faf4', '#1a6b3a', 'Corporate'],
          ['#FFFBEA', '#b5770d', 'Speaking'],
          ['#f0f4fa', '#1a4a7a', 'Board (future)'],
        ].map(([bg, border, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: bg, border: `1.5px solid ${border}` }} />
            <span style={{ fontSize: 10, color: '#666' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}