// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";

// const trimText = (text, maxLength = 14) => {
//   if (!text) return "";
//   return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
// };

// // Custom tick renderer: angles the label and truncates it so long
// // industry names never overlap each other on the X-axis.
// const AngledTick = ({ x, y, payload }) => (
//   <g transform={`translate(${x},${y})`}>
//     <text
//       x={0}
//       y={0}
//       dy={10}
//       textAnchor="end"
//       transform="rotate(-35)"
//       fontSize={12}
//       fill="#6b7280"
//     >
//       {trimText(payload.value, 14)}
//     </text>
//   </g>
// );

// // Custom tooltip: always shows the FULL, untrimmed name — even though
// // the axis tick below it is shortened for space.
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload || !payload.length) return null;
//   return (
//     <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
//       <p className="text-xs font-medium text-gray-700 mb-0.5">{label}</p>
//       <p className="text-sm font-semibold" style={{ color: payload[0].color || payload[0].fill }}>
//         {payload[0].value}
//       </p>
//     </div>
//   );
// };

// const ChartCard = ({
//   title,
//   data = [],
//   type = "line",
//   dataKey = "value",
//   xKey = "name",
//   color = "#2C0EEE",
// }) => (
//   <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
//     <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
//     <ResponsiveContainer width="100%" height={280}>
//       {type === "bar" ? (
//         <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 55 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

//           <XAxis
//             dataKey={xKey}
//             interval={0}
//             height={70}
//             tick={<AngledTick />}
//             axisLine={{ stroke: "#e5e7eb" }}
//             tickLine={false}
//           />

//           <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />

//           <Tooltip
//             content={<CustomTooltip />}
//             cursor={{ fill: "rgba(44, 14, 238, 0.06)" }}
//           />

//           <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
//         </BarChart>
//       ) : (
//         <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//           <XAxis
//             dataKey={xKey}
//             interval={0}
//             tick={{ fontSize: 12 }}
//             axisLine={{ stroke: "#e5e7eb" }}
//             tickLine={false}
//           />
//           <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
//           <Tooltip content={<CustomTooltip />} />
//           <Line
//             type="monotone"
//             dataKey={dataKey}
//             stroke={color}
//             strokeWidth={2.5}
//             dot={{ r: 3 }}
//             activeDot={{ r: 5 }}
//           />
//         </LineChart>
//       )}
//     </ResponsiveContainer>
//   </div>
// );

// export default ChartCard;

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { MdInsertChartOutlined } from "react-icons/md";

// ─── Brand theme ────────────────────────────────────────────────
const BRAND_BLUE = "#2C0EEE";
const BRAND_RED = "#F61D25";
const BAR_PALETTE = [BRAND_BLUE, BRAND_RED];

// Colorful donut palette — distinct hues per segment, like the reference
// (green / yellow / cyan / purple / red), but opens with brand blue first.
const DONUT_PALETTE = [
  "#22C55E", // green
  "#EAB308", // yellow
  "#06B6D4", // cyan
  "#A855F7", // purple
  BRAND_RED, // brand red
  BRAND_BLUE, // brand blue
];

const trimText = (text, maxLength = 12) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

const AngledTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={10}
      textAnchor="end"
      transform="rotate(-30)"
      fontSize={11}
      fill="#9ca3af"
    >
      {trimText(payload.value, 14)}
    </text>
  </g>
);

const PlainTick = ({ x, y, payload }) => (
  <text x={x} y={y + 14} textAnchor="middle" fontSize={11} fill="#9ca3af">
    {payload.value}
  </text>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
      <p className="text-xs font-medium text-gray-700 mb-0.5">{label}</p>
      <p
        className="text-sm font-semibold"
        style={{ color: payload[0].payload.fill || payload[0].color }}
      >
        {payload[0].value}
      </p>
    </div>
  );
};

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
      <p className="text-xs font-medium text-gray-700 mb-0.5">{p.name}</p>
      <p className="text-sm font-semibold" style={{ color: p.payload.fill }}>
        {p.value}
      </p>
    </div>
  );
};

const ValueLabel = (props) => {
  const { x, y, value, fill } = props;
  if (!value) return null;
  return (
    <text
      x={x}
      y={y - 8}
      textAnchor="middle"
      fontSize={11}
      fontWeight={600}
      fill={fill || "#374151"}
    >
      {value}
    </text>
  );
};

const hasData = (data = [], key = "value") =>
  Array.isArray(data) &&
  data.length > 0 &&
  data.some((d) => Number(d?.[key]) > 0);

// ─── Legend row for the donut — colored dot, label, value on the right ──
const DonutLegend = ({ data, dataKey, xKey, palette }) => (
  <ul className="flex-1 min-w-0 space-y-3">
    {data.map((entry, idx) => {
      const dotColor = palette[idx % palette.length];
      return (
        <li
          key={entry[xKey] ?? idx}
          className="flex items-center justify-between gap-3 text-sm"
        >
          <span className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: dotColor }}
            />
            <span className="text-gray-600 truncate">{entry[xKey]}</span>
          </span>
          <span
            className="font-semibold tabular-nums flex-shrink-0"
            style={{ color: dotColor }}
          >
            {entry[dataKey]}
          </span>
        </li>
      );
    })}
  </ul>
);

const ChartCard = ({
  title,
  subtitle,
  icon: Icon,
  rangeLabel,
  data = [],
  type = "line", // "line" | "bar" | "donut"
  dataKey = "value",
  xKey = "name",
  color = BRAND_BLUE,
  multiColor = false,
}) => {
  const gradientId = `chart-gradient-${(title || "default")
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
  const showEmpty = !hasData(data, dataKey);

  const perItemWidth = type === "bar" ? 88 : 56;
  const chartWidth = Math.max(320, data.length * perItemWidth);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col min-w-0">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}14`, color }}
          >
            {Icon ? <Icon size={17} /> : <MdInsertChartOutlined size={17} />}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-400 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {rangeLabel && (
          <span className="flex-shrink-0 text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-md px-2 py-1 whitespace-nowrap">
            {rangeLabel}
          </span>
        )}
      </div>

      <div className="flex-1 mt-3" style={{ minHeight: 250 }}>
        {showEmpty ? (
          <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-gray-300 gap-2 border border-dashed border-gray-100 rounded-xl">
            <MdInsertChartOutlined size={28} />
            <span className="text-xs text-gray-400">No data available yet</span>
          </div>
        ) : type === "donut" ? (
          // ─── Donut layout: chart on the left, legend list on the right ──
          <div className="h-full min-h-[250px] flex items-center gap-6">
            <div className="w-[150px] h-[150px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey={dataKey}
                    nameKey={xKey}
                    innerRadius="68%"
                    outerRadius="100%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={DONUT_PALETTE[idx % DONUT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <DonutLegend
              data={data}
              dataKey={dataKey}
              xKey={xKey}
              palette={DONUT_PALETTE}
            />
          </div>
        ) : (
          <div className="overflow-x-auto pb-1">
            <div style={{ width: chartWidth, height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                {type === "bar" ? (
                  <BarChart
                    data={data}
                    margin={{ top: 24, right: 8, left: -12, bottom: 45 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey={xKey}
                      interval={0}
                      height={60}
                      tick={<AngledTick />}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(44, 14, 238, 0.05)" }}
                    />
                    <Bar
                      dataKey={dataKey}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={42}
                    >
                      <LabelList
                        dataKey={dataKey}
                        content={(props) => (
                          <ValueLabel
                            {...props}
                            fill={
                              multiColor
                                ? BAR_PALETTE[props.index % BAR_PALETTE.length]
                                : color
                            }
                          />
                        )}
                      />
                      {data.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={
                            multiColor
                              ? BAR_PALETTE[idx % BAR_PALETTE.length]
                              : color
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart
                    data={data}
                    margin={{ top: 24, right: 8, left: -12, bottom: 8 }}
                  >
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={color}
                          stopOpacity={0.28}
                        />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey={xKey}
                      interval={0}
                      tick={<PlainTick />}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={dataKey}
                      stroke={color}
                      strokeWidth={2.5}
                      fill={`url(#${gradientId})`}
                      dot={{ r: 3.5, fill: color, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    >
                      <LabelList
                        dataKey={dataKey}
                        content={(p) => <ValueLabel {...p} fill={color} />}
                      />
                    </Area>
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;