import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { METHOD_COLORS } from "../data";

function DeltaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <p className="font-mono text-xs">ρ = {Number(label).toFixed(2)}</p>
      <p className="text-xs" style={{ color: METHOD_COLORS.delta }}>
        ΔSSS: {Number(payload[0].value).toFixed(3)}
      </p>
    </div>
  );
}

function DeltaSSSChart({ data, rhoStar, showReferenceLine }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="scientific-card p-4 md:p-6"
    >
      <h2 className="section-title mb-2">DeltaSSS Arch Chart</h2>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          fontFamily: "Inter",
          marginBottom: "8px",
          marginTop: "-4px",
        }}
      >
        Y-axis: ΔSSS = SSS(Group Lasso) − SSS(Lasso)
      </p>
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 40, left: 70 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="rho"
              ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]}
              stroke="var(--chart-axis)"
              tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
            >
              <Label value="Intra-group Correlation ρ" position="insideBottom" offset={-8} fill="var(--chart-axis)" />
            </XAxis>
            <YAxis width={60} stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)", fontSize: 12 }} domain={[0, 0.72]} />
            <Tooltip content={<DeltaTooltip />} />

            <ReferenceLine y={0} stroke="#888" strokeDasharray="4 4" strokeWidth={1} />

            {showReferenceLine && (
              <ReferenceLine
                x={rhoStar}
                stroke={METHOD_COLORS.lasso}
                strokeDasharray="6 4"
                className="rho-star-line"
                label={{ value: "ρ*", fill: METHOD_COLORS.lasso, position: "insideTopRight" }}
              />
            )}

            <Area
              type="monotone"
              dataKey="delta"
              stroke={METHOD_COLORS.delta}
              fill={METHOD_COLORS.delta}
              fillOpacity={0.24}
              strokeWidth={2.5}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

export default DeltaSSSChart;
