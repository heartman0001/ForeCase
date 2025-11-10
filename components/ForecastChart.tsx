
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { ForecastDataPoint } from '../types';

// interface ForecastChartProps {
//   data: ForecastDataPoint[];
// }

// const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <BarChart
//         data={data}
//         margin={{
//           top: 5,
//           right: 30,
//           left: 20,
//           bottom: 5,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
//         <XAxis dataKey="month" tick={{ fill: '#a0aec0' }}/>
//         <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#a0aec0' }}/>
//         <Tooltip
//           cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
//           contentStyle={{ 
//             backgroundColor: '#2d3748', 
//             borderColor: '#4a5568',
//             color: '#e2e8f0'
//           }}
//           formatter={(value: number) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), 'Forecasted']}
//         />
//         <Legend />
//         <Bar dataKey="forecasted" fill="#2b71e0" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default ForecastChart;