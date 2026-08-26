import { useState, createContext, useContext } from "react";

// ─── Shared announcements context ────────────────────────────────────────────
type Announcement = {
  id: number; titulo: string; corpo: string;
  prioridade: "urgente" | "aviso" | "info";
  destino: string; data: string; lida: boolean;
};
type AnnouncementsCtx = {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
};
const AnnouncementsContext = createContext<AnnouncementsCtx>({
  announcements: [], setAnnouncements: () => {},
});
const useAnnouncements = () => useContext(AnnouncementsContext);

// ─── Shared community reports context ────────────────────────────────────────
type Report = {
  id: number;
  tipo: "posto_avariado" | "info_errada" | "problema_rota" | "outro";
  titulo: string; descricao: string; local: string;
  autor: string; data: string;
  estado: "pendente" | "em_analise" | "resolvido";
  resposta: string; votos: number; votei: boolean;
};
type ReportsCtx = {
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
};
const ReportsContext = createContext<ReportsCtx>({ reports: [], setReports: () => {} });
const useReports = () => useContext(ReportsContext);

const Icon = ({ d, size = 20, className = "" }: { d: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {d.split(" M").map((part, i) => (
      <path key={i} d={i === 0 ? part : "M" + part} />
    ))}
  </svg>
);

const ic = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  fleet:     "M1 3h15v13H1z M16 8l5 2v5h-5z M5.5 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3z M18.5 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3z",
  charge:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  cost:      "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  esg:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  map:       "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a2 2 0 100-4 2 2 0 000 4",
  battery:   "M17 7H7a5 5 0 000 10h10a5 5 0 000-10z M22 11v2",
  zap:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  trending:  "M23 6l-9.5 9.5-5-5L1 18",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  settings:  "M12 15a3 3 0 100-6 3 3 0 000 6z",
  reimburse: "M9 14l6-6m-5 1a1 1 0 100-2 1 1 0 000 2zm5 5a1 1 0 100-2 1 1 0 000 2zM21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  route:     "M3 12h18 M3 6h18 M3 18h18",
  bus:       "M8 6v6 M15 6v6 M2 12l1-1h18l1 1v3l-1 1H3l-1-1v-3z M3 7l1-1h16l1 1 M6 19a1 1 0 100-2 1 1 0 000 2z M18 19a1 1 0 100-2 1 1 0 000 2z M2 15h20",
  scooter:   "M4 17a2 2 0 100-4 2 2 0 000 4z M20 17a2 2 0 100-4 2 2 0 000 4z M4 15h4l3-8h9l-2 8",
  co2:       "M12 2a10 10 0 100 20 10 10 0 000-20z M8 12h8 M12 8v8",
  faq:       "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01",
  calc:      "M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M8 8h8 M8 12h4 M8 16h2",
  ai:        "M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2z M12 16a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2v-2a2 2 0 012-2z",
  car:       "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3 M7 17a2 2 0 100-4 2 2 0 000 4z M17 17a2 2 0 100-4 2 2 0 000 4z",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

// ─── Shared ───────────────────────────────────────────────────────────────────
function BatteryBar({ pct, size = "md" }: { pct: number; size?: "sm" | "md" | "lg" }) {
  const color = pct > 60 ? "#F2F2F2" : pct > 25 ? "#999" : "#555";
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div className={`w-full ${h} rounded-full bg-secondary overflow-hidden`}>
      <div className={`${h} rounded-full transition-all duration-700`} style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function StatCard({ label, value, sub, highlight = false, icon }: { label: string; value: string; sub?: string; highlight?: boolean; icon?: string }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      {icon && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-secondary">
          <Icon d={ic[icon as keyof typeof ic] || ic.dashboard} size={15} className="text-muted-foreground" />
        </div>
      )}
      <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function Btn({ children, onClick, variant = "ghost", className = "", disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "outline"; className?: string; disabled?: boolean }) {
  const base = "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-lg px-4 py-2 transition-all cursor-pointer select-none";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
    outline: "border border-border text-foreground hover:bg-secondary",
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>{children}</button>;
}

// ─── Company: Dashboard ───────────────────────────────────────────────────────
// cb: "positivo" | "medio" | "negativo"  (custo vs benefício)
// custoMes = custo mensal de carregamento + manutenção proporcional
// beneficioMes = poupança vs combustão + produtividade estimada
const fleetData = [
  { id: "31-HB-24", model: "Volvo XC40 Recharge", driver: "Ana Ferreira",   soc: 82, status: "Em trânsito", loc: "Lisboa",  custoMes: 98,  beneficioMes: 210, cb: "positivo" },
  { id: "29-KT-18", model: "Tesla Model 3 LR",    driver: "Carlos Mendes",  soc: 51, status: "A carregar",  loc: "Porto",   custoMes: 187, beneficioMes: 175, cb: "negativo" },
  { id: "44-MN-91", model: "BMW iX3",             driver: "Sofia Lima",     soc: 23, status: "Baixa carga", loc: "Sintra",  custoMes: 231, beneficioMes: 108, cb: "negativo" },
  { id: "37-PQ-56", model: "Renault Zoe",         driver: "Pedro Costa",    soc: 94, status: "Disponível",  loc: "Cascais", custoMes: 74,  beneficioMes: 182, cb: "positivo" },
  { id: "18-AB-07", model: "VW ID.4",             driver: "Marta Santos",   soc: 67, status: "Em trânsito", loc: "Setúbal", custoMes: 134, beneficioMes: 138, cb: "medio"    },
  { id: "52-LX-33", model: "Hyundai IONIQ 5",     driver: "João Alves",     soc: 39, status: "Parado",      loc: "Almada",  custoMes: 162, beneficioMes: 154, cb: "medio"    },
  { id: "61-QR-77", model: "Peugeot e-2008",      driver: "Beatriz Nunes",  soc: 75, status: "A carregar",  loc: "Braga",   custoMes: 88,  beneficioMes: 196, cb: "positivo" },
  { id: "09-ST-12", model: "Kia EV6",             driver: "Rui Oliveira",   soc: 88, status: "Disponível",  loc: "Coimbra", custoMes: 112, beneficioMes: 224, cb: "positivo" },
];

function CompanyDashboard() {
  const monthly = [21400, 28900, 24700, 31200, 26800, 34700, 32450];
  const months  = ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
  const max = Math.max(...monthly);
  const emTransito = fleetData.filter(v => v.status === "Em trânsito").length;
  const totalFrota = fleetData.length;
  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-3xl mb-1">Visão Geral da Frota</h1><p className="text-muted-foreground text-sm">Agosto 2026 · {totalFrota} veículos activos</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Veículos Activos" value={`${emTransito}/${totalFrota}`} sub={`${emTransito} em trânsito`} icon="fleet" />
        <StatCard label="Custo Mensal"     value="€3.247" sub="+4.2% vs Jul"     icon="cost" />
        <StatCard label="CO₂ Evitado"      value="4.2 t"  sub="Este mês"         icon="co2"  highlight />
        <StatCard label="Reembolsos"       value="8"      sub="€412 em aberto"   icon="reimburse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div><div className="text-sm font-medium">Custos de Carregamento</div><div className="text-xs text-muted-foreground">€ por mês</div></div>
            <div className="text-xs text-foreground font-medium border border-border px-2.5 py-1 rounded-full">+12% YoY</div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {monthly.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground">{(v/100).toFixed(0)}</div>
                <div className={`w-full rounded-t-md ${i === 6 ? "bg-primary" : "bg-secondary hover:bg-secondary/70"} transition-all`} style={{ height: `${(v/max)*100}%` }} />
                <div className="text-xs text-muted-foreground">{months[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Estado da Frota</div>
          {[
            { label: "Em trânsito", n: 4, pct: 33 },
            { label: "A carregar",  n: 3, pct: 25 },
            { label: "Disponível",  n: 3, pct: 25 },
            { label: "Baixa carga", n: 1, pct: 8  },
            { label: "Parado",      n: 1, pct: 8  },
          ].map((s) => (
            <div key={s.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{s.label}</span><span>{s.n}</span></div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }} /></div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">SoC Médio</div>
            <div className="text-2xl font-semibold mt-1">67%</div>
            <BatteryBar pct={67} />
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-4"><div className="text-sm font-medium">Alertas Recentes</div><span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Ver todos</span></div>
        {[
          { msg: "BMW iX3 (44-MN-91) — Bateria crítica: 23%", t: "#EF4444", time: "há 12 min" },
          { msg: "IONIQ 5 (52-LX-33) — Sessão não iniciada", t: "#999", time: "há 1 h" },
          { msg: "8 reembolsos domésticos aguardam aprovação",  t: "#999", time: "Hoje" },
          { msg: "Relatório ESG de Julho disponível",           t: "#F2F2F2", time: "Ontem" },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: a.t }} />
            <div className="flex-1 text-sm">{a.msg}</div>
            <div className="text-xs text-muted-foreground shrink-0">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyFleet() {
  const [q, setQ] = useState("");
  const [cbFilter, setCbFilter] = useState("todos");
  const filtered = fleetData
    .filter(v => [v.model, v.driver, v.id, v.loc].join(" ").toLowerCase().includes(q.toLowerCase()))
    .filter(v => cbFilter === "todos" || v.cb === cbFilter);

  const statusStyle: Record<string, string> = {
    "Em trânsito": "text-foreground bg-secondary",
    "A carregar":  "text-foreground border border-border",
    "Disponível":  "text-muted-foreground bg-muted",
    "Baixa carga": "text-foreground bg-secondary border border-border",
    "Parado":      "text-muted-foreground bg-muted",
  };

  // Row background tint by cost/benefit
  const rowTint: Record<string, string> = {
    negativo: "bg-red-950/30 border-l-2 border-l-red-600",
    medio:    "bg-yellow-950/20 border-l-2 border-l-yellow-600",
    positivo: "",
  };

  // CB badge
  const cbBadge: Record<string, string> = {
    negativo: "text-red-400 border border-red-800 bg-red-950/40",
    medio:    "text-yellow-400 border border-yellow-800 bg-yellow-950/30",
    positivo: "text-muted-foreground border border-border",
  };
  const cbLabel: Record<string, string> = {
    negativo: "Custo > Benefício",
    medio:    "Equilibrado",
    positivo: "Benefício > Custo",
  };

  const neg  = fleetData.filter(v => v.cb === "negativo").length;
  const med  = fleetData.filter(v => v.cb === "medio").length;
  const pos  = fleetData.filter(v => v.cb === "positivo").length;

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Gestão de Frota</h1><p className="text-muted-foreground text-sm">12 veículos · 8 activos</p></div>

      {/* CB summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4 border border-red-900/60 bg-red-950/20 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
          <div>
            <div className="text-xs text-red-400 font-medium uppercase tracking-wider">Custo &gt; Benefício</div>
            <div className="text-2xl font-semibold text-red-300">{neg} veículos</div>
            <div className="text-xs text-red-400/70 mt-0.5">Requerem atenção imediata</div>
          </div>
        </div>
        <div className="rounded-xl p-4 border border-yellow-900/60 bg-yellow-950/20 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
          <div>
            <div className="text-xs text-yellow-400 font-medium uppercase tracking-wider">Equilibrado</div>
            <div className="text-2xl font-semibold text-yellow-300">{med} veículos</div>
            <div className="text-xs text-yellow-400/70 mt-0.5">Monitorizar de perto</div>
          </div>
        </div>
        <div className="rounded-xl p-4 border border-border bg-card flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-foreground shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Benefício &gt; Custo</div>
            <div className="text-2xl font-semibold">{pos} veículos</div>
            <div className="text-xs text-muted-foreground mt-0.5">A operar bem</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Pesquisar matrícula, modelo ou condutor…"
          className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors" />
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {["todos","negativo","medio","positivo"].map(f => (
            <button key={f} onClick={() => setCbFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${cbFilter===f?"bg-primary text-primary-foreground":"text-muted-foreground hover:text-foreground"}`}>
              {f === "todos" ? "Todos" : f === "negativo" ? "🔴" : f === "medio" ? "🟡" : "✓"}
            </button>
          ))}
        </div>
        <Btn variant="primary">+ Adicionar</Btn>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            {["","Matrícula","Modelo","Condutor","Local","Custo/Mês","Benefício/Mês","Bateria","Estado","Avaliação"].map(h =>
              <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3.5">{h}</th>)}
          </tr></thead>
          <tbody>{filtered.map((v) => {
            const ratio = v.beneficioMes / v.custoMes;
            return (
              <tr key={v.id} className={`border-b border-border last:border-0 hover:brightness-110 transition-all ${rowTint[v.cb]}`}>
                <td className="pl-3 pr-0 py-4 w-6">
                  <div className={`w-2.5 h-2.5 rounded-full ${v.cb==="negativo"?"bg-red-500":v.cb==="medio"?"bg-yellow-500":"bg-foreground/30"}`} />
                </td>
                <td className="px-4 py-4 text-xs font-mono">{v.id}</td>
                <td className="px-4 py-4 text-sm">{v.model}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{v.driver}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{v.loc}</td>
                <td className={`px-4 py-4 text-sm font-medium ${v.cb==="negativo"?"text-red-400":v.cb==="medio"?"text-yellow-400":""}`}>
                  €{v.custoMes}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">€{v.beneficioMes}</td>
                <td className="px-4 py-4 w-32">
                  <div className="flex items-center gap-2">
                    <BatteryBar pct={v.soc} size="sm" />
                    <span className="text-xs text-muted-foreground w-8 shrink-0">{v.soc}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[v.status]}`}>{v.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full block w-fit ${cbBadge[v.cb]}`}>{cbLabel[v.cb]}</span>
                    <div className="text-xs text-muted-foreground">×{ratio.toFixed(2)}</div>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground px-1">
        Custo/mês inclui carregamento + manutenção proporcional. Benefício/mês inclui poupança vs combustão + produtividade estimada.
      </div>
    </div>
  );
}

function CompanyCharging() {
  const sessions = [
    { date: "20 Ago 14:32", driver: "Ana Ferreira",    mat: "31-HB-24", loc: "EMEL · Av. Liberdade",      kwh: 28.4, cost: "€5.68",  dur: "1h 12m", type: "AC 22kW" },
    { date: "20 Ago 11:05", driver: "Carlos Mendes",   mat: "29-KT-18", loc: "Tesla SC · Porto",           kwh: 55.2, cost: "€19.32", dur: "38m",    type: "DC 150kW" },
    { date: "20 Ago 08:45", driver: "Pedro Costa",     mat: "37-PQ-56", loc: "Galp · Cascais",             kwh: 12.8, cost: "€3.58",  dur: "55m",    type: "AC 11kW" },
    { date: "19 Ago 22:10", driver: "João Alves",      mat: "52-LX-33", loc: "Doméstico · Almada",         kwh: 34.0, cost: "€3.40",  dur: "6h 02m", type: "Dom." },
    { date: "19 Ago 18:30", driver: "Marta Santos",    mat: "18-AB-07", loc: "Prio · Setúbal",             kwh: 18.6, cost: "€4.65",  dur: "1h 28m", type: "AC 22kW" },
    { date: "19 Ago 15:12", driver: "Beatriz Nunes",   mat: "61-QR-77", loc: "EDP Mobilidade · Braga",     kwh: 42.0, cost: "€12.60", dur: "52m",    type: "DC 50kW" },
    { date: "18 Ago 09:20", driver: "Rui Oliveira",    mat: "09-ST-12", loc: "EMEL · Coimbra",             kwh: 22.5, cost: "€4.50",  dur: "1h 30m", type: "AC 22kW" },
  ];
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Carregamentos</h1><p className="text-muted-foreground text-sm">Agosto 2026 · 247 sessões · €3.247 total</p></div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total kWh" value="12.840" sub="Este mês" icon="zap" />
        <StatCard label="Custo Médio" value="€0.253/kWh" sub="vs €0.268 Jul" icon="cost" />
        <StatCard label="Sessões DC" value="38%" sub="62% AC + Dom." icon="charge" highlight />
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border">{["Data","Condutor","Local","kWh","Custo","Dur.","Tipo"].map(h =>
            <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3.5">{h}</th>)}</tr></thead>
          <tbody>{sessions.map((s, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-5 py-4 text-xs font-mono text-muted-foreground">{s.date}</td>
              <td className="px-5 py-4 text-sm">{s.driver}</td>
              <td className="px-5 py-4 text-sm text-muted-foreground truncate max-w-[180px]">{s.loc}</td>
              <td className="px-5 py-4 text-sm">{s.kwh}</td>
              <td className="px-5 py-4 text-sm font-medium">{s.cost}</td>
              <td className="px-5 py-4 text-sm text-muted-foreground">{s.dur}</td>
              <td className="px-5 py-4 text-xs border border-border rounded px-2 py-0.5 font-mono">{s.type}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Company: Reimbursements + Calculator ─────────────────────────────────────
function CompanyReimbursements() {
  const [sel, setSel] = useState<number[]>([]);
  const [kwh, setKwh] = useState("284");
  const [rate, setRate] = useState("0.15");
  const [sessions2, setSessions2] = useState("22");
  const parsed = { kwh: parseFloat(kwh) || 0, rate: parseFloat(rate) || 0, sessions: parseInt(sessions2) || 0 };
  const base = parsed.kwh * parsed.rate;
  const admin = base * 0.05;
  const total = base + admin;

  const requests = [
    { driver: "Carlos Mendes",  mat: "29-KT-18", period: "Jul 2026", kwh: 312, amount: "€46.80", status: "pendente", date: "02 Ago", urgencia: "urgente"  },
    { driver: "Sofia Lima",     mat: "44-MN-91", period: "Jul 2026", kwh: 284, amount: "€42.60", status: "pendente", date: "03 Ago", urgencia: "urgente"  },
    { driver: "João Alves",     mat: "52-LX-33", period: "Jul 2026", kwh: 198, amount: "€29.70", status: "pendente", date: "04 Ago", urgencia: "espera"   },
    { driver: "Beatriz Nunes",  mat: "61-QR-77", period: "Jul 2026", kwh: 156, amount: "€23.40", status: "pendente", date: "05 Ago", urgencia: "espera"   },
    { driver: "Pedro Costa",    mat: "37-PQ-56", period: "Jun 2026", kwh: 340, amount: "€51.00", status: "aprovado", date: "02 Jul", urgencia: "normal"   },
    { driver: "Ana Ferreira",   mat: "31-HB-24", period: "Jun 2026", kwh: 420, amount: "€63.00", status: "aprovado", date: "01 Jul", urgencia: "normal"   },
    { driver: "Rui Oliveira",   mat: "09-ST-12", period: "Jun 2026", kwh: 189, amount: "€28.35", status: "pago",     date: "01 Jul", urgencia: "normal"   },
  ];
  const toggle = (i: number) => setSel(s => s.includes(i) ? s.filter(x=>x!==i) : [...s,i]);
  const sc: Record<string, string> = { pendente: "border border-border text-muted-foreground", aprovado: "border border-border text-foreground", pago: "bg-primary text-primary-foreground" };
  const rowUrgencia: Record<string, string> = {
    urgente: "bg-red-950/30 border-l-2 border-l-red-600",
    espera:  "bg-yellow-950/20 border-l-2 border-l-yellow-600",
    normal:  "",
  };
  const urgenciaBadge: Record<string, string> = {
    urgente: "text-red-400 border border-red-800 bg-red-950/40",
    espera:  "text-yellow-400 border border-yellow-800 bg-yellow-950/30",
    normal:  "hidden",
  };

  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-3xl mb-1">Reembolsos Domésticos</h1><p className="text-muted-foreground text-sm">Carregamentos em casa · leitura Wallbox verificada</p></div>

      {/* Auto-reimbursement pipeline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Reembolso Automático</div>
            <div className="text-xs text-muted-foreground mt-0.5">Zero papelada · Wallbox → aprovação → transferência</div>
          </div>
          <span className="text-xs border border-border bg-primary text-primary-foreground px-2.5 py-1 rounded-full">Activo</span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          {[
            { step: "1", label: "Wallbox lê kWh", done: true },
            { step: "2", label: "IA valida sessão", done: true },
            { step: "3", label: "Gestor aprova", done: false },
            { step: "4", label: "Transferência SEPA", done: false },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 ${s.done ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
                {s.done ? "✓" : s.step}
              </div>
              <div className="text-xs text-muted-foreground leading-tight hidden lg:block">{s.label}</div>
              {i < arr.length - 1 && <div className={`flex-1 h-px ${s.done ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { driver: "Carlos Mendes",  kwh: 312, valor: "€46.80", estado: "A aguardar aprovação",    eta: "Hoje" },
            { driver: "Sofia Lima",     kwh: 284, valor: "€42.60", estado: "Validado por IA",          eta: "Amanhã" },
            { driver: "João Alves",     kwh: 198, valor: "€29.70", estado: "Transferência agendada",   eta: "22 Ago" },
          ].map(r => (
            <div key={r.driver} className="bg-muted/40 border border-border rounded-xl p-3">
              <div className="text-xs font-medium mb-0.5">{r.driver}</div>
              <div className="text-lg font-semibold">{r.valor}</div>
              <div className="text-xs text-muted-foreground">{r.kwh} kWh</div>
              <div className="text-xs mt-2 text-muted-foreground">{r.estado}</div>
              <div className="text-xs font-medium mt-0.5">{r.eta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculator */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon d={ic.calc} size={16} className="text-muted-foreground" />
          <div className="text-sm font-medium">Calculadora de Reembolso</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">kWh consumidos</label>
            <input value={kwh} onChange={e=>setKwh(e.target.value)} type="number"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Tarifa (€/kWh)</label>
            <input value={rate} onChange={e=>setRate(e.target.value)} type="number" step="0.01"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Nº sessões</label>
            <input value={sessions2} onChange={e=>setSessions2(e.target.value)} type="number"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40" />
          </div>
          <div className="bg-muted rounded-xl p-4 flex flex-col justify-between">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total a Reembolsar</div>
            <div className="text-2xl font-semibold">€{total.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Base €{base.toFixed(2)} + encargos €{admin.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pendentes"  value="€142.50" sub="4 pedidos"   icon="reimburse" />
        <StatCard label="Aprovados"  value="€162.40" sub="3 pedidos"   icon="reimburse" />
        <StatCard label="Pagos"      value="€28.35"  sub="1 pedido"    icon="cost" highlight />
      </div>

      {sel.length > 0 && (
        <div className="bg-secondary border border-border rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm">{sel.length} selecionados</span>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setSel([])}>Cancelar</Btn>
            <Btn variant="primary">Aprovar</Btn>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border">
            <th className="px-5 py-3.5 w-10"><input type="checkbox" /></th>
            {["Colaborador","Veículo","Período","kWh","Valor","Data","Estado"].map(h =>
              <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3.5">{h}</th>)}
          </tr></thead>
          <tbody>{requests.map((r, i) => (
            <tr key={i} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${rowUrgencia[r.urgencia]}`}>
              <td className="px-5 py-4"><input type="checkbox" checked={sel.includes(i)} onChange={() => toggle(i)} /></td>
              <td className="px-3 py-4 text-sm">
                <div className="flex items-center gap-2">
                  {r.driver}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${urgenciaBadge[r.urgencia]}`}>
                    {r.urgencia === "urgente" ? "urgente" : r.urgencia === "espera" ? "+2 dias" : ""}
                  </span>
                </div>
              </td>
              <td className="px-3 py-4 text-xs font-mono text-muted-foreground">{r.mat}</td>
              <td className="px-3 py-4 text-sm text-muted-foreground">{r.period}</td>
              <td className="px-3 py-4 text-sm">{r.kwh} kWh</td>
              <td className="px-3 py-4 text-sm font-medium">{r.amount}</td>
              <td className="px-3 py-4 text-xs text-muted-foreground">{r.date}</td>
              <td className="px-3 py-4"><span className={`text-xs px-2.5 py-1 rounded-full ${sc[r.status]}`}>{r.status}</span></td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function CompanyESG() {
  const co2Data = [2.1, 2.8, 3.2, 3.0, 3.8, 4.0, 4.1, 4.2];
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago"];
  const max = Math.max(...co2Data);
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Impacto CO₂</h1><p className="text-muted-foreground text-sm">Emissões Scope 1 & 2 · CSRD</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CO₂ Evitado Ago"  value="4.2 t"   sub="↑ 2.4% vs Jul"    icon="co2" highlight />
        <StatCard label="CO₂ Evitado YTD"  value="27.2 t"  sub="136 árvores equiv." icon="co2" />
        <StatCard label="Energia Renovável" value="91%"     sub="Origem verificada"  icon="zap" />
        <StatCard label="€/km médio frota" value="€0.031"  sub="-53% vs combustão"  icon="cost" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-5">CO₂ Evitado por Mês (t)</div>
          <div className="flex items-end gap-2 h-32">
            {co2Data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground">{v}</div>
                <div className={`w-full rounded-t-md ${i===7?"bg-primary":"bg-secondary"}`} style={{ height: `${(v/max)*100}%` }} />
                <div className="text-xs text-muted-foreground">{months[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Metas 2026</div>
          {[
            { label: "Redução emissões",     pct: 68 },
            { label: "Frota 100% eléctrica", pct: 80 },
            { label: "Energia renovável",    pct: 91 },
            { label: "Wallbox colaboradores",pct: 45 },
          ].map(g => (
            <div key={g.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{g.label}</span><span>{g.pct}%</span></div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${g.pct}%` }} /></div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-border">
            <Btn variant="outline" className="w-full">Exportar CSRD (PDF)</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Company: FAQ ─────────────────────────────────────────────────────────────
const faqData = {
  empresa: [
    { q: "Como funciona o cálculo de reembolso para carregamentos domésticos?", a: "O sistema calcula automaticamente com base nos kWh registados pela Wallbox certificada do colaborador, multiplicados pela tarifa acordada (padrão: €0.15/kWh). Um acréscimo de 5% cobre encargos administrativos." },
    { q: "Como integro a plataforma com o meu ERP?", a: "A MobilityService oferece API REST com autenticação OAuth2. Os dados de frotas, custos e relatórios ESG são exportáveis em JSON ou CSV para integração directa com SAP, Primavera ou similar." },
    { q: "Que dados de telemetria são recolhidos dos veículos?", a: "SoC (bateria), localização GPS em tempo real, histórico de viagens, consumo por km, sessões de carregamento e saúde estimada da bateria. Todos os dados seguem a política RGPD." },
    { q: "Posso gerar relatórios CSRD automáticos?", a: "Sim. O módulo ESG gera mensalmente um relatório auditável com emissões Scope 1, Scope 2, kWh de fontes renováveis e equivalência em CO₂ evitado, exportável em PDF." },
  ],
  condutor: [
    { q: "Como submeto um pedido de reembolso pelo carregamento em casa?", a: "No separador Custos, clica em 'Submeter Pedido', introduz os kWh registados na tua Wallbox e faz upload do extrato. A aprovação é feita pelo gestor de frota em até 5 dias úteis." },
    { q: "O que é o Assistente IA e o que pode fazer por mim?", a: "O Assistente IA analisa o teu perfil de condução, bateria e rede de postos próximos. Responde a perguntas sobre custos, sugere quando e onde carregar e ajuda a planear percursos multimodais." },
    { q: "Como funciona o planeamento de percurso multimodal?", a: "Indicando o destino, a plataforma calcula o melhor percurso combinando o carro eléctrico com autocarro, metro ou trotinete, considerando autonomia actual, postos de carregamento e tempo total de viagem." },
    { q: "O que é a saúde da bateria e como é calculada?", a: "A saúde da bateria (SOH) compara a capacidade actual com a original de fábrica. É calculada com base no histórico de ciclos de carga, temperatura e padrões de uso. Abaixo de 80% recomendamos verificação." },
    { q: "Posso ver quais postos estão livres em tempo real?", a: "Sim. O mapa integra dados da rede Mobi.E e Hubject em tempo real, mostrando disponibilidade, voltagem (AC/DC), preço por kWh e opção de navegar directamente pelo Google Maps." },
  ],
};

function FAQSection({ role }: { role: "empresa" | "condutor" }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = faqData[role];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium pr-4">{item.q}</span>
            <div className={`shrink-0 w-5 h-5 rounded-full border border-border flex items-center justify-center transition-transform ${open === i ? "rotate-45" : ""}`}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border pt-3">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function CompanyFAQ() {
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Perguntas Frequentes</h1><p className="text-muted-foreground text-sm">Empresa · Gestores de frota</p></div>
      <FAQSection role="empresa" />
    </div>
  );
}

// ─── Driver: Dashboard ────────────────────────────────────────────────────────
function DriverDashboard() {
  const coachingTips = [
    { icon: "🔄", tip: "Travagem regenerativa", detail: "Nos últimos 7 dias travaste 23% mais brusco que a média. Travar suave poupa ~€6/mês em pneus e recupera energia.", poupanca: "€6/mês" },
    { icon: "⚡", tip: "Horário de carregamento", detail: "Carregares entre 22h–06h na tua Wallbox custa €0.08/kWh vs €0.22 durante o dia. Poupas €18/mês.", poupanca: "€18/mês" },
    { icon: "🌡️", tip: "Pré-condicionamento", detail: "Ligar o ar condicionado enquanto ainda estás a carregar protege a bateria e não gasta autonomia.", poupanca: "2–5% autonomia" },
  ];
  const [tipIdx, setTipIdx] = useState(0);
  const tip = coachingTips[tipIdx];

  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-3xl mb-1">Bom dia, João</h1><p className="text-muted-foreground text-sm">Terça-feira, 20 de Agosto de 2026</p></div>
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Carro de Serviço</div>
            <div className="text-xl font-semibold">Volvo XC40 Recharge</div>
            <div className="text-sm text-muted-foreground font-mono mt-0.5">52-LX-33</div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-semibold">78%</div>
            <div className="text-xs text-muted-foreground">~312 km de autonomia</div>
          </div>
        </div>
        <BatteryBar pct={78} size="lg" />
        <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
          <span><span className="text-foreground font-medium">A carregar</span> — Escritório</span>
          <span>+12 km/h</span>
          <span>Completo às 16:30</span>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Custo Hoje"    value="€4.20"  sub="18.4 kWh"        icon="cost" />
        <StatCard label="Custo Mensal"  value="€38.50" sub="vs €42.10 Jul"   icon="trending" />
        <StatCard label="€/km real"     value="€0.031" sub="-53% vs gasolina" icon="zap" highlight />
        <StatCard label="Sessões (Ago)" value="18"     sub="265 kWh totais"  icon="charge" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Últimas Sessões</div>
          {[
            { where: "Escritório · Wallbox",   when: "Hoje 08:12",  kwh: 18.4, cost: "€4.20",  type: "AC 11kW" },
            { where: "EMEL · Av. Roma",         when: "Ontem 18:45", kwh: 22.8, cost: "€5.47",  type: "AC 22kW" },
            { where: "Tesla SC · Alfragide",    when: "18 Ago",      kwh: 38.5, cost: "€13.48", type: "DC 150kW" },
            { where: "Doméstico · Lisboa",      when: "17 Ago",      kwh: 34.0, cost: "€3.40",  type: "Dom." },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
              <div className="flex-1"><div className="text-sm truncate">{s.where}</div><div className="text-xs text-muted-foreground">{s.when} · {s.kwh} kWh</div></div>
              <div className="text-xs font-mono border border-border px-2 py-0.5 rounded text-muted-foreground">{s.type}</div>
              <div className="text-sm font-medium shrink-0">{s.cost}</div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Consumo Semanal (kWh)</div>
          <div className="flex items-end gap-2 h-28">
            {[32,45,12,58,38,62,18].map((v, i) => {
              const days = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t-md ${i===1?"bg-primary":"bg-secondary"}`} style={{ height: `${(v/62)*100}%` }} />
                  <div className="text-xs text-muted-foreground">{days[i]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coaching score */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Score de Condutor</div>
            <div className="text-xs text-muted-foreground mt-0.5">Baseado nas últimas 47 viagens</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-semibold">84</div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: "84%" }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Travagem",     score: 71, sub: "Pode melhorar" },
            { label: "Eficiência",   score: 91, sub: "Excelente" },
            { label: "Carregamento", score: 88, sub: "Muito bom" },
          ].map(s => (
            <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
              <div className="text-xl font-semibold">{s.score}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="border border-border rounded-xl p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="text-xl shrink-0">{tip.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-medium">{tip.tip}</div>
                <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">poupança {tip.poupanca}</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">{tip.detail}</div>
            </div>
          </div>
          <div className="flex justify-end gap-1 mt-3">
            {coachingTips.map((_, i) => (
              <button key={i} onClick={() => setTipIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === tipIdx ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Driver: Map + Route ──────────────────────────────────────────────────────
// Dados baseados na rede Mobi.E e operadores reais em Portugal
// Fonte: Mobi.E, DGEG, sites oficiais dos operadores (preços indicativos 2026)
const chargersList = [
  {
    name: "EMEL · Av. da Liberdade 185", operator: "EMEL", dist: "0.4km",
    avail: 3, total: 6, power: "22kW AC", voltage: "230V / Tipo 2",
    priceBase: 0.20, unit: "kWh", status: "livre",
    cards: ["Mobi.E", "EMEL Card", "Via Verde"],
    apps: ["EMEL App", "Via Verde App", "Mobi.E App"],
    mobieid: "PT*EML*E001*1",
    mapsUrl: "https://maps.google.com/?q=EMEL+Av+Liberdade+Lisboa",
  },
  {
    name: "Galp Power · Saldanha", operator: "Galp", dist: "0.8km",
    avail: 0, total: 4, power: "50kW DC", voltage: "400V / CCS2 + CHAdeMO",
    priceBase: 0.39, unit: "kWh", status: "ocupado",
    cards: ["Galp Frota Card", "Mobi.E"],
    apps: ["Galp App", "Mobi.E App"],
    mobieid: "PT*GLP*E012*1",
    mapsUrl: "https://maps.google.com/?q=Galp+Saldanha+Lisboa",
  },
  {
    name: "EDP Mobilidade · Marquês de Pombal", operator: "EDP", dist: "1.2km",
    avail: 1, total: 2, power: "11kW AC", voltage: "230V / Tipo 2",
    priceBase: 0.18, unit: "kWh", status: "livre",
    cards: ["EDP Card", "Mobi.E"],
    apps: ["EDP Charge App", "Mobi.E App"],
    mobieid: "PT*EDP*E034*1",
    mapsUrl: "https://maps.google.com/?q=EDP+Mobilidade+Marques+Pombal+Lisboa",
  },
  {
    name: "Ionity · Área de Serviço Alverca", operator: "Ionity", dist: "14km",
    avail: 4, total: 8, power: "350kW DC", voltage: "800V / CCS2",
    priceBase: 0.69, unit: "kWh", status: "livre",
    cards: ["Mobi.E", "Ionity Card"],
    apps: ["Ionity App", "Mobi.E App", "ABRP"],
    mobieid: "PT*ION*E002*1",
    mapsUrl: "https://maps.google.com/?q=Ionity+Alverca+Portugal",
  },
  {
    name: "Prio Energy · Picoas", operator: "Prio", dist: "2.1km",
    avail: 0, total: 3, power: "50kW DC", voltage: "400V / CCS2 + CHAdeMO",
    priceBase: 0.35, unit: "kWh", status: "avaria",
    cards: ["Prio Card", "Mobi.E"],
    apps: ["Prio App", "Mobi.E App"],
    mobieid: "PT*PRI*E008*1",
    mapsUrl: "https://maps.google.com/?q=Prio+Picoas+Lisboa",
  },
  {
    name: "Intermarché · Entrecampos", operator: "Intermarché", dist: "2.4km",
    avail: 4, total: 4, power: "22kW AC", voltage: "230V / Tipo 2",
    priceBase: 0.22, unit: "kWh", status: "livre",
    cards: ["Mobi.E"],
    apps: ["Mobi.E App"],
    mobieid: "PT*ITM*E041*1",
    mapsUrl: "https://maps.google.com/?q=Intermarch%C3%A9+Entrecampos+Lisboa",
  },
  {
    name: "Via Verde / Brisa · A5 km 12", operator: "Brisa/Via Verde", dist: "8.2km",
    avail: 2, total: 6, power: "150kW DC", voltage: "800V / CCS2",
    priceBase: 0.55, unit: "kWh", status: "livre",
    cards: ["Via Verde Card", "Mobi.E"],
    apps: ["Via Verde App", "Mobi.E App"],
    mobieid: "PT*VVE*E006*1",
    mapsUrl: "https://maps.google.com/?q=Via+Verde+A5+Oeiras",
  },
  {
    name: "Shell Recharge · Colombo", operator: "Shell", dist: "3.1km",
    avail: 2, total: 4, power: "50kW DC", voltage: "400V / CCS2 + CHAdeMO",
    priceBase: 0.42, unit: "kWh", status: "livre",
    cards: ["Shell Card", "Mobi.E"],
    apps: ["Shell App", "Mobi.E App"],
    mobieid: "PT*SHL*E015*1",
    mapsUrl: "https://maps.google.com/?q=Shell+Recharge+Colombo+Lisboa",
  },
  {
    name: "Lidl · Benfica", operator: "Lidl", dist: "3.8km",
    avail: 2, total: 2, power: "22kW AC", voltage: "230V / Tipo 2",
    priceBase: 0.15, unit: "kWh", status: "livre",
    cards: ["Mobi.E"],
    apps: ["Mobi.E App"],
    mobieid: "PT*LDL*E022*1",
    mapsUrl: "https://maps.google.com/?q=Lidl+Benfica+Lisboa",
  },
  {
    name: "Zunder · Aeroporto Lisboa (P1)", operator: "Zunder", dist: "9.4km",
    avail: 1, total: 4, power: "120kW DC", voltage: "400V / CCS2",
    priceBase: 0.49, unit: "kWh", status: "livre",
    cards: ["Zunder Card", "Mobi.E"],
    apps: ["Zunder App", "Mobi.E App"],
    mobieid: "PT*ZND*E003*1",
    mapsUrl: "https://maps.google.com/?q=Zunder+Aeroporto+Lisboa",
  },
];

// Apps e cartões disponíveis em Portugal com preços reais
const appsCards = [
  { name: "EDP Charge",      type: "app",    activacao: 0,    priceBase: 0.18, priceAC: "€0.18",priceDC: "€0.39",nota: "Rede EDP em Portugal. Subscrição mensal com tarifa reduzida disponível.",                    url: "https://www.edp.pt/mobilidade-electrica" },
  { name: "EMEL App",        type: "app",    activacao: 0,    priceBase: 0.20, priceAC: "€0.20",priceDC: "—",    nota: "Só postos EMEL em Lisboa. Sem custo de activação. Melhor opção para Lisboa.",                url: "https://www.emel.pt/mobilidade-electrica" },
  { name: "Via Verde App",   type: "app",    activacao: 0,    priceBase: 0.22, priceAC: "€0.22",priceDC: "€0.55",nota: "Integração com portagens. Boa cobertura em autoestradas Brisa.",                            url: "https://www.viaverde.pt" },
  { name: "Mobi.E App",      type: "app",    activacao: 0.25, priceBase: 0.25, priceAC: "+0%",  priceDC: "+0%",  nota: "Acesso universal a toda a rede Mobi.E. Paga tarifa base do operador + €0.25 activação.",   url: "https://www.mobie.pt" },
  { name: "Galp App",        type: "app",    activacao: 0,    priceBase: 0.39, priceAC: "—",    priceDC: "€0.39",nota: "Postos Galp Power. Programa Galp & Go com pontos.",                                         url: "https://www.galp.com/mobilidade" },
  { name: "Zunder App",      type: "app",    activacao: 0,    priceBase: 0.49, priceAC: "—",    priceDC: "€0.49",nota: "Rede em crescimento em Portugal e Espanha. Bom para viagens ibéricas.",                     url: "https://zunder.com" },
  { name: "Ionity App",      type: "app",    activacao: 0,    priceBase: 0.69, priceAC: "—",    priceDC: "€0.69",nota: "Ultrarrápido 350kW em autoestradas europeias. Plano mensal reduz para €0.35/kWh.",          url: "https://ionity.eu" },
  { name: "Galp Frota Card", type: "cartao", activacao: 0,    priceBase: 0.36, priceAC: "—",    priceDC: "€0.36",nota: "Específico para frotas. Tarifa corporativa com desconto vs consumidor final.",              url: "https://www.galp.com/frotas" },
  { name: "Shell Card",      type: "cartao", activacao: 0,    priceBase: 0.42, priceAC: "—",    priceDC: "€0.42",nota: "Rede Shell Recharge. Útil para quem já tem cartão Shell combustível.",                      url: "https://www.shellinternational.com/recharge" },
  { name: "Via Verde Card",  type: "cartao", activacao: 0,    priceBase: 0.22, priceAC: "€0.22",priceDC: "€0.55",nota: "Associado à conta Via Verde. Prático se já tens dispositivo.",                              url: "https://www.viaverde.pt" },
  { name: "Mobi.E Card",     type: "cartao", activacao: 0.25, priceBase: 0.25, priceAC: "+0%",  priceDC: "+0%",  nota: "Cartão físico Mobi.E. Igual à app mas sem smartphone. €0.25 por activação.",               url: "https://www.mobie.pt/cartao" },
];

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={e => e.stopPropagation()}>
      {children}
    </a>
  );
}

// Route intelligence matrix: [contexto][prioridade] → plano adaptado
const routeIntelligence: Record<string, Record<string, {
  label: string; cor: string; descricao: string;
  confianca: number; razao: string;
  passos: { desc: string; dur: string; dist: string }[];
}>> = {
  trabalho: {
    velocidade: {
      label: "Rota Directa", cor: "text-foreground",
      descricao: "Prioridade à hora de chegada. Via rápida sem desvios.",
      confianca: 94, razao: "Baseado em 47 viagens de trabalho anteriores: saídas directas têm 94% de pontualidade.",
      passos: [
        { desc: "A2 Sul → IC19 · Troço autopista sem congestionamento previsto", dur: "18 min", dist: "24 km" },
        { desc: "Carro EV directo ao destino — autonomia suficiente (312 km)", dur: "—", dist: "—" },
      ],
    },
    pneus: {
      label: "Rota Suave", cor: "text-foreground",
      descricao: "Evita lombas, passadeiras e acelerações bruscas. Prolonga vida útil dos pneus.",
      confianca: 88, razao: "Percurso de trabalho com 23% menos desgaste de pneu vs rota directa. Recomendado para frotas com +40.000 km.",
      passos: [
        { desc: "EN10 · Estrada nacional com menor variação de velocidade", dur: "26 min", dist: "22 km" },
        { desc: "Velocidade constante 60–80 km/h recomendada pelo sistema", dur: "—", dist: "—" },
      ],
    },
    custo: {
      label: "Rota Económica", cor: "text-foreground",
      descricao: "Minimiza consumo de energia e portagens. Inclui paragem em posto mais barato da rota.",
      confianca: 91, razao: "IA identificou poupança de €1.40 vs rota directa: evita portagem A2 (€0.85) e passa no posto EDP Charge (€0.18/kWh vs €0.29 destino).",
      passos: [
        { desc: "EN10 → IC2 · Sem portagens, troço mais eficiente energeticamente", dur: "31 min", dist: "23 km" },
        { desc: "Paragem EDP Charge Almada · €0.18/kWh — mais barato no percurso", dur: "12 min", dist: "+0.6 km" },
        { desc: "Custo estimado total: €1.84 vs €3.24 rota directa → poupança €1.40", dur: "—", dist: "—" },
      ],
    },
    emergencia: {
      label: "Rota de Emergência", cor: "text-foreground",
      descricao: "Máxima urgência. Todos os meios disponíveis. Ignora restrições habituais.",
      confianca: 99, razao: "Rota de emergência calculada com prioridade absoluta. Alertas de tráfego em tempo real activos.",
      passos: [
        { desc: "VCI / CRIL · Via mais rápida disponível agora, sem desvios", dur: "11 min", dist: "18 km" },
        { desc: "Activar luzes de aviso e contactar gestor de frota", dur: "—", dist: "—" },
      ],
    },
  },
  lazer: {
    velocidade: {
      label: "Rota Rápida Lazer", cor: "text-foreground",
      descricao: "Chegar rápido com conforto. Combina carro com transportes públicos se vantajoso.",
      confianca: 81, razao: "Em tempo livre, 81% dos condutores preferem chegar rápido mesmo com transbordo.",
      passos: [
        { desc: "Carro EV até Marquês de Pombal", dur: "12 min", dist: "8 km" },
        { desc: "Metro Linha Amarela → destino final", dur: "9 min", dist: "5 km" },
        { desc: "Estacionar junto ao posto EDP (€0.18/kWh) durante o lazer", dur: "—", dist: "—" },
      ],
    },
    pneus: {
      label: "Rota Relaxada", cor: "text-foreground",
      descricao: "Condução suave, janela aberta. Máximo conforto e mínimo desgaste.",
      confianca: 76, razao: "Modo lazer + prioridade pneus: percurso com 31% menos stress mecânico. Ideal para fins de semana.",
      passos: [
        { desc: "2ª Circular → Av. da Índia · Panorâmica e sem lombas", dur: "22 min", dist: "19 km" },
        { desc: "Trotinete partilhada nos últimos 600m até ao destino", dur: "5 min", dist: "0.6 km" },
      ],
    },
    custo: {
      label: "Passeio Económico", cor: "text-foreground",
      descricao: "Máxima poupança em energia e estacionamento. Combina EV com transportes públicos.",
      confianca: 84, razao: "Modo lazer + prioridade custo: combinação EV + metro poupa €3.20 vs carro até ao centro. Inclui estacionamento gratuito em Odivelas.",
      passos: [
        { desc: "Carro EV até Odivelas · Parque gratuito junto ao metro", dur: "19 min", dist: "14 km" },
        { desc: "Carregar no posto Lidl Odivelas · €0.15/kWh durante passeio", dur: "durante passeio", dist: "—" },
        { desc: "Metro Linha Amarela até destino final", dur: "18 min", dist: "11 km" },
        { desc: "Poupança total estimada: €3.20 vs conduzir até ao centro", dur: "—", dist: "—" },
      ],
    },
    emergencia: {
      label: "Urgência Pessoal", cor: "text-foreground",
      descricao: "Situação urgente fora do trabalho. Rota mais rápida disponível.",
      confianca: 97, razao: "Emergência pessoal detectada. Rota directa activada. Notificação enviada ao gestor de frota.",
      passos: [
        { desc: "IC19 → A5 · Sem paragens, rota directa calculada em tempo real", dur: "14 min", dist: "21 km" },
        { desc: "Posto Via Verde em rota (se SOC < 30%)", dur: "8 min", dist: "0.3 km" },
      ],
    },
  },
};

function DriverMap() {
  const [filter, setFilter] = useState("todos");
  const [dest, setDest] = useState("");
  const [transportModes, setTransportModes] = useState<string[]>(["carro"]);
  const [contexto, setContexto] = useState<"trabalho" | "lazer">("trabalho");
  const [prioridade, setPrioridade] = useState<"velocidade" | "pneus" | "custo" | "emergencia">("velocidade");
  const [routed, setRouted] = useState(false);
  const [cardFilter, setCardFilter] = useState<"todos" | "app" | "cartao">("todos");

  const filtered = filter === "todos" ? chargersList : chargersList.filter(c => c.status === filter);
  const toggleTransport = (m: string) => setTransportModes(prev =>
    prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
  );

  const statusStyle: Record<string, string> = {
    livre:   "text-foreground border border-border",
    ocupado: "text-muted-foreground bg-secondary",
    avaria:  "text-muted-foreground line-through",
  };

  const inteligencia = routeIntelligence[contexto][prioridade];

  const contextoStyle: Record<string, string> = {
    trabalho: "bg-primary text-primary-foreground",
    lazer:    "bg-primary text-primary-foreground",
  };
  const prioridadeStyle = (p: string) =>
    p === prioridade
      ? p === "emergencia"
        ? "bg-red-900/60 border border-red-700 text-red-200"
        : "bg-primary text-primary-foreground"
      : "border border-border text-muted-foreground hover:text-foreground";

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Mapa & Percurso</h1><p className="text-muted-foreground text-sm">Postos Mobi.E · Google Maps · multimodal</p></div>

      {/* Contexto + Prioridade */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Contexto</div>
          <div className="flex gap-2">
            {([
              { id: "trabalho", label: "Em Trabalho", emoji: "💼" },
              { id: "lazer",    label: "Tempo Livre",  emoji: "🌿" },
            ] as const).map(c => (
              <button key={c.id} onClick={() => { setContexto(c.id); setRouted(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors flex-1 justify-center
                  ${contexto === c.id ? contextoStyle[c.id] : "border-border text-muted-foreground hover:text-foreground"}`}>
                <span>{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Prioridade</div>
          <div className="flex gap-2">
            {([
              { id: "velocidade",  label: "Velocidade",     desc: "Chegar mais rápido",     emoji: "⚡" },
              { id: "pneus",       label: "Poupar Pneus",   desc: "Condução suave",          emoji: "○" },
              { id: "custo",       label: "Custo",          desc: "Poupança máxima",         emoji: "€" },
              { id: "emergencia",  label: "Emergência",     desc: "Urgência máxima",         emoji: "!" },
            ] as const).map(p => (
              <button key={p.id} onClick={() => { setPrioridade(p.id); setRouted(false); }}
                className={`flex-1 px-3 py-3 rounded-xl text-sm transition-colors text-left ${prioridadeStyle(p.id)}`}>
                <div className="font-medium">{p.emoji} {p.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* IA insight */}
        <div className="bg-muted border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon d={ic.ai} size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inteligência de Percurso</span>
            <span className="ml-auto text-xs border border-border px-2 py-0.5 rounded-full">{inteligencia.confianca}% confiança</span>
          </div>
          <div className="text-sm font-medium mb-1">{inteligencia.label}</div>
          <div className="text-sm text-muted-foreground mb-2">{inteligencia.descricao}</div>
          <div className="text-xs text-muted-foreground italic border-t border-border pt-2">{inteligencia.razao}</div>
          {/* Confidence bar */}
          <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${inteligencia.confianca}%` }} />
          </div>
        </div>
      </div>

      {/* Destination + transport modes */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-sm font-medium mb-4">Destino & Meios de Transporte</div>
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1.5">Destino</div>
            <input value={dest} onChange={e => { setDest(e.target.value); setRouted(false); }}
              placeholder="Ex: Aeroporto de Lisboa"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Autonomia</div>
            <div className="bg-muted border border-border rounded-lg px-3 py-2.5 text-sm font-medium">312 km</div>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          {[
            { id: "carro",     label: "Carro EV",   icon: ic.car },
            { id: "autocarro", label: "Autocarro",  icon: ic.bus },
            { id: "trotinete", label: "Trotinete",  icon: ic.scooter },
          ].map(m => (
            <button key={m.id} onClick={() => toggleTransport(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors
                ${transportModes.includes(m.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              <Icon d={m.icon} size={14} />{m.label}
            </button>
          ))}
        </div>
        <Btn variant="primary" className="w-full" onClick={() => { if (dest) setRouted(true); }}>
          Calcular Percurso com IA
        </Btn>

        {routed && dest && (() => {
          const kmEst = prioridade === "velocidade" ? 24 : prioridade === "custo" ? 23 : prioridade === "emergencia" ? 18 : 22;
          const consumoKwh = +(kmEst * 0.175).toFixed(1);
          const tarifaBase = prioridade === "custo" ? 0.18 : 0.22;
          const custoEnergia = +(consumoKwh * tarifaBase).toFixed(2);
          const portagem = prioridade === "custo" ? 0 : prioridade === "velocidade" ? 0.85 : 0;
          const custoTotal = +(custoEnergia + portagem).toFixed(2);
          const custoAlt = prioridade !== "custo" ? +(custoTotal * 1.38).toFixed(2) : null;
          return (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              {/* Cost prediction banner */}
              <div className="bg-muted/60 border border-border rounded-xl p-3 flex items-center gap-4">
                <div className="text-center shrink-0">
                  <div className="text-2xl font-semibold">€{custoTotal}</div>
                  <div className="text-xs text-muted-foreground">custo estimado</div>
                </div>
                <div className="flex-1 text-xs text-muted-foreground space-y-0.5 border-l border-border pl-4">
                  <div>Energia: <span className="text-foreground">{consumoKwh} kWh × €{tarifaBase} = €{custoEnergia}</span></div>
                  {portagem > 0 && <div>Portagem: <span className="text-foreground">€{portagem}</span></div>}
                  <div>Distância estimada: <span className="text-foreground">{kmEst} km</span></div>
                  {custoAlt && <div className="text-yellow-500/80">Rota custo: pouparias €{(custoAlt - custoTotal).toFixed(2)}</div>}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Percurso · {inteligencia.label}</div>
                <div className="text-xs border border-border px-2 py-0.5 rounded-full">{inteligencia.confianca}% confiança</div>
              </div>
              {inteligencia.passos.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-xs shrink-0 font-medium">{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-sm">{s.desc}</div>
                    {s.dur !== "—" && <div className="text-xs text-muted-foreground mt-0.5">{s.dur} · {s.dist}</div>}
                  </div>
                </div>
              ))}
              <ExternalLink
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`}
                className="flex w-full items-center justify-center gap-2 border border-border text-foreground text-sm font-medium rounded-lg px-4 py-2 hover:bg-secondary transition-colors mt-2">
                Abrir no Google Maps ↗
              </ExternalLink>
            </div>
          );
        })()}
      </div>

      {/* Map visual */}
      <div className="relative bg-card border border-border rounded-2xl h-52 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, #111 0%, #080808 100%)" }} />
        {[...Array(7)].map((_,i) => <div key={i} className="absolute left-0 right-0 border-t border-white/5" style={{ top:`${(i+1)*14.3}%` }} />)}
        {[...Array(9)].map((_,i) => <div key={i} className="absolute top-0 bottom-0 border-l border-white/5" style={{ left:`${(i+1)*11.1}%` }} />)}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
        {chargersList.map((c, i) => {
          const positions = [{x:"14%",y:"35%"},{x:"30%",y:"58%"},{x:"48%",y:"25%"},{x:"62%",y:"65%"},{x:"72%",y:"40%"},{x:"40%",y:"75%"},{x:"55%",y:"50%"},{x:"80%",y:"68%"},{x:"25%",y:"42%"},{x:"68%",y:"80%"}];
          const p = positions[i] || {x:"50%",y:"50%"};
          const ok = c.status === "livre";
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer" style={{ left:p.x, top:p.y }}>
              <div className={`w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-150 ${ok ? "bg-white border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.5)]" : c.status === "avaria" ? "bg-white/20 border-white/20" : "bg-white/40 border-white/40"}`} />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {c.operator} · €{c.priceBase}/kWh · {c.status}
              </div>
            </div>
          );
        })}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
        <div className="absolute bottom-3 left-3 text-xs text-muted-foreground bg-card/90 border border-border rounded-lg px-3 py-1.5">
          Lisboa · 38°43'N 9°08'W
        </div>
        <div className="absolute top-3 right-3">
          <ExternalLink href="https://www.mobie.pt/pontos-de-carregamento"
            className="inline-flex items-center gap-1.5 text-xs border border-border bg-card/90 text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">
            Mobi.E ↗
          </ExternalLink>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs bg-card/90 border border-border rounded-full px-2 py-1">
            <div className="w-2 h-2 rounded-full bg-white" /><span className="text-muted-foreground">Livre</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-card/90 border border-border rounded-full px-2 py-1">
            <div className="w-2 h-2 rounded-full bg-white/30" /><span className="text-muted-foreground">Ocupado/Avaria</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["todos","livre","ocupado","avaria"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${filter===f?"bg-primary text-primary-foreground":"bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {f}
          </button>
        ))}
        <ExternalLink href="https://www.mobie.pt/pontos-de-carregamento"
          className="text-xs px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors ml-auto">
          Ver rede completa Mobi.E ↗
        </ExternalLink>
      </div>

      {/* Charger list */}
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className={`bg-card border rounded-xl p-4 transition-colors ${c.status === "avaria" ? "border-border opacity-60" : "border-border hover:bg-secondary/20"}`}>
            <div className="flex items-start gap-4">
              <div className="text-xl font-semibold w-14 shrink-0 mt-0.5">{c.dist}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium">{c.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusStyle[c.status]}`}>{c.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs font-mono border border-border px-1.5 py-0.5 rounded">{c.power}</span>
                  <span className="text-xs font-mono border border-border px-1.5 py-0.5 rounded">{c.voltage}</span>
                  <span className="text-xs text-foreground font-medium">€{c.priceBase}/{c.unit}</span>
                  {c.status !== "avaria" && <span className="text-xs text-muted-foreground">{c.avail}/{c.total} livres</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="mr-2">ID Mobi.E: <span className="font-mono">{c.mobieid}</span></span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.cards.map(card => (
                    <span key={card} className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">{card}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <ExternalLink href={c.mapsUrl}
                  className="text-xs border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-center">
                  Maps ↗
                </ExternalLink>
                <ExternalLink href="https://www.mobie.pt/pontos-de-carregamento"
                  className="text-xs border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-center">
                  Mobi.E ↗
                </ExternalLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apps & Cards comparator */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Comparador de Apps & Cartões</div>
            <div className="text-xs text-muted-foreground mt-0.5">Todos os operadores activos em Portugal · preços indicativos 2026</div>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["todos","app","cartao"] as const).map(t => (
              <button key={t} onClick={() => setCardFilter(t)}
                className={`text-xs px-3 py-1 rounded-md transition-colors capitalize ${cardFilter===t?"bg-primary text-primary-foreground":"text-muted-foreground hover:text-foreground"}`}>
                {t === "todos" ? "Todos" : t === "app" ? "Apps" : "Cartões"}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {appsCards
            .filter(a => cardFilter === "todos" || a.type === cardFilter)
            .sort((a, b) => a.priceBase - b.priceBase)
            .map((a, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors">
                <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{a.name}</div>
                    <span className="text-xs border border-border px-1.5 py-0.5 rounded-full text-muted-foreground capitalize">{a.type}</span>
                    {i === 0 && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Mais barato</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.nota}</div>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <div className="text-xs text-muted-foreground">AC: <span className="text-foreground font-medium">{a.priceAC}</span></div>
                  <div className="text-xs text-muted-foreground">DC: <span className="text-foreground font-medium">{a.priceDC}</span></div>
                  {a.activacao > 0 && <div className="text-xs text-muted-foreground">+€{a.activacao} activação</div>}
                </div>
                <ExternalLink href={a.url}
                  className="text-xs border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                  Abrir ↗
                </ExternalLink>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Driver: Battery Health ───────────────────────────────────────────────────
function DriverBattery() {
  const soh = 94;
  const months = ["Ago '24","Nov '24","Fev '25","Mai '25","Ago '25","Nov '25","Fev '26","Mai '26","Ago '26"];
  const history = [100, 99.1, 98.4, 97.6, 96.8, 96.0, 95.2, 94.6, 94.0];

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Saúde da Bateria</h1><p className="text-muted-foreground text-sm">Volvo XC40 Recharge · 78 kWh · 52-LX-33</p></div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estado de Saúde (SOH)</div>
            <div className="text-6xl font-semibold">{soh}%</div>
            <div className="text-sm text-muted-foreground mt-1">Excelente · dentro do esperado</div>
          </div>
          <div className="text-right space-y-3">
            <div><div className="text-xs text-muted-foreground">Capacidade actual</div><div className="text-lg font-semibold">73.3 kWh</div></div>
            <div><div className="text-xs text-muted-foreground">Original de fábrica</div><div className="text-sm text-muted-foreground">78 kWh</div></div>
          </div>
        </div>
        <BatteryBar pct={soh} size="lg" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Ciclos completos",   value: "312" },
            { label: "Degradação total",   value: "6.0%" },
            { label: "Degradação/ano",     value: "~2.4%" },
          ].map(s => (
            <div key={s.label} className="bg-secondary rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
              <div className="text-lg font-semibold">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-sm font-medium mb-5">Evolução SOH ao Longo do Tempo</div>
        <div className="relative h-36">
          <div className="absolute inset-0 flex items-end">
            {history.map((v, i) => {
              const pct = ((v - 90) / 10) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="text-xs text-muted-foreground">{v}%</div>
                  <div className={`w-full rounded-t-sm ${i === history.length-1 ? "bg-primary" : "bg-secondary"}`} style={{ height: `${pct}%` }} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {months.map((m, i) => <div key={i} className="flex-1 text-center text-xs text-muted-foreground">{m}</div>)}
        </div>
        <div className="mt-3 pt-3 border-t border-border flex gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Projecção:</span>
          <span>Bateria abaixo de 80% estimada para 2029. Garantia cobre até 70% em 8 anos.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Factores que Afectam a Saúde</div>
          <div className="space-y-3">
            {[
              { label: "Carregamentos DC rápidos (38%)",    impact: "Médio",  color: "#999" },
              { label: "Temperatura média de operação",      impact: "Baixo",  color: "#555" },
              { label: "Profundidade dos ciclos",            impact: "Baixo",  color: "#555" },
              { label: "Tempo a 100% de carga",             impact: "Baixo",  color: "#555" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="flex-1 text-sm text-muted-foreground">{f.label}</div>
                <div className="text-xs px-2 py-0.5 border border-border rounded-full" style={{ color: f.color }}>{f.impact}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Recomendações</div>
          <div className="space-y-3">
            {[
              "Evita carregar acima de 80% para viagens urbanas diárias.",
              "Usa o carregamento AC sempre que não precisas de velocidade.",
              "Mantém a bateria entre 20% e 80% sempre que possível.",
              "Evita exposição prolongada ao calor com a bateria a 100%.",
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs shrink-0 mt-0.5">{i+1}</div>
                <div className="text-sm text-muted-foreground">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Driver: Costs + Reimbursement Calculator ─────────────────────────────────
function DriverCosts() {
  const [kwh, setKwh] = useState("284");
  const [rate, setRate] = useState("0.15");
  const base = (parseFloat(kwh)||0) * (parseFloat(rate)||0);
  const weeks = ["S1","S2","S3","S4"];
  const home = [8.2,7.5,9.1,6.8];
  const pub  = [5.4,12.8,7.2,11.4];
  const maxW = Math.max(...home.map((h,i)=>h+pub[i]));
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Gestão de Custos</h1><p className="text-muted-foreground text-sm">Custos consolidados · casa + rede pública</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Custo Total Ago" value="€38.50" sub="↓ €3.60 vs Jul" icon="cost" highlight />
        <StatCard label="Doméstico"       value="€13.20" sub="31.6 kWh"       icon="charge" />
        <StatCard label="Rede Pública"    value="€25.30" sub="84.3 kWh"       icon="map" />
        <StatCard label="€/km real"       value="€0.031" sub="vs €0.071 diesel" icon="trending" />
      </div>

      {/* Calculator */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon d={ic.calc} size={16} className="text-muted-foreground" />
          <div className="text-sm font-medium">Calculadora de Reembolso (Wallbox)</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">kWh carregados em casa</label>
            <input value={kwh} onChange={e=>setKwh(e.target.value)} type="number"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Tarifa doméstica (€/kWh)</label>
            <input value={rate} onChange={e=>setRate(e.target.value)} type="number" step="0.01"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40" />
          </div>
          <div className="bg-muted rounded-xl p-4 flex flex-col justify-between">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">A Receber</div>
            <div className="text-3xl font-semibold mt-1">€{base.toFixed(2)}</div>
            <Btn variant="outline" className="mt-2 text-xs py-1.5">Submeter Pedido</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-5">Custo Semanal (€)</div>
          <div className="flex items-end gap-4 h-32">
            {weeks.map((w,i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col-reverse" style={{ height: `${((home[i]+pub[i])/maxW)*100}%` }}>
                  <div className="w-full rounded-b-md bg-primary" style={{ height: `${(home[i]/(home[i]+pub[i]))*100}%` }} />
                  <div className="w-full rounded-t-md bg-secondary" style={{ height: `${(pub[i]/(home[i]+pub[i]))*100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">{w}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-muted-foreground">Doméstico</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-secondary border border-border" /><span className="text-muted-foreground">Público</span></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Comparação de Mobilidade</div>
          {[
            { label: "XC40 Eléctrico (actual)", val: 38.5, max: 160, highlight: true },
            { label: "Equivalente diesel",       val: 124,  max: 160, highlight: false },
            { label: "Equivalente gasolina",     val: 148,  max: 160, highlight: false },
          ].map(r => (
            <div key={r.label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className={r.highlight ? "text-foreground" : "text-muted-foreground"}>{r.label}</span>
                <span className={r.highlight ? "font-semibold" : "text-muted-foreground"}>€{r.val}/mês</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.highlight ? "bg-primary" : "bg-muted-foreground/30"}`} style={{ width:`${(r.val/r.max)*100}%` }} />
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-border text-center">
            <div className="text-xs text-muted-foreground">Poupança mensal estimada</div>
            <div className="text-2xl font-semibold mt-1">€85–€110</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Driver: CO2 ──────────────────────────────────────────────────────────────
function DriverCO2() {
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago"];
  const saved   = [18.2, 22.4, 20.8, 25.1, 23.6, 27.4, 26.8, 28.2];
  const max = Math.max(...saved);
  const ytd = saved.reduce((a,b)=>a+b,0);
  const trees = Math.round(ytd * 4.8);
  const km = Math.round(ytd * 400);
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Impacto CO₂</h1><p className="text-muted-foreground text-sm">O teu contributo ambiental com o carro eléctrico</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CO₂ Evitado Ago"  value="28.2 kg"   sub="vs combustão"     icon="co2" highlight />
        <StatCard label="CO₂ Evitado YTD"  value={`${ytd.toFixed(0)} kg`} sub="Desde Jan 2026" icon="co2" />
        <StatCard label="Equiv. Árvores"   value={`${trees}`} sub="absorção anual"   icon="esg" />
        <StatCard label="km sem emissões"  value={`${km.toLocaleString()}`} sub="acumulado 2026" icon="trending" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">CO₂ Evitado em 2026</div>
          <div className="text-7xl font-semibold">{ytd.toFixed(1)}<span className="text-2xl text-muted-foreground ml-2">kg</span></div>
          <div className="text-sm text-muted-foreground mt-2">equivalente a {trees} árvores a absorver CO₂ durante um ano</div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {saved.map((v,i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs text-muted-foreground">{v.toFixed(0)}</div>
              <div className={`w-full rounded-t-md ${i===7?"bg-primary":"bg-secondary"}`} style={{ height:`${(v/max)*100}%` }} />
              <div className="text-xs text-muted-foreground">{months[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Comparação com Combustão</div>
          <div className="space-y-3">
            {[
              { label: "Diesel equivalente (km percorridos)", co2: "189 kg CO₂" },
              { label: "Gasolina equivalente",                co2: "210 kg CO₂" },
              { label: "O teu XC40 eléctrico",               co2: "~8 kg CO₂ indirect." },
            ].map((r,i) => (
              <div key={i} className="flex justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className={`text-sm font-medium ${i===2?"text-foreground":""}`}>{r.co2}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-medium mb-4">Projecção Anual 2026</div>
          <div className="space-y-4">
            {[
              { label: "CO₂ evitado (estimativa anual)", value: "~195 kg" },
              { label: "Poupança monetária vs diesel",    value: "~€1.020/ano" },
              { label: "Energia eléctrica consumida",     value: "~3.180 kWh" },
              { label: "% de energias renováveis (rede)", value: "73% (RESP 2026)" },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Driver: AI ───────────────────────────────────────────────────────────────
function DriverAI() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Olá, João! Sou o Assistente MobilityService. O teu XC40 está a 78% (≈312 km). Hoje carregaste 18.4 kWh no escritório. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");

  const replies: Record<string, string> = {
    "Qual o carregador mais barato perto de mim?": "O mais económico a menos de 2 km é a EDP Mobilidade no Marquês de Pombal: €0.18/kWh, AC 11 kW, 1 lugar livre agora. Para carregamento rápido, a Via Verde no Campo Grande tem DC 150 kW a €0.55/kWh.",
    "Quando devo carregar hoje para poupar mais?": "O melhor momento é entre as 23h e as 02h (supervazio): ~€0.09/kWh vs €0.22/kWh agora. Carregando 30 kWh nessa janela poupas cerca de €3.90 vs carregar agora.",
    "Explica-me o meu custo de €0.031/km": "O teu XC40 consome ~18 kWh/100km. Com o custo médio de €0.172/kWh (mix doméstico + público), chegas a €0.031/km. Um diesel equivalente custaria ~€0.071/km.",
    "Como reduzir o meu custo mensal?": "1) Prefere carregar no escritório (gratuito) — já é 62% das tuas sessões. 2) Usa postos AC em vez de DC sempre que possível. 3) Submete o reembolso de Julho (€42.60 pendente).",
  };
  const suggestions = Object.keys(replies);

  const send = (text: string) => {
    if (!text.trim()) return;
    const reply = replies[text] || "Com base no teu perfil, estás a optimizar bem os custos. Há algo específico que queiras saber sobre carregamento, custos ou percursos?";
    setMessages(m => [...m, { role: "user", text }, { role: "ai", text: reply }]);
    setInput("");
  };

  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Assistente IA</h1><p className="text-muted-foreground text-sm">Personalizado para o teu perfil de condução</p></div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ height: 400 }}>
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Icon d={ic.ai} size={14} className="text-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium">MobilityService AI</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-foreground" />online</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m,i) => (
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-xs lg:max-w-sm text-sm px-4 py-2.5 rounded-2xl ${m.role==="user"?"bg-primary text-primary-foreground rounded-br-sm":"bg-secondary text-foreground rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
            placeholder="Faz uma pergunta…"
            className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none focus:border-primary/40" />
          <Btn variant="primary" onClick={()=>send(input)}>Enviar</Btn>
        </div>
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sugestões</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {suggestions.map(s => (
          <button key={s} onClick={()=>send(s)}
            className="text-left text-sm text-muted-foreground bg-card border border-border hover:border-primary/30 hover:text-foreground rounded-xl px-4 py-3 transition-colors">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function DriverFAQ() {
  return (
    <div className="space-y-5">
      <div><h1 className="font-serif text-3xl mb-1">Perguntas Frequentes</h1><p className="text-muted-foreground text-sm">Condutor · carro de serviço</p></div>
      <FAQSection role="condutor" />
    </div>
  );
}

// ─── Company: Análise (bi-semanal + incidentes) ───────────────────────────────
const biweeklyBattery = [
  { vehicle: "31-HB-24 · Volvo XC40",    s1: 91, s2: 89, delta: -2, trend: "↓" },
  { vehicle: "29-KT-18 · Tesla Model 3",  s1: 87, s2: 87, delta:  0, trend: "—" },
  { vehicle: "44-MN-91 · BMW iX3",        s1: 78, s2: 76, delta: -2, trend: "↓" },
  { vehicle: "37-PQ-56 · Renault Zoe",    s1: 94, s2: 95, delta: +1, trend: "↑" },
  { vehicle: "18-AB-07 · VW ID.4",        s1: 83, s2: 82, delta: -1, trend: "↓" },
  { vehicle: "52-LX-33 · IONIQ 5",        s1: 90, s2: 88, delta: -2, trend: "↓" },
  { vehicle: "61-QR-77 · Peugeot e-2008", s1: 85, s2: 85, delta:  0, trend: "—" },
  { vehicle: "09-ST-12 · Kia EV6",        s1: 92, s2: 93, delta: +1, trend: "↑" },
];

const biweeklyCosts = [
  { vehicle: "31-HB-24", s1: 48.20, s2: 52.10, delta: +3.90 },
  { vehicle: "29-KT-18", s1: 62.50, s2: 58.30, delta: -4.20 },
  { vehicle: "44-MN-91", s1: 34.80, s2: 41.60, delta: +6.80 },
  { vehicle: "37-PQ-56", s1: 29.40, s2: 27.90, delta: -1.50 },
  { vehicle: "18-AB-07", s1: 55.10, s2: 55.80, delta: +0.70 },
  { vehicle: "52-LX-33", s1: 38.60, s2: 44.20, delta: +5.60 },
  { vehicle: "61-QR-77", s1: 42.30, s2: 40.10, delta: -2.20 },
  { vehicle: "09-ST-12", s1: 31.20, s2: 29.80, delta: -1.40 },
];

const incidents = [
  { date: "19 Ago", mat: "44-MN-91", type: "Bateria crítica",        desc: "SOC abaixo de 15% durante percurso Lisboa–Setúbal. Condutor imobilizou em posto Prio.", severity: "alta",  status: "resolvido" },
  { date: "18 Ago", mat: "29-KT-18", type: "Posto inacessível",      desc: "Posto Tesla SC Alfragide com 3 carregadores avariados. Redireccionado para Via Verde.", severity: "média", status: "resolvido" },
  { date: "17 Ago", mat: "52-LX-33", type: "Falha de autenticação",  desc: "Cartão Mobi.E rejeitado em posto EMEL Av. Roma. Sessão iniciada via app como backup.", severity: "baixa", status: "resolvido" },
  { date: "16 Ago", mat: "61-QR-77", type: "Atraso de rota",         desc: "Desvio N2 por obra — autonomia insuficiente para rota alternativa. +45 min de viagem.", severity: "média", status: "resolvido" },
  { date: "15 Ago", mat: "37-PQ-56", type: "Sobrecarga de agenda",   desc: "Veículo agendado para 2 utilizadores em simultâneo. Conflito de reserva no sistema.", severity: "baixa", status: "pendente" },
  { date: "14 Ago", mat: "18-AB-07", type: "Falha de telemetria",    desc: "Dados de SOC não transmitidos durante 4 horas. Reinicialização da unidade OBD.", severity: "média", status: "resolvido" },
  { date: "12 Ago", mat: "09-ST-12", type: "Travagem de emergência", desc: "Sistema ADAS activou travagem brusca — peão na A2. Sem danos. Relatório enviado.", severity: "alta",  status: "em análise" },
];

function CompanyAnalysis() {
  const [tab, setTab] = useState<"battery" | "costs" | "incidents">("battery");
  const sevColor: Record<string, string> = { alta: "text-foreground border border-border", média: "text-muted-foreground border border-border", baixa: "text-muted-foreground" };
  const stColor: Record<string, string>  = { resolvido: "text-muted-foreground", pendente: "text-foreground border border-border", "em análise": "border border-border text-foreground" };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl mb-1">Análise & Incidentes</h1>
        <p className="text-muted-foreground text-sm">Comparação bi-semanal · Semana 1 (1–15 Ago) vs Semana 2 (16–20 Ago)</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {(["battery","costs","incidents"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab===t?"bg-primary text-primary-foreground":"text-muted-foreground hover:text-foreground"}`}>
            {t === "battery" ? "Bateria" : t === "costs" ? "Custos" : "Incidentes"}
          </button>
        ))}
      </div>

      {/* Battery comparison */}
      {tab === "battery" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="SOH Médio S1" value="87.5%" sub="1–15 Ago" icon="battery" />
            <StatCard label="SOH Médio S2" value="86.9%" sub="16–20 Ago" icon="battery" />
            <StatCard label="Veículos a Degradar" value="5" sub="–1% ou mais" icon="trending" highlight />
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                {["Veículo","SOH S1 (%)","SOH S2 (%)","Δ","Tendência"].map(h =>
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3.5">{h}</th>)}
              </tr></thead>
              <tbody>{biweeklyBattery.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-4 text-sm">{r.vehicle}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-muted-foreground rounded-full" style={{ width: `${r.s1}%` }} />
                      </div>
                      <span className="text-sm">{r.s1}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${r.s2}%` }} />
                      </div>
                      <span className="text-sm font-medium">{r.s2}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-mono">
                    <span className={r.delta < 0 ? "text-muted-foreground" : r.delta > 0 ? "text-foreground" : "text-muted-foreground"}>
                      {r.delta > 0 ? "+" : ""}{r.delta}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-lg">{r.trend}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-medium mb-4">SOH por Veículo — Semana 2</div>
            <div className="space-y-2.5">
              {biweeklyBattery.map(r => (
                <div key={r.vehicle} className="flex items-center gap-4">
                  <div className="text-xs font-mono text-muted-foreground w-20 shrink-0">{r.vehicle.split("·")[0].trim()}</div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.s2 < 80 ? "bg-muted-foreground" : "bg-primary"}`} style={{ width: `${r.s2}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground w-10 text-right">{r.s2}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cost comparison */}
      {tab === "costs" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Custo Total S1" value="€342.10" sub="1–15 Ago" icon="cost" />
            <StatCard label="Custo Total S2" value="€349.80" sub="16–20 Ago" icon="cost" />
            <StatCard label="Variação" value="+€7.70" sub="+2.3% vs semana anterior" icon="trending" />
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                {["Matrícula","Custo S1 (€)","Custo S2 (€)","Δ","Variação"].map(h =>
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3.5">{h}</th>)}
              </tr></thead>
              <tbody>{biweeklyCosts.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-4 text-xs font-mono">{r.vehicle}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">€{r.s1.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm font-medium">€{r.s2.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm font-mono">
                    <span className={r.delta > 0 ? "text-foreground" : "text-muted-foreground"}>
                      {r.delta > 0 ? "+" : ""}€{Math.abs(r.delta).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.delta > 4 ? "bg-foreground" : r.delta > 0 ? "bg-muted-foreground" : "bg-secondary-foreground"}`}
                          style={{ width: `${Math.min(Math.abs(r.delta)/10*100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{((r.delta/r.s1)*100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-medium mb-4">Comparação Visual S1 vs S2</div>
            <div className="flex items-end gap-3 h-36">
              {biweeklyCosts.map((r, i) => {
                const maxVal = Math.max(...biweeklyCosts.map(x => Math.max(x.s1, x.s2)));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5" style={{ height: "120px" }}>
                      <div className="flex-1 bg-secondary rounded-t-sm" style={{ height: `${(r.s1/maxVal)*100}%` }} />
                      <div className="flex-1 bg-primary rounded-t-sm" style={{ height: `${(r.s2/maxVal)*100}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground">{r.vehicle.split("-")[0]}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-secondary border border-border" /><span className="text-muted-foreground">S1 (1–15 Ago)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-muted-foreground">S2 (16–20 Ago)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Incidents */}
      {tab === "incidents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Ago"     value="7"  sub="incidentes registados" icon="faq" />
            <StatCard label="Em análise"    value="1"  sub="requer atenção"        icon="faq" highlight />
            <StatCard label="Pendentes"     value="1"  sub="sem resolução"         icon="faq" />
          </div>
          <div className="space-y-2">
            {incidents.map((inc, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="text-xs text-muted-foreground font-mono w-16 shrink-0 mt-0.5">{inc.date}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{inc.type}</span>
                      <span className="text-xs font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">{inc.mat}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{inc.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${sevColor[inc.severity]}`}>
                      {inc.severity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${stColor[inc.status]}`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Company: Manutenção ──────────────────────────────────────────────────────
const maintenanceData = [
  { mat: "31-HB-24", model: "Volvo XC40 Recharge", driver: "Ana Ferreira",   km: 42800, nextService: "48.000 km", nextDate: "Nov 2026", tires: "OK",        brakes: "OK",        software: "v3.2.1",  status: "ok",      daysLeft: 92,  predictKm: 5200, predictAlert: null },
  { mat: "29-KT-18", model: "Tesla Model 3 LR",    driver: "Carlos Mendes",  km: 61200, nextService: "64.000 km", nextDate: "Set 2026", tires: "Desgaste",   brakes: "OK",        software: "v11.4.3", status: "atenção", daysLeft: 28,  predictKm: 2800, predictAlert: "Padrão de travagem do Carlos vai gastar os pneus 40% mais rápido. Substituição prevista em 2.800 km vs 4.500 km normais." },
  { mat: "44-MN-91", model: "BMW iX3",             driver: "Sofia Lima",     km: 38500, nextService: "40.000 km", nextDate: "Set 2026", tires: "OK",         brakes: "Verificar", software: "v2.8.0",  status: "urgente", daysLeft: 14,  predictKm: 1500, predictAlert: "Travões com desgaste acelerado detectado. Com o actual padrão de condução em zona urbana, falha prevista em 1.500 km." },
  { mat: "37-PQ-56", model: "Renault Zoe",         driver: "Pedro Costa",    km: 29100, nextService: "32.000 km", nextDate: "Out 2026", tires: "OK",         brakes: "OK",        software: "v4.1.2",  status: "ok",      daysLeft: 65,  predictKm: 8200, predictAlert: null },
  { mat: "18-AB-07", model: "VW ID.4",             driver: "Marta Santos",   km: 51700, nextService: "54.000 km", nextDate: "Out 2026", tires: "OK",         brakes: "OK",        software: "v3.5.0",  status: "ok",      daysLeft: 58,  predictKm: 6100, predictAlert: null },
  { mat: "52-LX-33", model: "Hyundai IONIQ 5",     driver: "João Alves",     km: 33400, nextService: "36.000 km", nextDate: "Set 2026", tires: "Desgaste",   brakes: "OK",        software: "v1.9.4",  status: "atenção", daysLeft: 35,  predictKm: 3200, predictAlert: "Software v1.9.4 desactualizado. Actualização v2.1.0 corrige bug de gestão de bateria que reduz autonomia em 8% no Inverno." },
  { mat: "61-QR-77", model: "Peugeot e-2008",      driver: "Beatriz Nunes",  km: 19800, nextService: "24.000 km", nextDate: "Jan 2027", tires: "OK",         brakes: "OK",        software: "v2.3.1",  status: "ok",      daysLeft: 164, predictKm: 14200, predictAlert: null },
  { mat: "09-ST-12", model: "Kia EV6",             driver: "Rui Oliveira",   km: 44600, nextService: "48.000 km", nextDate: "Nov 2026", tires: "OK",         brakes: "Verificar", software: "v3.0.8",  status: "atenção", daysLeft: 88,  predictKm: 4800, predictAlert: "Sistema de travagem regenerativa com eficiência reduzida em 12%. Verificação recomendada antes dos 48.000 km." },
];

const checkItems = [
  { label: "Revisão geral",             icon: "settings" },
  { label: "Pneus",                     icon: "car" },
  { label: "Travões",                   icon: "car" },
  { label: "Actualização de software",  icon: "ai" },
  { label: "Inspecção de bateria",      icon: "battery" },
  { label: "Sistema de refrigeração",   icon: "zap" },
];

function CompanyMaintenance() {
  const [selected, setSelected] = useState<string | null>(null);
  const stStyle: Record<string, string> = {
    ok:      "text-muted-foreground bg-muted",
    atenção: "text-yellow-400 border border-yellow-800 bg-yellow-950/40",
    urgente: "text-red-400 border border-red-800 bg-red-950/40",
  };
  const rowTintM: Record<string, string> = {
    ok:      "",
    atenção: "bg-yellow-950/20 border-l-2 border-l-yellow-600",
    urgente: "bg-red-950/30 border-l-2 border-l-red-600",
  };

  const urgent   = maintenanceData.filter(v => v.status === "urgente").length;
  const attention = maintenanceData.filter(v => v.status === "atenção").length;
  const ok       = maintenanceData.filter(v => v.status === "ok").length;

  const detail = selected ? maintenanceData.find(v => v.mat === selected) : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl mb-1">Manutenção</h1>
        <p className="text-muted-foreground text-sm">Estado e próximas intervenções · toda a frota</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Urgente"      value={String(urgent)}   sub="intervenção imediata" icon="settings" highlight />
        <StatCard label="Atenção"      value={String(attention)} sub="agendar em breve"    icon="settings" />
        <StatCard label="OK"           value={String(ok)}        sub="sem acções"          icon="settings" />
      </div>

      {/* Predictive alerts */}
      {maintenanceData.filter(v => v.predictAlert).length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <div className="text-sm font-medium">Alertas Preditivos IA</div>
            <span className="text-xs text-muted-foreground ml-auto">Baseado no padrão de condução individual</span>
          </div>
          <div className="divide-y divide-border">
            {maintenanceData.filter(v => v.predictAlert).map(v => (
              <div key={v.mat} className={`px-5 py-4 flex items-start gap-4 ${rowTintM[v.status]}`}>
                <div className={`w-1.5 h-full rounded-full shrink-0 mt-1 ${v.status === "urgente" ? "bg-red-500" : "bg-yellow-500"}`} style={{ minHeight: 32 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium">{v.model}</div>
                    <span className="text-xs font-mono text-muted-foreground">{v.mat}</span>
                    <span className="text-xs text-muted-foreground">· {v.driver}</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{v.predictAlert}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold">{v.predictKm.toLocaleString()} km</div>
                  <div className="text-xs text-muted-foreground">até problema</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline urgency */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-sm font-medium mb-4">Próximas Manutenções</div>
        <div className="space-y-2">
          {[...maintenanceData].sort((a,b) => a.daysLeft - b.daysLeft).map(v => (
            <div key={v.mat} className={`flex items-center gap-4 py-2 border-b border-border last:border-0 rounded-lg px-2 -mx-2 ${rowTintM[v.status]}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${v.status==="urgente"?"bg-red-500":v.status==="atenção"?"bg-yellow-500":"bg-muted-foreground"}`} />
              <div className="text-xs font-mono text-muted-foreground w-20 shrink-0">{v.mat}</div>
              <div className="flex-1 text-sm">{v.model}</div>
              <div className="text-sm">{v.nextService}</div>
              <div className="text-xs text-muted-foreground w-24 text-right">{v.nextDate} · <span className="font-medium text-foreground">{v.daysLeft}d</span></div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${stStyle[v.status]}`}>{v.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="text-sm font-medium">Check-up por Veículo</div>
          {selected && <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Fechar detalhe</button>}
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-border">
            {["Matrícula","Modelo","km actuais","Próxima revisão","Pneus","Travões","Software","Estado"].map(h =>
              <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3.5">{h}</th>)}
          </tr></thead>
          <tbody>{maintenanceData.map((v, i) => (
            <tr key={v.mat} onClick={() => setSelected(v.mat === selected ? null : v.mat)}
              className={`border-b border-border last:border-0 cursor-pointer transition-colors ${v.mat===selected?"bg-secondary/50":""} ${rowTintM[v.status]} hover:brightness-110`}>
              <td className="px-5 py-3.5 text-xs font-mono">{v.mat}</td>
              <td className="px-5 py-3.5 text-sm">{v.model}</td>
              <td className="px-5 py-3.5 text-sm text-muted-foreground">{v.km.toLocaleString()} km</td>
              <td className="px-5 py-3.5 text-sm">{v.nextDate}</td>
              <td className="px-5 py-3.5">
                <span className={`text-xs ${v.tires==="OK"?"text-muted-foreground":"text-foreground border border-border px-2 py-0.5 rounded-full"}`}>{v.tires}</span>
              </td>
              <td className="px-5 py-3.5">
                <span className={`text-xs ${v.brakes==="OK"?"text-muted-foreground":"text-foreground border border-border px-2 py-0.5 rounded-full"}`}>{v.brakes}</span>
              </td>
              <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{v.software}</td>
              <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full ${stStyle[v.status]}`}>{v.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Detail panel */}
      {detail && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-lg font-semibold">{detail.model}</div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">{detail.mat} · {detail.driver}</div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full ${stStyle[detail.status]}`}>{detail.status}</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {checkItems.map(item => {
              const itemStatus =
                item.label === "Pneus" ? detail.tires :
                item.label === "Travões" ? detail.brakes :
                item.label === "Actualização de software" ? (detail.software.includes("1.9") ? "Desactualizado" : "OK") :
                "OK";
              const isOk = itemStatus === "OK";
              return (
                <div key={item.label} className={`rounded-xl p-4 border ${isOk ? "border-border bg-muted" : "border-border bg-secondary"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon d={ic[item.icon as keyof typeof ic]} size={14} className="text-muted-foreground" />
                    <div className={`w-2 h-2 rounded-full ${isOk ? "bg-muted-foreground" : "bg-foreground"}`} />
                  </div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className={`text-sm font-medium mt-0.5 ${isOk ? "text-muted-foreground" : "text-foreground"}`}>{itemStatus}</div>
                </div>
              );
            })}
          </div>
          <Btn variant="outline" className="w-full">Agendar Intervenção</Btn>
        </div>
      )}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
// ─── Company: EV Literacy ────────────────────────────────────────────────────
function CompanyLiteracy() {
  const [filterModel, setFilterModel] = useState("todos");
  const [filterTab, setFilterTab] = useState<"frota" | "tecnologia" | "noticias" | "recomendacoes">("frota");

  // Only models actually in the fleet
  const fleetModels = [...new Set(fleetData.map(v => v.model))];

  // Per-model verified technical data — sources listed inline
  const modelData: Record<string, {
    arch: string; maxDC: string; conector: string; bateria: string;
    wltp: string; watchouts: { titulo: string; detalhe: string; fonte: string; url: string }[];
    destaques: string[];
  }> = {
    "Volvo XC40 Recharge": {
      arch: "400V", maxDC: "150 kW", conector: "CCS2", bateria: "82 kWh",  wltp: "~423 km",
      watchouts: [
        { titulo: "Software Android Automotive requer conta Google", detalhe: "O sistema de info-entretenimento corre Android Automotive OS nativo. Funcionalidades como mapas e música dependem de conectividade Google. Em frotas com gestão de privacidade rigorosa, requer política clara de dados.", fonte: "Volvo Cars Media", url: "https://www.media.volvocars.com" },
        { titulo: "Actualizações OTA obrigatórias", detalhe: "A Volvo lança actualizações over-the-air que podem reiniciar o veículo. Programar fora do horário laboral para não afectar condutores.", fonte: "Volvo Support", url: "https://www.volvocars.com/pt/support" },
        { titulo: "Carregamento DC limitado a 150 kW", detalhe: "Em postos Ionity 350 kW, o XC40 carrega a máximo 150 kW. Tempo 0–80% em ~28 min em condições ideais. Temperatura baixa reduz taxa.", fonte: "InsideEVs", url: "https://insideevs.com" },
      ],
      destaques: ["Bomba de calor de série (modelos 2022+)", "Garantia bateria 8 anos/160.000 km", "Carregamento AC até 11 kW de série"],
    },
    "Tesla Model 3 LR": {
      arch: "400V", maxDC: "170 kW", conector: "CCS2 + Supercharger", bateria: "82 kWh", wltp: "~614 km",
      watchouts: [
        { titulo: "Phantom braking documentado em investigações NHTSA", detalhe: "Travagem autónoma não solicitada reportada em múltiplas versões do Autopilot. A Tesla emitiu actualizações de software. Monitorizar incidentes dos condutores na frota.", fonte: "NHTSA (nhtsa.gov)", url: "https://www.nhtsa.gov" },
        { titulo: "Autonomia real em Inverno pode cair 30–40%", detalhe: "O Model 3 com heat pump (pós-2021) mantém melhor eficiência no frio, mas condições abaixo de 5°C ainda reduzem autonomia significativamente. Planear rotas em Dezembro–Fevereiro.", fonte: "InsideEVs", url: "https://insideevs.com" },
        { titulo: "Rede Supercharger — compatibilidade Mobi.E", detalhe: "Os Superchargers Tesla em Portugal estão progressivamente abertos a outras marcas via CCS2 (Magic Dock). Verificar estado no site Tesla antes de incluir em políticas de frota.", fonte: "Tesla", url: "https://www.tesla.com/pt_PT/findus/list/superchargers/Portugal" },
      ],
      destaques: ["Maior autonomia WLTP da frota (614 km)", "Actualizações OTA frequentes e automáticas", "App Tesla com controlo remoto completo de frota"],
    },
    "BMW iX3": {
      arch: "400V", maxDC: "150 kW", conector: "CCS2", bateria: "80 kWh (74 kWh usável)", wltp: "~460 km",
      watchouts: [
        { titulo: "Sem suporte CHAdeMO", detalhe: "O iX3 usa exclusivamente CCS2. Postos CHAdeMO (raros em Portugal, comuns no Japão) não são compatíveis. Confirmar antes de viagens internacionais.", fonte: "BMW Group", url: "https://www.bmw.pt/pt/all-models/bmw-i/ix3" },
        { titulo: "Heat pump não incluída em todas as versões", detalhe: "Modelos iX3 anteriores a 2022 podem não ter bomba de calor, afectando consumo no Inverno. Verificar ficha técnica de cada veículo da frota.", fonte: "BMW Group Media", url: "https://www.bmwgroup.com/en/news/general/2021/ix3.html" },
        { titulo: "Software My BMW — actualizações manuais na concessionária", detalhe: "Ao contrário da Tesla, algumas actualizações de firmware do iX3 requerem visita à concessionária. Incluir no calendário de manutenção.", fonte: "BMW Support PT", url: "https://www.bmw.pt/pt/topics/fascination-bmw/connecteddrive/software-upgrade.html" },
      ],
      destaques: ["Motor eDrive Gen5 — eficiência de ponta", "Carregamento AC até 11 kW de série", "Plataforma CLAR adaptada para EV"],
    },
    "VW ID.4": {
      arch: "400V", maxDC: "135 kW", conector: "CCS2", bateria: "77 kWh", wltp: "~520 km",
      watchouts: [
        { titulo: "Problemas de software nos modelos 2021–2022 (corrigidos)", detalhe: "Os primeiros ID.4 tiveram bugs de software significativos (navegação, carregamento, painel). A VW emitiu actualizações OTA que resolvem a maioria. Verificar versão de software em veículos mais antigos da frota.", fonte: "Electrek", url: "https://electrek.co/tag/vw-id4/" },
        { titulo: "Carregamento AC limitado a 11 kW (padrão)", detalhe: "A versão padrão do ID.4 carrega em AC a 11 kW. Upgrade para 22 kW AC era opção paga em alguns mercados. Confirmar especificação dos veículos da frota.", fonte: "Volkswagen PT", url: "https://www.volkswagen.pt/pt/modelos/id4.html" },
        { titulo: "Bomba de calor — opção, não série", detalhe: "A heat pump no ID.4 era equipamento opcional. Sem ela, a autonomia no Inverno pode cair até 35%. Verificar ficha de cada veículo.", fonte: "VW Newsroom", url: "https://www.volkswagenag.com/en/news.html" },
      ],
      destaques: ["Plataforma MEB dedicada a EV", "Espaço interior generoso para segmento", "Actualizações OTA disponíveis"],
    },
    "Hyundai IONIQ 5": {
      arch: "800V", maxDC: "220 kW", conector: "CCS2", bateria: "77,4 kWh", wltp: "~481 km",
      watchouts: [
        { titulo: "Arquitectura 800V — requer adaptador em postos 400V DC", detalhe: "O IONIQ 5 carrega nativamente a 800V (ultra-rápido). Em postos DC 400V (ex: muitos postos Mobi.E 50 kW), usa adaptação interna mas a taxa cai. Funciona mas não à velocidade máxima.", fonte: "Hyundai PT", url: "https://www.hyundai.com/pt/vehicles/ioniq5.html" },
        { titulo: "V2L (Vehicle-to-Load) — gestão de política de frota", detalhe: "O IONIQ 5 pode alimentar equipamentos externos até 3,6 kW (tomada 230V no porta-bagagens). Definir política de frota sobre uso: é útil em estaleiros/eventos, mas pode descarregar o veículo.", fonte: "Hyundai Motor Company", url: "https://www.hyundai.com/worldwide/en/eco/ioniq5/highlights" },
        { titulo: "Actualização OTA da bateria (2023) — verificar versão", detalhe: "A Hyundai emitiu uma actualização de software de gestão de bateria para o IONIQ 5 em 2023 que melhora degradação e carregamento no frio. Confirmar que todos os veículos da frota têm a versão actualizada.", fonte: "InsideEVs", url: "https://insideevs.com/news/hyundai-ioniq-5/" },
      ],
      destaques: ["Maior taxa DC da frota: 220 kW (10–80% em 18 min)", "V2L: alimenta equipamentos externos até 3,6 kW", "Plataforma E-GMP — mesma do Kia EV6"],
    },
    "Peugeot e-2008": {
      arch: "400V", maxDC: "100 kW", conector: "CCS2", bateria: "50 kWh", wltp: "~320 km",
      watchouts: [
        { titulo: "Autonomia mais limitada — planear em percursos longos", detalhe: "Com 320 km WLTP e autonomia real de ~260–280 km em condução mista, o e-2008 é ideal para uso urbano/suburbano. Para viagens superiores a 200 km, planear paragem de carregamento.", fonte: "Peugeot PT", url: "https://www.peugeot.pt/veiculos/e-2008-suv.html" },
        { titulo: "Plataforma partilhada Stellantis — software comum a várias marcas", detalhe: "O e-2008 partilha plataforma e-CMP com Opel Mokka-e, DS 3 E-Tense, Citroën ë-C4. Actualizações de software afectam todas as marcas; seguir comunicações Stellantis para eventuais recalls.", fonte: "Stellantis Newsroom", url: "https://www.stellantis.com/en/news" },
        { titulo: "Sem bomba de calor de série", detalhe: "O e-2008 não inclui heat pump de série. Em Inverno, o aquecimento por resistência pode reduzir autonomia em 25–35%. Pré-aquecer sempre com veículo ligado à corrente.", fonte: "Autocar", url: "https://www.autocar.co.uk/car-review/peugeot/e-2008" },
      ],
      destaques: ["Compacto — ideal para cidade e parques urbanos", "Custo de aquisição mais baixo da frota", "Carregamento AC até 11 kW"],
    },
    "Kia EV6": {
      arch: "800V", maxDC: "240 kW", conector: "CCS2", bateria: "77,4 kWh", wltp: "~506 km",
      watchouts: [
        { titulo: "Arquitectura 800V — mesmo comportamento que IONIQ 5 em postos 400V", detalhe: "Partilha a plataforma E-GMP com o IONIQ 5. Em postos DC 400V, a carga funciona mas não à velocidade máxima. Nos poucos postos 350 kW em Portugal (Ionity), carrega a 240 kW.", fonte: "Kia PT", url: "https://www.kia.com/pt/ev6.html" },
        { titulo: "V2L disponível — mesma política de frota recomendada", detalhe: "Como o IONIQ 5, o EV6 tem V2L (3,6 kW). Definir política clara de uso para evitar descarga acidental em contexto de frota.", fonte: "Kia Media", url: "https://www.kia.com/worldwide/about-kia/media-center.html" },
        { titulo: "Carro do Ano 2022 — historial de fiabilidade ainda curto", detalhe: "O EV6 foi lançado em 2021. O historial de longo prazo é ainda limitado. Seguir relatórios de fiabilidade anuais (ex: JD Power, Auto Bild Zuverlässigkeitsreport) à medida que saem.", fonte: "Car and Driver", url: "https://www.caranddriver.com/kia/ev6" },
      ],
      destaques: ["Taxa DC mais alta da frota: 240 kW", "Maior autonomia WLTP da frota juntamente com Tesla", "Garantia bateria 7 anos/150.000 km (Kia PT)"],
    },
    "Renault Zoe": {
      arch: "400V", maxDC: "50 kW (ZE50)", conector: "CCS2 (ZE50) / AC Tipo 2", bateria: "52 kWh", wltp: "~395 km",
      watchouts: [
        { titulo: "Versão ZE40 (mais antiga) sem carregamento DC", detalhe: "A Zoe ZE40 (bateria 41 kWh, pré-2020) NÃO tem carregamento DC CCS2 — apenas AC até 22 kW. A ZE50 (52 kWh, 2020+) tem CCS2 até 50 kW. Confirmar qual versão está na frota.", fonte: "Renault PT", url: "https://www.renault.pt/veiculos-electricos/zoe.html" },
        { titulo: "Motor DC de 22 kW AC — ponto forte em carregamento público", detalhe: "A Zoe é um dos poucos EV que carrega AC em trifásico a 22 kW de série — muito útil nos postos EMEL de Lisboa. Mais rápido que a maioria dos concorrentes em AC.", fonte: "Zap-Map", url: "https://www.zap-map.com/ev-stats/models/renault-zoe" },
        { titulo: "Carregamento DC máximo de 50 kW — limitado em viagens longas", detalhe: "Em postos DC rápidos (50–350 kW), a Zoe ZE50 está limitada a 50 kW. Tempo 0–80%: ~80 min. Planear viagens longas com margens maiores vs IONIQ 5/EV6.", fonte: "InsideEVs", url: "https://insideevs.com/reviews/455816/2021-renault-zoe-ze50-review/" },
      ],
      destaques: ["22 kW AC de série — melhor carregamento AC da frota", "Maturidade de plataforma — modelo mais testado da frota", "Custo operacional reduzido em percursos urbanos"],
    },
  };

  // Verified news with real source domains
  const noticias = [
    {
      titulo: "Rede Mobi.E ultrapassa 12.000 pontos de carregamento em Portugal",
      resumo: "A rede pública de carregamento Mobi.E continua a crescer, com foco em corredores de autoestrada e municípios do interior. O Governo definiu meta de 70.000 pontos até 2030 no PNEC.",
      fonte: "Mobi.E / DGEG",
      url: "https://www.mobie.pt/relatorios",
      data: "2025",
      tag: "Infraestrutura",
      verificado: true,
    },
    {
      titulo: "UE confirma fim dos carros de combustão em 2035 — impacto nas frotas empresariais",
      resumo: "O Regulamento (UE) 2023/851 do Parlamento Europeu determina emissões zero para veículos novos a partir de 2035. Frotas empresariais têm janela de 10 anos para transição completa.",
      fonte: "EUR-Lex (eur-lex.europa.eu)",
      url: "https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32023R0851",
      data: "2023 (vigente)",
      tag: "Regulação EU",
      verificado: true,
    },
    {
      titulo: "ISV e IUC — isenções para veículos eléctricos em Portugal",
      resumo: "Os EV com emissões zero beneficiam de isenção total de ISV e taxa de IUC muito reduzida. Híbridos plug-in têm redução parcial. Actualizar política de frota para maximizar benefício fiscal.",
      fonte: "Autoridade Tributária (at.gov.pt)",
      url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/instrucoes_administrativas/Pages/Veiculos-eletricos-Isencao-de-ISV.aspx",
      data: "Vigente 2026",
      tag: "Fiscal Portugal",
      verificado: true,
    },
    {
      titulo: "OCPP 2.0.1 torna-se norma obrigatória nos novos postos públicos da UE",
      resumo: "A Directiva AFIR (Alternative Fuels Infrastructure Regulation) exige OCPP 2.0.1 em novos postos públicos da UE a partir de 2025, garantindo interoperabilidade e gestão de carga inteligente.",
      fonte: "ACEA (acea.auto)",
      url: "https://www.acea.auto/fact/afir-alternative-fuels-infrastructure-regulation/",
      data: "2025",
      tag: "Norma Técnica",
      verificado: true,
    },
    {
      titulo: "Incentivo IAPMEI para instalação de Wallbox em empresas",
      resumo: "O IAPMEI disponibilizou apoios à instalação de postos de carregamento em empresas ao abrigo do PRR. Valores e condições actualizados — consultar portal IAPMEI para candidatura.",
      fonte: "IAPMEI (iapmei.pt)",
      url: "https://www.iapmei.pt/Paginas/Mobilidade-Eletrica.aspx",
      data: "2024–2026",
      tag: "Incentivo PT",
      verificado: true,
    },
    {
      titulo: "Directiva CSRD — relatórios de sustentabilidade obrigatórios para PMEs",
      resumo: "A partir de 2026, PMEs com mais de 250 trabalhadores são abrangidas pela CSRD. As emissões Scope 1 e 2 da frota são parte obrigatória do relatório. O módulo ESG desta plataforma está alinhado.",
      fonte: "EUR-Lex CSRD",
      url: "https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:32022L2464",
      data: "Vigente 2024+",
      tag: "Regulação ESG",
      verificado: true,
    },
  ];

  const recomendacoes = [
    { icone: "🔋", titulo: "Regra dos 20–80%", detalhe: "Definir política de frota que limite o carregamento diário entre 20% e 80% de SOC. Cargas completas diárias aceleram degradação da bateria em 2–3× ao longo de 5 anos. Reservar 100% para viagens longas.", urgencia: "importante", fonte: "Battery University", url: "https://batteryuniversity.com/article/bu-415-charging-at-high-voltage" },
    { icone: "🌙", titulo: "Carregamento nocturno programado", detalhe: "Programar carregamento das Wallbox para o período 22h00–06h00 com tarifa bi-horária. Poupança de 40–60% no custo de energia vs carregamento diurno. A maioria dos carregadores suporta agendamento via app.", urgencia: "recomendado", fonte: "ERSE (erse.pt)", url: "https://www.erse.pt/atividade/regulacao/tarifas-e-precos/ciclos-de-faturacao/" },
    { icone: "❄️", titulo: "Protocolo de Inverno para a frota", detalhe: "Abaixo de 5°C, a autonomia cai 15–35% dependendo do modelo. Estabelecer protocolo: pré-condicionamento com veículo ligado, ajuste de rotas planificadas, e limite de SOC mínimo aumentado para 30% (vs 20% normal).", urgencia: "importante", fonte: "AAA (exchange.aaa.com)", url: "https://exchange.aaa.com/automotive/electric-vehicles/electric-vehicle-range-testing/" },
    { icone: "📋", titulo: "Inspecção trimestral de SOH", detalhe: "Agendar leitura de State of Health (SOH) a cada 3 meses para todos os veículos via OBD2 ou app oficial. Um SOH abaixo de 80% activa garantia da maioria dos fabricantes. Documentar para suporte à garantia.", urgencia: "recomendado", fonte: "Recurrent (recurrentauto.com)", url: "https://www.recurrentauto.com/research/ev-battery-health" },
    { icone: "⚡", titulo: "Política de carregamento DC rápido", detalhe: "Limitar carregamentos DC (50–350 kW) a máximo 2× por semana por veículo. Uso diário de DC acelera degradação da bateria. Excepção: viagens longas inevitáveis. IONIQ 5 e EV6 (800V) toleram melhor que modelos 400V.", urgencia: "importante", fonte: "Geotab (geotab.com)", url: "https://www.geotab.com/blog/ev-charging-guide/" },
    { icone: "🔧", titulo: "Técnicos certificados em alta tensão", detalhe: "Qualquer intervenção mecânica ou eléctrica em EV deve ser feita por técnicos com certificação em sistemas de alta tensão (HV). Em Portugal, formação reconhecida pelo IMT. Acidentes com 400–800V são fatais.", urgencia: "critico", fonte: "IMT (imt-ip.pt)", url: "https://www.imt-ip.pt/sites/IMTT/Portugues/Formacao/Paginas/Homologacao.aspx" },
    { icone: "📱", titulo: "Integração com Mobi.E para relatórios de frota", detalhe: "A Mobi.E disponibiliza API e relatórios de utilização para gestores de frota. Permite rastrear consumos em rede pública, custos reais e sessões por veículo. Útil para validação de reembolsos.", urgencia: "recomendado", fonte: "Mobi.E", url: "https://www.mobie.pt/operadores-de-mobilidade" },
  ];

  const techData = [
    { tema: "800V vs 400V", conteudo: "Os IONIQ 5 e EV6 usam arquitectura 800V (E-GMP), que permite carregamento DC muito mais rápido (10–80% em 18 min a 220–240 kW). Os restantes modelos da frota usam 400V, com máximo de 100–170 kW DC. Em postos 350 kW (Ionity), os modelos 400V não aproveitam toda a capacidade.", fonte: "Hyundai Motor Group", url: "https://www.hyundaimotorgroup.com/story/CONT0000000000021309" },
    { tema: "CCS2 — o conector padrão", conteudo: "Todos os modelos da frota usam CCS2 (Combined Charging System tipo 2). Em Portugal, a Mobi.E opera exclusivamente CCS2 e Tipo 2 AC. CHAdeMO foi descontinuado na Europa — os raros postos CHAdeMO existentes são irrelevantes para esta frota.", fonte: "CharIN (charinev.org)", url: "https://www.charinev.org/ccs-at-a-glance/the-combined-charging-system/" },
    { tema: "OCPP 2.0.1 — o que muda na gestão de frota", conteudo: "A norma OCPP 2.0.1 introduz smart charging bidirecional: a Wallbox comunica com o gestor de rede e pode ajustar automaticamente a potência conforme disponibilidade da rede eléctrica. Fundamental para frotas com múltiplos carregadores simultâneos.", fonte: "Open Charge Alliance", url: "https://www.openchargealliance.org/protocols/ocpp-201/" },
    { tema: "Gestão térmica da bateria", conteudo: "Modelos com gestão térmica líquida activa (Tesla, IONIQ 5, EV6, VW ID.4) toleram melhor carregamentos DC frequentes e temperaturas extremas. O Peugeot e-2008 e o Renault Zoe têm gestão menos sofisticada — mais sensíveis ao frio e ao calor.", fonte: "Battery University", url: "https://batteryuniversity.com/article/bu-410a-electric-vehicle-battery" },
    { tema: "V2L — Vehicle to Load", conteudo: "O IONIQ 5 e o EV6 têm saída V2L (3,6 kW / 230V AC), equivalente a uma tomada doméstica. Útil para alimentar equipamentos em estaleiros ou eventos. Descarrega a bateria do veículo — definir política de uso em frota.", fonte: "Hyundai", url: "https://www.hyundai.com/worldwide/en/eco/ioniq5/highlights" },
  ];

  const filteredModels = filterModel === "todos" ? fleetModels : [filterModel];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl mb-1">Literacia de Mobilidade Eléctrica</h1>
        <p className="text-muted-foreground text-sm">Informação verificada · fontes oficiais e técnicas · actualizada 2025–2026</p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl">
        {([
          { id: "frota",          label: "Por Modelo da Frota" },
          { id: "tecnologia",     label: "Tecnologia" },
          { id: "noticias",       label: "Notícias & Regulação" },
          { id: "recomendacoes",  label: "Recomendações" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setFilterTab(t.id)}
            className={`flex-1 text-xs py-2 px-3 rounded-lg transition-colors font-medium ${filterTab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Frota */}
      {filterTab === "frota" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterModel("todos")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterModel === "todos" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              Todos os modelos
            </button>
            {fleetModels.map(m => (
              <button key={m} onClick={() => setFilterModel(m)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterModel === m ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {m.split(" ").slice(-2).join(" ")}
              </button>
            ))}
          </div>

          {filteredModels.map(model => {
            const d = modelData[model];
            if (!d) return null;
            const vehicles = fleetData.filter(v => v.model === model);
            return (
              <div key={model} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base font-semibold">{model}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {vehicles.length} veículo{vehicles.length > 1 ? "s" : ""} na frota · {vehicles.map(v => v.id).join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <span className={`text-xs border px-2 py-1 rounded-full ${d.arch === "800V" ? "border-primary text-foreground bg-primary/10" : "border-border text-muted-foreground"}`}>{d.arch}</span>
                      <span className="text-xs border border-border px-2 py-1 rounded-full text-muted-foreground">{d.conector}</span>
                      <span className="text-xs border border-border px-2 py-1 rounded-full text-muted-foreground">DC máx {d.maxDC}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="text-xs text-muted-foreground">Bateria: <span className="text-foreground">{d.bateria}</span></div>
                    <div className="text-xs text-muted-foreground">WLTP: <span className="text-foreground">{d.wltp}</span></div>
                  </div>
                  {d.destaques.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {d.destaques.map(dest => (
                        <span key={dest} className="text-xs border border-border bg-secondary/50 px-2 py-0.5 rounded-full text-muted-foreground">{dest}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {d.watchouts.map((w, i) => (
                    <div key={i} className="px-5 py-4 flex items-start gap-4">
                      <div className="w-1.5 h-full rounded-full bg-yellow-500/60 shrink-0 mt-1" style={{ minHeight: 28 }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-0.5">{w.titulo}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed mb-2">{w.detalhe}</div>
                        <ExternalLink href={w.url}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-2 py-0.5 rounded-full">
                          Fonte: {w.fonte} ↗
                        </ExternalLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Tecnologia */}
      {filterTab === "tecnologia" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-medium mb-0.5">Comparação de arquitectura — frota actual</div>
            <div className="text-xs text-muted-foreground">Impacto directo na velocidade de carregamento e compatibilidade com rede pública</div>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-border">
                {["Modelo", "Arq.", "DC máx", "AC máx", "WLTP", "Destaque"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {fleetModels.map((m, i) => {
                  const d = modelData[m];
                  if (!d) return null;
                  return (
                    <tr key={m} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/10" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium">{m}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${d.arch === "800V" ? "border-primary/40 text-foreground" : "border-border text-muted-foreground"}`}>{d.arch}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{d.maxDC}</td>
                      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{m === "Renault Zoe" ? "22 kW" : "11 kW"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{d.wltp}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px]">{d.destaques[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="space-y-3">
            {techData.map(t => (
              <div key={t.tema} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="text-sm font-semibold">{t.tema}</div>
                  <ExternalLink href={t.url}
                    className="text-xs border border-border px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    {t.fonte} ↗
                  </ExternalLink>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">{t.conteudo}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Notícias */}
      {filterTab === "noticias" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="text-xs text-muted-foreground">Apenas informação verificada com fontes primárias oficiais ou reconhecidas. Cada item inclui link directo à fonte.</div>
          </div>
          {noticias.map(n => (
            <div key={n.titulo} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">{n.tag}</span>
                    <span className="text-xs text-muted-foreground">{n.data}</span>
                    {n.verificado && (
                      <span className="text-xs flex items-center gap-1 text-muted-foreground">
                        <span className="text-foreground">✓</span> Verificado
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold mb-1">{n.titulo}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{n.resumo}</div>
                </div>
              </div>
              <ExternalLink href={n.url}
                className="inline-flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mt-2">
                Fonte: {n.fonte} ↗
              </ExternalLink>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Recomendações */}
      {filterTab === "recomendacoes" && (
        <div className="space-y-3">
          {recomendacoes.map(r => {
            const tintMap: Record<string, string> = {
              critico:    "border-l-4 border-l-red-600 bg-red-950/20",
              importante: "border-l-4 border-l-yellow-600 bg-yellow-950/10",
              recomendado:"",
            };
            const badgeMap: Record<string, string> = {
              critico:    "text-red-400 border-red-800 bg-red-950/40",
              importante: "text-yellow-400 border-yellow-800 bg-yellow-950/30",
              recomendado:"text-muted-foreground border-border",
            };
            return (
              <div key={r.titulo} className={`bg-card border border-border rounded-xl p-5 ${tintMap[r.urgencia]}`}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl shrink-0">{r.icone}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="text-sm font-semibold">{r.titulo}</div>
                      <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${badgeMap[r.urgencia]}`}>{r.urgencia}</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed mb-3">{r.detalhe}</div>
                    <ExternalLink href={r.url}
                      className="inline-flex items-center gap-1 text-xs border border-border px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                      Fonte: {r.fonte} ↗
                    </ExternalLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Company: Message Manager ─────────────────────────────────────────────────
function CompanyMessages() {
  const { announcements, setAnnouncements } = useAnnouncements();
  const [draft, setDraft] = useState({ titulo: "", corpo: "", prioridade: "info" as Announcement["prioridade"], destino: "todos" });
  const [composing, setComposing] = useState(false);

  const prioStyle: Record<string, string> = {
    urgente: "text-red-400 border-red-800 bg-red-950/40",
    aviso:   "text-yellow-400 border-yellow-800 bg-yellow-950/30",
    info:    "text-muted-foreground border-border",
  };
  const rowTint: Record<string, string> = {
    urgente: "bg-red-950/20 border-l-2 border-l-red-600",
    aviso:   "bg-yellow-950/10 border-l-2 border-l-yellow-600",
    info:    "",
  };

  const send = () => {
    if (!draft.titulo.trim() || !draft.corpo.trim()) return;
    const now = new Date();
    const data = `${now.getDate()} ${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][now.getMonth()]} ${now.getFullYear()}`;
    setAnnouncements(prev => [{ id: Date.now(), ...draft, data, lida: false }, ...prev]);
    setDraft({ titulo: "", corpo: "", prioridade: "info", destino: "todos" });
    setComposing(false);
  };

  const remove = (id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-1">Comunicados & Anúncios</h1>
          <p className="text-muted-foreground text-sm">Mensagens enviadas a todos os condutores da frota</p>
        </div>
        <Btn variant="primary" onClick={() => setComposing(c => !c)}>
          {composing ? "Cancelar" : "+ Novo comunicado"}
        </Btn>
      </div>

      {/* Compose panel */}
      {composing && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="text-sm font-medium">Novo comunicado</div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Título</label>
            <input value={draft.titulo} onChange={e => setDraft(d => ({ ...d, titulo: e.target.value }))}
              placeholder="Ex: Revisão obrigatória — Tesla Model 3 (29-KT-18)"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Mensagem</label>
            <textarea value={draft.corpo} onChange={e => setDraft(d => ({ ...d, corpo: e.target.value }))}
              rows={3} placeholder="Escreve aqui o detalhe do comunicado..."
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Prioridade</label>
              <div className="flex gap-2">
                {(["urgente","aviso","info"] as const).map(p => (
                  <button key={p} onClick={() => setDraft(d => ({ ...d, prioridade: p }))}
                    className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors capitalize ${draft.prioridade === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">Destinatário</label>
              <select value={draft.destino} onChange={e => setDraft(d => ({ ...d, destino: e.target.value }))}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40">
                <option value="todos">Todos os condutores</option>
                {fleetData.map(v => (
                  <option key={v.id} value={v.id}>{v.driver} ({v.id})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Btn variant="outline" className="flex-1" onClick={() => setComposing(false)}>Cancelar</Btn>
            <Btn variant="primary" className="flex-1" onClick={send}
              disabled={!draft.titulo.trim() || !draft.corpo.trim()}>
              Enviar a {draft.destino === "todos" ? "todos os condutores" : fleetData.find(v => v.id === draft.destino)?.driver}
            </Btn>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total"   value={String(announcements.length)} sub="comunicados"       icon="faq" />
        <StatCard label="Por ler" value={String(announcements.filter(a => !a.lida).length)} sub="condutores" icon="bell" highlight={announcements.filter(a => !a.lida).length > 0} />
        <StatCard label="Urgentes" value={String(announcements.filter(a => a.prioridade === "urgente").length)} sub="activos" icon="settings" />
      </div>

      {/* List */}
      <div className="space-y-2">
        {announcements.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
            Sem comunicados. Cria o primeiro acima.
          </div>
        )}
        {announcements.map(a => (
          <div key={a.id} className={`bg-card border border-border rounded-xl p-4 ${rowTint[a.prioridade]}`}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${prioStyle[a.prioridade]}`}>{a.prioridade}</span>
                  <span className="text-xs text-muted-foreground">{a.data}</span>
                  <span className="text-xs text-muted-foreground">→ {a.destino === "todos" ? "Todos os condutores" : fleetData.find(v => v.id === a.destino)?.driver ?? a.destino}</span>
                  {!a.lida && <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">Por ler</span>}
                </div>
                <div className="text-sm font-semibold mb-0.5">{a.titulo}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{a.corpo}</div>
              </div>
              <button onClick={() => remove(a.id)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1 text-xs border border-border rounded-lg px-2 py-1">
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Driver: Announcements ────────────────────────────────────────────────────
function DriverAnnouncements() {
  const { announcements, setAnnouncements } = useAnnouncements();
  const driverVehicle = fleetData.find(v => v.driver === "João Alves");
  const relevant = announcements.filter(a => a.destino === "todos" || a.destino === driverVehicle?.id);

  const markRead = (id: number) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, lida: true } : a));
  const markAllRead = () =>
    setAnnouncements(prev => prev.map(a => ({ ...a, lida: true })));

  const prioStyle: Record<string, string> = {
    urgente: "text-red-400 border-red-800 bg-red-950/40",
    aviso:   "text-yellow-400 border-yellow-800 bg-yellow-950/30",
    info:    "text-muted-foreground border-border",
  };
  const rowTint: Record<string, string> = {
    urgente: "bg-red-950/20 border-l-2 border-l-red-600",
    aviso:   "bg-yellow-950/10 border-l-2 border-l-yellow-600",
    info:    "",
  };

  const unread = relevant.filter(a => !a.lida).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-1">Comunicados</h1>
          <p className="text-muted-foreground text-sm">Mensagens da empresa · veículo {driverVehicle?.id ?? ""}</p>
        </div>
        {unread > 0 && (
          <Btn variant="outline" onClick={markAllRead}>
            Marcar tudo como lido ({unread})
          </Btn>
        )}
      </div>

      {unread > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-foreground animate-pulse shrink-0" />
          <div className="text-sm">{unread} comunicado{unread > 1 ? "s" : ""} por ler</div>
        </div>
      )}

      {relevant.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
          Sem comunicados de momento.
        </div>
      )}

      <div className="space-y-2">
        {relevant.map(a => (
          <div key={a.id}
            className={`bg-card border border-border rounded-xl p-4 transition-opacity ${rowTint[a.prioridade]} ${a.lida ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-4">
              {!a.lida && <div className="w-2 h-2 rounded-full bg-foreground shrink-0 mt-2" />}
              {a.lida && <div className="w-2 h-2 rounded-full bg-border shrink-0 mt-2" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${prioStyle[a.prioridade]}`}>{a.prioridade}</span>
                  <span className="text-xs text-muted-foreground">{a.data}</span>
                </div>
                <div className="text-sm font-semibold mb-1">{a.titulo}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{a.corpo}</div>
              </div>
              {!a.lida && (
                <button onClick={() => markRead(a.id)}
                  className="text-xs border border-border px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                  Marcar lido
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Driver: Community ────────────────────────────────────────────────────────
const tipoLabel: Record<string, string> = {
  posto_avariado: "Posto Avariado",
  info_errada:    "Info Errada na App",
  problema_rota:  "Problema de Rota",
  outro:          "Outro",
};
const estadoStyle: Record<string, string> = {
  pendente:   "text-muted-foreground border-border",
  em_analise: "text-yellow-400 border-yellow-800 bg-yellow-950/30",
  resolvido:  "text-foreground border-border bg-secondary",
};
const estadoRowTint: Record<string, string> = {
  pendente:   "",
  em_analise: "border-l-2 border-l-yellow-600",
  resolvido:  "opacity-70",
};

function DriverCommunity() {
  const { reports, setReports } = useReports();
  const [composing, setComposing] = useState(false);
  const [filterTipo, setFilterTipo] = useState("todos");
  const [draft, setDraft] = useState({ tipo: "posto_avariado" as Report["tipo"], titulo: "", descricao: "", local: "" });

  const filtered = filterTipo === "todos" ? reports : reports.filter(r => r.tipo === filterTipo);
  const meuId = "João Alves";

  const submit = () => {
    if (!draft.titulo.trim() || !draft.descricao.trim()) return;
    const now = new Date();
    const data = `${now.getDate()} ${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][now.getMonth()]} ${now.getFullYear()}`;
    setReports(prev => [{ id: Date.now(), ...draft, autor: meuId, data, estado: "pendente", resposta: "", votos: 0, votei: false }, ...prev]);
    setDraft({ tipo: "posto_avariado", titulo: "", descricao: "", local: "" });
    setComposing(false);
  };

  const votar = (id: number) => setReports(prev => prev.map(r =>
    r.id === id ? { ...r, votos: r.votei ? r.votos - 1 : r.votos + 1, votei: !r.votei } : r
  ));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-1">Comunidade</h1>
          <p className="text-muted-foreground text-sm">Reporta problemas · ajuda outros condutores · melhora a app</p>
        </div>
        <Btn variant="primary" onClick={() => setComposing(c => !c)}>
          {composing ? "Cancelar" : "+ Reportar problema"}
        </Btn>
      </div>

      {/* Compose */}
      {composing && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="text-sm font-medium">Novo reporte</div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tipo de problema</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(tipoLabel) as [Report["tipo"], string][]).map(([k, v]) => (
                <button key={k} onClick={() => setDraft(d => ({ ...d, tipo: k }))}
                  className={`py-2.5 px-3 rounded-xl border text-sm text-left transition-colors ${draft.tipo === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Título breve</div>
            <input value={draft.titulo} onChange={e => setDraft(d => ({ ...d, titulo: e.target.value }))}
              placeholder={draft.tipo === "posto_avariado" ? "Ex: EMEL · Av. Roma — posto 2 avariado" : "Descreve o problema em poucas palavras"}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Descrição detalhada</div>
            <textarea value={draft.descricao} onChange={e => setDraft(d => ({ ...d, descricao: e.target.value }))}
              rows={3} placeholder="Detalha o que aconteceu, quando, e como reproduzir o problema..."
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40 resize-none" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Local (opcional)</div>
            <input value={draft.local} onChange={e => setDraft(d => ({ ...d, local: e.target.value }))}
              placeholder="Ex: EMEL · Av. da Liberdade 185, Lisboa"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40" />
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" className="flex-1" onClick={() => setComposing(false)}>Cancelar</Btn>
            <Btn variant="primary" className="flex-1" onClick={submit} disabled={!draft.titulo.trim() || !draft.descricao.trim()}>
              Submeter reporte
            </Btn>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Reportes activos" value={String(reports.filter(r => r.estado !== "resolvido").length)} sub="em aberto" icon="faq" />
        <StatCard label="Em análise"        value={String(reports.filter(r => r.estado === "em_analise").length)} sub="equipa a verificar" icon="settings" highlight={reports.some(r => r.estado === "em_analise")} />
        <StatCard label="Resolvidos"        value={String(reports.filter(r => r.estado === "resolvido").length)} sub="pela empresa" icon="zap" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[["todos","Todos"], ["posto_avariado","Postos"], ["info_errada","Info App"], ["problema_rota","Rotas"], ["outro","Outros"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilterTipo(k)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterTipo === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {v}
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.sort((a, b) => b.votos - a.votos).map(r => (
          <div key={r.id} className={`bg-card border border-border rounded-xl p-4 ${estadoRowTint[r.estado]}`}>
            <div className="flex items-start gap-4">
              {/* Vote */}
              <button onClick={() => votar(r.id)}
                className={`flex flex-col items-center gap-0.5 shrink-0 pt-0.5 w-10 group`}>
                <div className={`text-xs transition-colors ${r.votei ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>▲</div>
                <div className={`text-sm font-semibold ${r.votei ? "text-foreground" : "text-muted-foreground"}`}>{r.votos}</div>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">{tipoLabel[r.tipo]}</span>
                  <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${estadoStyle[r.estado]}`}>{r.estado.replace("_"," ")}</span>
                  <span className="text-xs text-muted-foreground">{r.autor} · {r.data}</span>
                </div>
                <div className="text-sm font-semibold mb-0.5">{r.titulo}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{r.descricao}</div>
                {r.local && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <span className="text-muted-foreground/60">📍</span> {r.local}
                  </div>
                )}
                {r.resposta && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-0.5">Resposta da empresa:</div>
                    <div className="text-xs leading-relaxed">{r.resposta}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Company: Reports Manager ─────────────────────────────────────────────────
function CompanyReportManager() {
  const { reports, setReports } = useReports();
  const [filterEstado, setFilterEstado] = useState("todos");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [respostaText, setRespostaText] = useState<Record<number, string>>({});

  const filtered = filterEstado === "todos" ? reports : reports.filter(r => r.estado === filterEstado);
  const sorted = [...filtered].sort((a, b) => {
    const order = { pendente: 0, em_analise: 1, resolvido: 2 };
    return order[a.estado] - order[b.estado] || b.votos - a.votos;
  });

  const setEstado = (id: number, estado: Report["estado"]) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, estado } : r));

  const responder = (id: number) => {
    const texto = respostaText[id]?.trim();
    if (!texto) return;
    setReports(prev => prev.map(r => r.id === id ? { ...r, resposta: texto, estado: "resolvido" } : r));
    setRespostaText(prev => ({ ...prev, [id]: "" }));
    setExpanded(null);
  };

  const pendentes = reports.filter(r => r.estado === "pendente").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl mb-1">Gestão de Reportes</h1>
        <p className="text-muted-foreground text-sm">Problemas reportados pelos condutores · responder e resolver</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Pendentes"   value={String(reports.filter(r => r.estado === "pendente").length)}   sub="por tratar"       icon="faq"      highlight={pendentes > 0} />
        <StatCard label="Em análise"  value={String(reports.filter(r => r.estado === "em_analise").length)} sub="em curso"         icon="settings" />
        <StatCard label="Resolvidos"  value={String(reports.filter(r => r.estado === "resolvido").length)}  sub="concluídos"       icon="zap" />
        <StatCard label="Votos total" value={String(reports.reduce((s, r) => s + r.votos, 0))}              sub="relevância total" icon="trending" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[["todos","Todos"],["pendente","Pendentes"],["em_analise","Em análise"],["resolvido","Resolvidos"]].map(([k, v]) => (
          <button key={k} onClick={() => setFilterEstado(k)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterEstado === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map(r => (
          <div key={r.id} className={`bg-card border border-border rounded-xl overflow-hidden ${estadoRowTint[r.estado]}`}>
            <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              {/* Vote count */}
              <div className="flex flex-col items-center gap-0.5 shrink-0 w-10">
                <div className="text-xs text-muted-foreground">▲</div>
                <div className="text-sm font-semibold">{r.votos}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">{tipoLabel[r.tipo]}</span>
                  <span className={`text-xs border px-2 py-0.5 rounded-full capitalize ${estadoStyle[r.estado]}`}>{r.estado.replace("_"," ")}</span>
                  <span className="text-xs text-muted-foreground">{r.autor} · {r.data}</span>
                </div>
                <div className="text-sm font-semibold">{r.titulo}</div>
                {r.local && <div className="text-xs text-muted-foreground mt-0.5">📍 {r.local}</div>}
              </div>
              {/* Quick actions */}
              <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                {r.estado === "pendente" && (
                  <button onClick={() => setEstado(r.id, "em_analise")}
                    className="text-xs border border-yellow-800 text-yellow-400 bg-yellow-950/30 px-2.5 py-1 rounded-lg hover:bg-yellow-950/50 transition-colors">
                    Em análise
                  </button>
                )}
                {r.estado !== "resolvido" && (
                  <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="text-xs border border-border px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    Responder
                  </button>
                )}
                {r.estado === "resolvido" && (
                  <span className="text-xs border border-border px-2.5 py-1 rounded-lg text-muted-foreground">✓ Resolvido</span>
                )}
              </div>
            </div>

            {/* Expanded detail + reply */}
            {expanded === r.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
                <div className="text-xs text-muted-foreground leading-relaxed pt-3">{r.descricao}</div>
                {r.resposta && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Resposta actual:</div>
                    <div className="text-xs">{r.resposta}</div>
                  </div>
                )}
                {r.estado !== "resolvido" && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Resposta ao condutor</div>
                    <textarea
                      value={respostaText[r.id] ?? ""}
                      onChange={e => setRespostaText(prev => ({ ...prev, [r.id]: e.target.value }))}
                      rows={2} placeholder="Escreve uma resposta visível ao condutor..."
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => setEstado(r.id, "em_analise")}
                        className={`text-xs border px-3 py-1.5 rounded-lg transition-colors ${r.estado === "em_analise" ? "border-yellow-800 text-yellow-400 bg-yellow-950/30" : "border-border text-muted-foreground hover:text-foreground"}`}>
                        Marcar em análise
                      </button>
                      <Btn variant="primary" className="text-xs py-1.5 px-3" onClick={() => responder(r.id)}
                        disabled={!(respostaText[r.id]?.trim())}>
                        Responder & Resolver
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const companyNav = [
  { id: "dashboard",     label: "Dashboard",      icon: "dashboard",  component: CompanyDashboard },
  { id: "fleet",         label: "Frota",          icon: "fleet",      component: CompanyFleet },
  { id: "charging",      label: "Carregamentos",  icon: "charge",     component: CompanyCharging },
  { id: "reimburse",     label: "Reembolsos",     icon: "reimburse",  component: CompanyReimbursements },
  { id: "analysis",      label: "Análise",        icon: "trending",   component: CompanyAnalysis },
  { id: "maintenance",   label: "Manutenção",     icon: "settings",   component: CompanyMaintenance },
  { id: "esg",           label: "CO₂ / ESG",      icon: "co2",        component: CompanyESG },
  { id: "literacy",      label: "Literacia EV",   icon: "ai",         component: CompanyLiteracy },
  { id: "announcements", label: "Comunicados",    icon: "bell",       component: CompanyMessages },
  { id: "reports",       label: "Reportes",       icon: "faq",        component: CompanyReportManager },
  { id: "faq",           label: "FAQ",            icon: "faq",        component: CompanyFAQ },
];
// ─── Driver: Onboarding ──────────────────────────────────────────────────────
function DriverOnboarding() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ commute: "", dailyKm: "", hasWallbox: "", chargeAt: "" });

  const steps = [
    { id: "welcome",   label: "Bem-vindo" },
    { id: "profile",   label: "O teu perfil" },
    { id: "basics",    label: "Conceitos base" },
    { id: "charging",  label: "Carregamento" },
    { id: "costs",     label: "Custos & Poupança" },
    { id: "donts",     label: "O que não fazer" },
    { id: "platforms", label: "Plataformas úteis" },
    { id: "done",      label: "Pronto!" },
  ];

  const isHybrid = profile.commute === "hibrido";

  const platformsList = [
    { name: "Mobi.E App",      cat: "Carregamento",   desc: "Acesso a toda a rede pública portuguesa. Ponto de partida para qualquer condutor EV.",  url: "https://www.mobie.pt",                        },
    { name: "EMEL App",        cat: "Carregamento",   desc: "Postos EMEL em Lisboa. Sem custo de activação, melhor opção se resides/trabalhas em Lisboa.", url: "https://www.emel.pt/mobilidade-electrica",    },
    { name: "PlugShare",       cat: "Comunidade",     desc: "Mapa colaborativo global. Comentários em tempo real sobre postos, avarias e dicas.",     url: "https://www.plugshare.com",                   },
    { name: "AEDP",            cat: "Associação",     desc: "Associação Portuguesa de Veículos Eléctricos. Notícias, incentivos e comunidade nacional.", url: "https://www.aedp.pt",                        },
    { name: "EDP Charge",      cat: "Carregamento",   desc: "Rede EDP com tarifa reduzida. Subscrição mensal recomendada para utilizadores frequentes.",  url: "https://www.edp.pt/mobilidade-electrica",    },
    { name: "DGEG",            cat: "Informação",     desc: "Dados oficiais de incentivos, certificados de energia renovável e legislação em Portugal.",  url: "https://www.dgeg.gov.pt",                    },
    { name: "Electromaps",     cat: "Mapa",           desc: "Alternativa ao PlugShare. Bom para planear viagens longas em Portugal e Europa.",          url: "https://www.electromaps.com",                },
    { name: "Zap-Map",         cat: "Mapa",           desc: "Referência no Reino Unido, útil para viagens internacionais e comparação de redes.",       url: "https://www.zap-map.com",                    },
  ];

  const concepts = [
    { term: "kWh",            def: "Kilowatt-hora — a 'garrafa' de energia. Um EV típico consome 15–20 kWh/100 km. O teu carro tem uma bateria de 64–100 kWh." },
    { term: "SOC",            def: "State of Charge — percentagem de carga actual. Equivalente ao 'nível de combustível'. Ideal manter entre 20% e 80% no dia-a-dia." },
    { term: "SOH",            def: "State of Health — saúde da bateria ao longo do tempo. Uma bateria nova é 100%; ao fim de 10 anos pode ser 80–85%. Normal e sem impacto real." },
    { term: "AC vs DC",       def: "AC (corrente alternada) é lento mas suave para a bateria — para casa e escritório. DC (corrente contínua) é rápido — para viagens longas. Não uses DC diariamente." },
    { term: "CCS2 / Tipo 2",  def: "Os dois conectores mais comuns em Portugal. Tipo 2 é para AC (normal). CCS2 é para DC (rápido). O teu carro tem os dois — o carregador adapta automaticamente." },
    { term: "Autonomia real", def: "A autonomia no painel é estimada. No Inverno pode baixar 15–30%. A altas velocidades (130 km/h) podes perder 40% vs velocidade de cidade. Planeia com margem." },
    { term: "Regeneração",    def: "Ao travar ou abrandar, o motor recupera energia para a bateria. É por isso que os EV têm travões que duram muito mais tempo que os de combustão." },
    { term: "Wallbox",        def: "Carregador doméstico de parede (7–22 kW AC). Carrega 5–10× mais rápido que uma tomada normal. Obrigatório para uso diário confortável." },
  ];

  const hybridSpecific = [
    { term: "Modo EV",        def: "Circula apenas em eléctrico até a bateria esgotar. Activa-o em cidade para poupar combustível e não poluir." },
    { term: "Recarga em frenagem", def: "Nos híbridos, a bateria carrega sozinha ao travar. Não precisas de plug — mas podes ligar para carregar mais depressa." },
    { term: "Motor térmico", def: "Entra automaticamente em autoestrada ou quando a bateria está fraca. Não é uma falha — é o design do híbrido." },
  ];

  const donts = [
    { icon: "⚡", titulo: "Não carregues sempre a 100%", detalhe: "Manter entre 20–80% prolonga a vida da bateria em anos. Carrega a 100% só antes de viagens longas." },
    { icon: "❄️", titulo: "Não deixes a bateria a 0% no frio", detalhe: "Descarregar completamente no Inverno danifica as células. O carro protege-te, mas força a situação repetidamente e nota-se." },
    { icon: "🔌", titulo: "Não uses DC rápido todos os dias", detalhe: "Carregamentos DC rápidos (50–350 kW) geram calor nas células. Usa-os em viagens, não como rotina diária." },
    { icon: "🚗", titulo: "Não ignores o pré-condicionamento", detalhe: "Antes de sair em dias frios, liga o aquecimento enquanto ainda estás ligado à corrente. Não gasta autonomia e o interior já está quente." },
    { icon: "📱", titulo: "Não confundas apps de operadores diferentes", detalhe: "Cada operador tem a sua app mas a Mobi.E dá acesso a quase toda a rede. Começa por ela e adiciona outras conforme necessário." },
    { icon: "🔧", titulo: "Não levantes o capô para 'ver o motor'", detalhe: "EV e híbridos têm alta tensão (400–800V). A manutenção deve ser feita por técnicos certificados. O capô tem fluido de limpeza e refrigeração — não é para utilizadores." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl mb-1">Guia do Novo Condutor EV</h1>
        <p className="text-muted-foreground text-sm">Tudo o que precisas de saber para começar bem · {steps.length} passos</p>
      </div>

      {/* Progress bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground">{step + 1} de {steps.length} · {steps[step].label}</div>
          <div className="text-xs text-muted-foreground">{Math.round(((step + 1) / steps.length) * 100)}%</div>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="flex gap-1 mt-3 flex-wrap">
          {steps.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${i === step ? "bg-primary text-primary-foreground" : i < step ? "border border-border text-foreground" : "border border-border text-muted-foreground"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <div className="font-serif text-2xl mb-2">Bem-vindo ao mundo eléctrico</div>
            <div className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Conduzir um EV ou híbrido é diferente da combustão — mas mais simples do que parece. Este guia leva-te pelos conceitos essenciais, hábitos certos e plataformas que vão facilitar a tua vida.
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { emoji: "💶", titulo: "Poupa até 70%", sub: "em combustível vs gasolina" },
              { emoji: "🔋", titulo: "Carrega enquanto dormes", sub: "Wallbox doméstica é simples" },
              { emoji: "🌱", titulo: "Zero emissões locais", sub: "em modo eléctrico" },
            ].map(c => (
              <div key={c.titulo} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">{c.emoji}</div>
                <div className="text-sm font-medium">{c.titulo}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="text-sm font-medium">Conta-nos um pouco sobre o teu dia-a-dia</div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Que veículo tens?</div>
            <div className="flex gap-2">
              {[{ v: "ev", label: "100% Eléctrico" }, { v: "hibrido", label: "Híbrido Plug-in" }, { v: "mild", label: "Híbrido Ligeiro" }].map(o => (
                <button key={o.v} onClick={() => setProfile(p => ({ ...p, commute: o.v }))}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-sm transition-colors ${profile.commute === o.v ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Quantos km fazes por dia?</div>
            <div className="flex gap-2">
              {[{ v: "curto", label: "< 30 km" }, { v: "medio", label: "30–80 km" }, { v: "longo", label: "> 80 km" }].map(o => (
                <button key={o.v} onClick={() => setProfile(p => ({ ...p, dailyKm: o.v }))}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-sm transition-colors ${profile.dailyKm === o.v ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tens Wallbox em casa?</div>
            <div className="flex gap-2">
              {[{ v: "sim", label: "Sim" }, { v: "nao", label: "Não" }, { v: "instalar", label: "Vou instalar" }].map(o => (
                <button key={o.v} onClick={() => setProfile(p => ({ ...p, hasWallbox: o.v }))}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-sm transition-colors ${profile.hasWallbox === o.v ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          {/* Personalized tip based on profile */}
          {profile.dailyKm && profile.hasWallbox && (
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-sm">
              {profile.dailyKm === "curto" && profile.hasWallbox === "sim" && "Com menos de 30 km/dia e Wallbox em casa, raramente precisarás de postos públicos. Carrega de noite a tarifa reduzida."}
              {profile.dailyKm === "longo" && profile.hasWallbox === "nao" && "Com mais de 80 km/dia sem Wallbox, identificar postos perto do trabalho é essencial. A app Mobi.E é o teu ponto de partida."}
              {profile.dailyKm === "medio" && "Com 30–80 km/dia tens uma rotina confortável — uma carga por semana em casa cobre quase tudo."}
              {profile.dailyKm === "curto" && profile.hasWallbox === "instalar" && "Boa decisão instalar Wallbox! Recuperas o investimento (~€800) em menos de 2 anos com a poupança vs postos públicos."}
              {profile.dailyKm === "longo" && profile.hasWallbox === "sim" && "Com muitos km e Wallbox, complementa carregamentos domésticos com postos AC no destino. Evita DC diário."}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-medium mb-1">Conceitos base do veículo eléctrico</div>
            <div className="text-xs text-muted-foreground">Os termos que vais ouvir e o que significam de verdade</div>
          </div>
          {[...concepts, ...(isHybrid ? hybridSpecific : [])].map(c => (
            <div key={c.term} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start">
              <div className="text-xs font-mono border border-border px-2.5 py-1.5 rounded-lg text-muted-foreground shrink-0 mt-0.5 min-w-[80px] text-center">{c.term}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{c.def}</div>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-sm font-medium mb-4">Tipos de carregamento</div>
              <div className="space-y-3">
                {[
                  { tipo: "Doméstico (tomada)", potencia: "2.3 kW", tempo: "12–40h", icon: "🏠", quando: "Emergência, sem alternativa", cor: "text-muted-foreground" },
                  { tipo: "Wallbox doméstica",  potencia: "7–22 kW", tempo: "3–8h",  icon: "⚡", quando: "Uso diário — a melhor opção",  cor: "text-foreground" },
                  { tipo: "AC público",         potencia: "7–50 kW", tempo: "1–4h",  icon: "🔌", quando: "Trabalho, centros comerciais",  cor: "text-foreground" },
                  { tipo: "DC rápido",          potencia: "50–350 kW", tempo: "15–45min", icon: "🚀", quando: "Viagens longas — não usar diariamente", cor: "text-yellow-500/80" },
                ].map(t => (
                  <div key={t.tipo} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                    <div className="text-xl shrink-0">{t.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.tipo}</div>
                      <div className="text-xs text-muted-foreground">{t.potencia} · {t.tempo}</div>
                    </div>
                    <div className={`text-xs text-right max-w-[120px] ${t.cor}`}>{t.quando}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-sm font-medium mb-1">Melhores horas para carregar</div>
              <div className="text-xs text-muted-foreground mb-4">Tarifa bi-horária ERSE · valores indicativos 2026</div>
              <div className="bg-muted/50 rounded-xl p-3 mb-4 space-y-2">
                {[
                  { hora: "22h00 – 08h00", tarifa: "€0.08–0.12/kWh", label: "Vazio / Super Vazio", cor: "bg-primary", pct: 100 },
                  { hora: "08h00 – 10h30", tarifa: "€0.18–0.22/kWh", label: "Cheia",               cor: "bg-muted-foreground", pct: 55 },
                  { hora: "10h30 – 13h00", tarifa: "€0.22–0.28/kWh", label: "Ponta",               cor: "bg-muted-foreground/50", pct: 35 },
                  { hora: "13h00 – 18h30", tarifa: "€0.18–0.22/kWh", label: "Cheia",               cor: "bg-muted-foreground", pct: 55 },
                  { hora: "18h30 – 22h00", tarifa: "€0.22–0.28/kWh", label: "Ponta — evitar",      cor: "bg-muted-foreground/50", pct: 35 },
                ].map(h => (
                  <div key={h.hora} className="flex items-center gap-3">
                    <div className="text-xs font-mono text-muted-foreground w-32 shrink-0">{h.hora}</div>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${h.cor}`} style={{ width: `${h.pct}%` }} />
                    </div>
                    <div className="text-xs font-medium w-28 shrink-0">{h.tarifa}</div>
                    <div className="text-xs text-muted-foreground w-24 shrink-0 hidden lg:block">{h.label}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mb-4 border border-border rounded-lg px-3 py-2">
                Dica: programa a Wallbox para iniciar às 22h00 e parar aos 06h00. Poupas até 60% vs carregar ao final do dia.
              </div>
              <div className="text-sm font-medium mb-4">Rotina de carregamento ideal</div>
              <div className="space-y-3">
                {[
                  { hora: "22:00", acao: "Liga a Wallbox ao chegar a casa", detail: "Tarifa nocturna — mais barato" },
                  { hora: "06:00", acao: "Bateria a 80%", detail: "Carregamento automático para e poupa bateria" },
                  { hora: "08:00", acao: "Sais com o carro", detail: "Autonomia suficiente para o dia" },
                  { hora: "Trabalho", acao: "Carrega no AC do escritório (se disponível)", detail: "Gratuito ou muito barato" },
                  { hora: "Viagem", acao: "Postos DC em autoestrada", detail: "20 min = +200 km" },
                ].map(r => (
                  <div key={r.hora} className="flex gap-3 items-start">
                    <div className="text-xs font-mono border border-border px-2 py-1 rounded text-muted-foreground shrink-0 w-20 text-center">{r.hora}</div>
                    <div>
                      <div className="text-sm">{r.acao}</div>
                      <div className="text-xs text-muted-foreground">{r.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {profile.hasWallbox === "instalar" && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm font-medium mb-2">Como instalar uma Wallbox</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>1. Contacta um electricista certificado DGEG para avaliar o quadro eléctrico.</div>
                <div>2. Modelos recomendados: Pulsar Plus (Wallbox), Easee One, myWallbox. Custo: €400–900 com instalação.</div>
                <div>3. Solicita o incentivo IAPMEI (até €500 de apoio) — o teu gestor de frota pode ajudar.</div>
                <div>4. Instala app do fabricante para agendamento de carregamento nocturno.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Custo/100 km (EV)", value: "€3.00", sub: "a €0.15/kWh noturno", highlight: true },
              { label: "Custo/100 km (gasolina)", value: "€11.00", sub: "a €1.74/L · 6.5L/100km", highlight: false },
              { label: "Poupança anual típica", value: "€1.200", sub: "20.000 km/ano", highlight: true },
              { label: "Custo manutenção EV", value: "-60%", sub: "vs combustão", highlight: false },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-4 border ${s.highlight ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className={`text-xs mt-0.5 ${s.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.label}</div>
                <div className={`text-xs mt-1 ${s.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-medium mb-4">Onde é mais barato carregar (Portugal 2026)</div>
            <div className="space-y-2">
              {[
                { local: "Casa (tarifa nocturna 22h–06h)",   preco: "€0.08–0.12/kWh", nota: "Melhor opção sempre" },
                { local: "Casa (tarifa normal)",             preco: "€0.18–0.22/kWh", nota: "Ainda mais barato que público" },
                { local: "Lidl / Intermarché (AC)",          preco: "€0.15/kWh",      nota: "Enquanto fazes as compras" },
                { local: "EDP Charge (AC, subscrição)",      preco: "€0.18/kWh",      nota: "Boa cobertura nacional" },
                { local: "EMEL Lisboa (AC)",                 preco: "€0.20/kWh",      nota: "Sem custo de activação" },
                { local: "DC rápido (50–150 kW)",           preco: "€0.39–0.55/kWh", nota: "Usar só em viagens" },
                { local: "Ionity (350 kW, sem subscrição)", preco: "€0.69/kWh",      nota: "Evitar — muito caro sem plano" },
              ].map((r, i) => (
                <div key={r.local} className={`flex items-center gap-4 py-2 ${i < 2 ? "border-l-2 border-l-primary pl-3" : "pl-3"}`}>
                  <div className="flex-1 text-sm">{r.local}</div>
                  <div className="text-sm font-medium font-mono">{r.preco}</div>
                  <div className="text-xs text-muted-foreground w-40 text-right">{r.nota}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-medium mb-1">O que não deves fazer</div>
            <div className="text-xs text-muted-foreground">Hábitos que encurtam a vida da bateria ou criam problemas</div>
          </div>
          {donts.map(d => (
            <div key={d.titulo} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start">
              <div className="text-2xl shrink-0">{d.icon}</div>
              <div>
                <div className="text-sm font-medium mb-0.5">{d.titulo}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{d.detalhe}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 6 && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-medium mb-1">Plataformas e recursos úteis</div>
            <div className="text-xs text-muted-foreground">Apps, sites e comunidades para condutores EV em Portugal</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {platformsList.map(p => (
              <div key={p.name} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="text-sm font-medium">{p.name}</div>
                    <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted-foreground">{p.cat}</span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{p.desc}</div>
                </div>
                <ExternalLink href={p.url}
                  className="text-xs border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                  Abrir ↗
                </ExternalLink>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">✓</div>
            <div className="font-serif text-2xl mb-2">Estás pronto para começar</div>
            <div className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Guardámos o teu perfil. A plataforma vai adaptar as sugestões ao teu padrão de condução ao longo do tempo.
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {[
              { titulo: "Primeiro passo",      sub: "Descarrega a app Mobi.E e activa a conta com o IBAN da empresa para reembolsos automáticos.", icon: "📱" },
              { titulo: "Esta semana",         sub: "Nota o consumo real vs estimado nas primeiras 3 viagens. O sistema calibra a autonomia prevista.", icon: "📊" },
              { titulo: "Primeiro mês",        sub: "Experimenta carregar em pelo menos 3 locais diferentes para perceber qual se encaixa na tua rotina.", icon: "🗺️" },
            ].map(c => (
              <div key={c.titulo} className="bg-card border border-border rounded-xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="text-sm font-medium mb-1">{c.titulo}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{c.sub}</div>
              </div>
            ))}
          </div>
          {profile.commute && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm font-medium mb-2">O teu perfil personalizado</div>
              <div className="text-xs text-muted-foreground space-y-1">
                {profile.commute === "ev" && <div>Veículo 100% eléctrico — podes aproveitar toda a rede Mobi.E e maximizar regeneração.</div>}
                {profile.commute === "hibrido" && <div>Híbrido plug-in — prioriza modo EV em cidade. Em autoestrada, o motor térmico é mais eficiente.</div>}
                {profile.commute === "mild" && <div>Híbrido ligeiro — a bateria auxilia mas não substitui. Foca-te em condução suave para maximizar a regeneração.</div>}
                {profile.dailyKm === "curto" && <div>Percursos curtos — uma carga semanal em casa chega. Não precisas de subscrições de redes públicas.</div>}
                {profile.dailyKm === "longo" && <div>Percursos longos — considera subscrição EDP Charge ou Via Verde para tarifa reduzida em AC público.</div>}
                {profile.hasWallbox === "nao" && <div>Sem Wallbox — mapa com postos AC perto de casa ou trabalho é a tua prioridade. Vê a aba Mapa.</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <Btn variant="outline" className="flex-1" onClick={() => setStep(s => s - 1)}>
            Anterior
          </Btn>
        )}
        {step < steps.length - 1 ? (
          <Btn variant="primary" className="flex-1" onClick={() => setStep(s => s + 1)}>
            {step === 0 ? "Começar" : "Próximo"}
          </Btn>
        ) : (
          <Btn variant="primary" className="flex-1" onClick={() => setStep(0)}>
            Rever guia
          </Btn>
        )}
      </div>
    </div>
  );
}

const driverNav = [
  { id: "dashboard",     label: "Dashboard",      icon: "dashboard",  component: DriverDashboard },
  { id: "map",           label: "Mapa & Percurso", icon: "map",       component: DriverMap },
  { id: "battery",       label: "Bateria",         icon: "battery",   component: DriverBattery },
  { id: "costs",         label: "Custos",          icon: "cost",      component: DriverCosts },
  { id: "co2",           label: "Impacto CO₂",     icon: "co2",       component: DriverCO2 },
  { id: "ai",            label: "Assistente IA",   icon: "ai",        component: DriverAI },
  { id: "onboarding",    label: "Guia EV",         icon: "faq",       component: DriverOnboarding },
  { id: "community",     label: "Comunidade",      icon: "fleet",     component: DriverCommunity },
  { id: "announcements", label: "Comunicados",     icon: "bell",      component: DriverAnnouncements },
  { id: "faq",           label: "FAQ",             icon: "faq",       component: DriverFAQ },
];

// ─── Shell ────────────────────────────────────────────────────────────────────
// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (role: "company" | "driver", name: string, initials: string) => void }) {
  const [selected, setSelected] = useState<"driver" | "company" | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleDriver = () => {
    onLogin("driver", "João Alves", "JA");
  };
  const handleCompany = () => {
    if (pin === "1234") {
      onLogin("company", "Gestora de Frota", "MS");
      setError("");
    } else {
      setError("PIN incorreto. Tenta novamente.");
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Icon d={ic.zap} size={22} className="text-primary-foreground" />
          </div>
          <div className="font-serif text-3xl">MobilityService</div>
          <div className="text-muted-foreground text-sm mt-1">Plataforma de Mobilidade Eléctrica</div>
        </div>

        {!selected ? (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wider text-center mb-4">Como pretendes entrar?</div>
            <button onClick={() => { setSelected("driver"); }}
              className="w-full bg-card border border-border rounded-xl p-5 text-left hover:bg-secondary transition-colors group">
              <div className="text-base font-medium mb-1">Sou Condutor</div>
              <div className="text-sm text-muted-foreground">Acesso ao meu carro de serviço, mapa e custos pessoais</div>
            </button>
            <button onClick={() => setSelected("company")}
              className="w-full bg-card border border-border rounded-xl p-5 text-left hover:bg-secondary transition-colors">
              <div className="text-base font-medium mb-1">Acesso Empresa</div>
              <div className="text-sm text-muted-foreground">Gestão de frota, reembolsos, análise e manutenção</div>
            </button>
          </div>
        ) : selected === "driver" ? (
          <div className="space-y-4">
            <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Voltar</button>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-sm font-medium mb-1">João Alves</div>
              <div className="text-xs text-muted-foreground mb-1">joao.alves@mobilityservice.pt</div>
              <div className="text-xs font-mono text-muted-foreground">Veículo: 52-LX-33 · IONIQ 5</div>
            </div>
            <Btn variant="primary" className="w-full" onClick={handleDriver}>Entrar como Condutor</Btn>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => { setSelected(null); setPin(""); setError(""); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Voltar</button>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-sm font-medium mb-3">PIN de Acesso Empresa</div>
              <input
                type="password" value={pin} onChange={e => { setPin(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleCompany()}
                placeholder="Introduz o PIN (demo: 1234)"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/40 tracking-widest"
              />
              {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
            </div>
            <Btn variant="primary" className="w-full" onClick={handleCompany}>Entrar como Empresa</Btn>
          </div>
        )}
        <div className="text-center text-xs text-muted-foreground">
          MobilityService · Plataforma EV Empresarial · v2.1
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<{ role: "company" | "driver"; name: string; initials: string } | null>(null);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, titulo: "Actualização de política de carregamento DC", corpo: "A partir de 1 de Setembro, carregamentos DC rápidos em postos externos devem ser registados na app. Máximo 2x por semana por veículo de frota.", prioridade: "urgente", destino: "todos", data: "20 Ago 2026", lida: false },
    { id: 2, titulo: "Revisão obrigatória — BMW iX3 (44-MN-91)", corpo: "O veículo 44-MN-91 tem revisão agendada para 28 de Agosto às 09h00 na concessionária BMW Lisboa. O condutor Sofia Lima deve entregar o veículo antes das 08h45.", prioridade: "aviso", destino: "44-MN-91", data: "19 Ago 2026", lida: false },
    { id: 3, titulo: "Novo posto de carregamento no escritório (piso -1)", corpo: "Foram instalados 4 novos postos AC 22 kW no parque do escritório (piso -1, lugares 12–15). Acesso com cartão de frota. Consultar gestor para atribuição de lugar.", prioridade: "info", destino: "todos", data: "15 Ago 2026", lida: true },
  ]);
  const [reports, setReports] = useState<Report[]>([
    { id: 1, tipo: "posto_avariado", titulo: "EMEL · Av. da Liberdade — 2 postos avariados", descricao: "Os postos 3 e 4 da estação EMEL na Av. Liberdade 185 estão a dar erro de comunicação desde segunda-feira. O ecrã mostra 'Out of service'. Já tentei com dois cartões diferentes.", local: "EMEL · Av. da Liberdade 185, Lisboa", autor: "Ana Ferreira", data: "19 Ago 2026", estado: "em_analise", resposta: "Reportado à EMEL. Aguardamos resposta técnica prevista para 22 Ago.", votos: 4, votei: false },
    { id: 2, tipo: "info_errada", titulo: "Autonomia da app subestimada no Verão com AC ligado", descricao: "A app prevê 312 km mas com o ar condicionado a funcionar em dias quentes (35°C+) a autonomia real fica em ~260 km. Deve avisar melhor sobre o impacto da temperatura.", local: "", autor: "Carlos Mendes", data: "18 Ago 2026", estado: "pendente", resposta: "", votos: 7, votei: false },
    { id: 3, tipo: "problema_rota", titulo: "Rota Suave passa por zona em obras — EN10 cortada", descricao: "A rota alternativa EN10 entre Setúbal e Palmela está cortada por obras até final de Setembro. A app continua a sugerir este percurso. Usar A2 como alternativa.", local: "EN10 · Setúbal–Palmela", autor: "Marta Santos", data: "17 Ago 2026", estado: "resolvido", resposta: "Mapa actualizado. Rota EN10 marcada como condicionada até 30 Set 2026. Obrigado pela participação!", votos: 3, votei: false },
    { id: 4, tipo: "outro", titulo: "Wallbox do escritório (piso -1) não regista sessão na app", descricao: "Carregamentos feitos nos novos postos do piso -1 (lugares 12–15) não aparecem no histórico da app nem contam para o reembolso. Aconteceu 3 vezes esta semana.", local: "Escritório · Parque Piso -1", autor: "João Alves", data: "20 Ago 2026", estado: "pendente", resposta: "", votos: 2, votei: false },
  ]);

  const login = (role: "company" | "driver", name: string, initials: string) => {
    setSession({ role, name, initials });
    setActive("dashboard");
  };
  const logout = () => { setSession(null); setActive("dashboard"); };

  if (!session) return <LoginScreen onLogin={login} />;

  const nav = session.role === "company" ? companyNav : driverNav;
  const ActiveComponent = nav.find(n => n.id === active)?.component || DriverDashboard;

  const navItem = (item: typeof nav[0]) => {
    const unread = item.id === "announcements"
      ? announcements.filter(a => !a.lida).length
      : item.id === "reports"
      ? reports.filter(r => r.estado === "pendente").length
      : item.id === "community"
      ? reports.filter(r => r.estado === "em_analise" && r.resposta).length
      : 0;
    return (
      <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active===item.id?"bg-primary text-primary-foreground font-medium":"text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
        <Icon d={ic[item.icon as keyof typeof ic]} size={16} />
        <span className="flex-1 text-left">{item.label}</span>
        {unread > 0 && (
          <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shrink-0 ${active===item.id?"bg-primary-foreground text-primary":"bg-foreground text-background"}`}>
            {unread}
          </span>
        )}
      </button>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Icon d={ic.zap} size={14} className="text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="font-serif text-base leading-none">MobilityService</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {session.role === "company" ? "Gestão de Frota" : "Condutor"}
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(navItem)}
      </nav>
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold shrink-0">{session.initials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{session.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{session.role === "company" ? "Empresa" : "Condutor"}</div>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1 py-1">
          <Icon d={ic.logout} size={13} />
          Terminar sessão
        </button>
      </div>
    </>
  );

  return (
    <ReportsContext.Provider value={{ reports, setReports }}>
    <AnnouncementsContext.Provider value={{ announcements, setAnnouncements }}>
    <div className="flex h-screen bg-background text-foreground overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col
        transition-transform duration-300 ease-in-out
        md:static md:w-56 md:translate-x-0 md:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
              onClick={() => setSidebarOpen(o => !o)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="text-sm font-medium truncate">{nav.find(n=>n.id===active)?.label}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground border border-border px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Operacional
            </div>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1.5">
              <Icon d={ic.bell} size={17} />
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-foreground border-2 border-card" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
    </AnnouncementsContext.Provider>
    </ReportsContext.Provider>
  );
}
