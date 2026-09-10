import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const trimText = (text, maxLength = 14) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

// Custom tick renderer: angles the label and truncates it so long
// industry names never overlap each other on the X-axis.
const AngledTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={10}
      textAnchor="end"
      transform="rotate(-35)"
      fontSize={12}
      fill="#6b7280"
    >
      {trimText(payload.value, 14)}
    </text>
  </g>
);

// Custom tooltip: always shows the FULL, untrimmed name — even though
// the axis tick below it is shortened for space.
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
      <p className="text-xs font-medium text-gray-700 mb-0.5">{label}</p>
      <p className="text-sm font-semibold" style={{ color: payload[0].color || payload[0].fill }}>
        {payload[0].value}
      </p>
    </div>
  );
};

const ChartCard = ({
  title,
  data = [],
  type = "line",
  dataKey = "value",
  xKey = "name",
  color = "#2C0EEE",
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
    <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={280}>
      {type === "bar" ? (
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 55 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

          <XAxis
            dataKey={xKey}
            interval={0}
            height={70}
            tick={<AngledTick />}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />

          <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(44, 14, 238, 0.06)" }}
          />

          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey={xKey}
            interval={0}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  </div>
);

export default ChartCard;