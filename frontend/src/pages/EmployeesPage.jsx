import { useEffect, useState } from 'react';
import client from '../api/client';

const EmployeesPage = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10 });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ nip: '', fullName: '', position: '', division: '', isActive: true });

  const load = async (page = 1, keyword = search) => {
    const response = await client.get(`/employees?page=${page}&search=${keyword}`);
    setData(response.data.data);
    setPagination(response.data.pagination);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await client.post('/employees', form);
    setForm({ nip: '', fullName: '', position: '', division: '', isActive: true });
    load(1, '');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manajemen Pegawai</h2>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Cari nama / NIP" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="bg-maroon text-white px-3 py-2 rounded" onClick={() => load(1, search)}>Cari Cepat</button>
      </div>

      <form className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded shadow" onSubmit={submit}>
        <input className="border p-2 rounded" placeholder="NIP" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Nama" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Jabatan" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Bidang" value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })} />
        <button className="md:col-span-2 bg-maroon text-white py-2 rounded">Tambah Pegawai</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left"><tr><th className="p-2">NIP</th><th>Nama</th><th>Jabatan</th><th>Bidang</th><th>Status</th></tr></thead>
          <tbody>
            {data.map((employee) => (
              <tr key={employee.id} className="border-b"><td className="p-2">{employee.nip}</td><td>{employee.full_name}</td><td>{employee.position}</td><td>{employee.division}</td><td>{employee.is_active ? 'Aktif' : 'Nonaktif'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-3 py-1 border rounded" disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1, search)}>Prev</button>
        <span>Halaman {pagination.page}</span>
        <button className="px-3 py-1 border rounded" disabled={pagination.page * pagination.limit >= pagination.total} onClick={() => load(pagination.page + 1, search)}>Next</button>
      </div>
    </div>
  );
};

export default EmployeesPage;
