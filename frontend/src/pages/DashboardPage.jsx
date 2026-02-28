import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import client from '../api/client';
import StatCard from '../components/StatCard';

const colors = ['#7A1C1C', '#AD3434', '#D45D5D', '#E9AAAA'];

const DashboardPage = () => {
  const [data, setData] = useState({ monthlyAssignments: [], assignmentsByEmployee: [], activeAssignments: [] });

  useEffect(() => {
    client.get('/dashboard').then((response) => setData(response.data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Monitoring Pimpinan</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Penugasan Aktif" value={data.activeAssignments.length} />
        <StatCard title="Pegawai Terlibat" value={data.assignmentsByEmployee.length} />
        <StatCard title="Periode Tercatat" value={data.monthlyAssignments.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Penugasan per Bulan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.monthlyAssignments}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#7A1C1C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Distribusi Penugasan per Pegawai</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.assignmentsByEmployee} dataKey="total" nameKey="full_name" outerRadius={90}>
                {data.assignmentsByEmployee.map((entry, index) => <Cell key={entry.full_name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Daftar Penugasan Aktif</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-slate-100">
              <tr><th className="p-2">Kegiatan</th><th>Tim</th><th>Mulai</th><th>Selesai</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.activeAssignments.map((item) => (
                <tr key={item.id} className="border-b"><td className="p-2">{item.activity_name}</td><td>{item.team_name}</td><td>{item.start_date}</td><td>{item.end_date}</td><td>{item.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
