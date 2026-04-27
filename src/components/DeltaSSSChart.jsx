import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceDot,
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
      <p className="font-mono text-xs">rho = {Number(label).toFixed(2)}</p>
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
      <div className="relative h-[380px] w-full">
        <p className="pointer-events-none absolute left-4 top-2 z-10 font-mono text-sm text-app-muted">
          ΔSSS = SSS(Group Lasso) - SSS(Lasso)
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 16, left: 12, bottom: 24 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey="rho" stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)", fontSize: 12 }}>
              <Label value="Intra-group Correlation ρ" position="insideBottom" offset={-8} fill="var(--chart-axis)" />
            </XAxis>
            <YAxis stroke="var(--chart-axis)" tick={{ fill: "var(--chart-axis)", fontSize: 12 }} domain={[0, 0.72]} />
            <Tooltip content={<DeltaTooltip />} />

            <ReferenceLine y={0} stroke="var(--chart-axis)" strokeDasharray="4 3" />

            {showReferenceLine && (
              <ReferenceLine
                x={rhoStar}
                stroke={METHOD_COLORS.lasso}
                strokeDasharray="6 4"
                className="rho-star-line"
                label={{ value: "ρ*", fill: METHOD_COLORS.lasso, position: "insideTopRight" }}
              />
            )}

            <ReferenceLine
              segment={[
                { x: 0.62, y: 0.705 },
                { x: 0.5, y: 0.655 },
              ]}
              stroke={METHOD_COLORS.delta}
              strokeWidth={1.5}
            />

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

            <ReferenceDot
              x={0.5}
              y={0.655}
              r={4}
              fill={METHOD_COLORS.delta}
              stroke="var(--color-surface)"
              strokeWidth={1.5}
              label={{ value: "Peak advantage at ρ=0.5", position: "top", fill: "var(--chart-axis)", fontSize: 12 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

export default DeltaSSSChart;
