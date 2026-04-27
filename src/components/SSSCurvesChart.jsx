import { motion } from "framer-motion";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { METHOD_COLORS } from "../data";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <p className="font-mono text-xs">ρ = {Number(label).toFixed(2)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(3)}
        </p>
      ))}
    </div>
  );
}

const SERIES = [
  { key: "lasso", name: "Lasso" },
  { key: "ridge", name: "Ridge" },
  { key: "elastic_net", name: "Elastic Net" },
  { key: "group_lasso", name: "Group Lasso" },
];

function SSSCurvesChart({ data, rhoStar, showReferenceLine }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="scientific-card p-4 md:p-6"
    >
      <h2 className="section-title mb-6">SSS Curves</h2>

      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 40, left: 60 }}>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="rho"
              ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]}
              stroke="var(--chart-axis)"
              tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
            >
              <Label value="Intra-group Correlation ρ" position="insideBottom" offset={-10} fill="var(--chart-axis)" />
            </XAxis>
            <YAxis
              width={55}
              domain={[0, 1.05]}
              stroke="var(--chart-axis)"
              tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
              label={{
                value: "SSS (Sparsity Stability Score)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showReferenceLine && (
              <ReferenceLine
                x={rhoStar}
                stroke={METHOD_COLORS.lasso}
                strokeDasharray="6 4"
                ifOverflow="extendDomain"
                className="rho-star-line"
                label={{ value: "Ï*", fill: METHOD_COLORS.lasso, position: "insideTopRight" }}
              />
            )}

            {SERIES.map((series, index) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.name}
                stroke={METHOD_COLORS[series.key]}
                strokeWidth={2.2}
                dot={false}
                isAnimationActive
                animationDuration={1000 + index * 120}
                animationEasing="ease-out"
              />
            ))}

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: "0px", fontSize: "13px" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

export default SSSCurvesChart;
