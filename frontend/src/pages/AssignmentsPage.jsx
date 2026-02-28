import { useEffect, useState } from 'react';
import client from '../api/client';

const initialForm = {
  letterNumber: '',
  letterDate: '',
  activityName: '',
  location: '',
  startDate: '',
  endDate: '',
  teamName: '',
  leaderId: '',
  memberIds: '',
  status: 'Perencanaan',
};

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const [assignmentRes, employeeRes] = await Promise.all([
      client.get('/assignments'),
      client.get('/employees?limit=100'),
    ]);
    setAssignments(assignmentRes.data);
    setEmployees(employeeRes.data.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/assignments', {
        ...form,
        leaderId: Number(form.leaderId),
        memberIds: form.memberIds.split(',').map((id) => Number(id.trim())).filter(Boolean),
      });
      setMessage('Penugasan berhasil disimpan.');
      setForm(initialForm);
      loadData();
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setMessage(apiMessage || 'Gagal menyimpan penugasan.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <h2 className="text-2xl font-bold">Manajemen Penugasan</h2>
        <div className="space-x-2">
          <a className="bg-white border px-3 py-2 rounded" href={`${client.defaults.baseURL}/exports/excel`}>Export Excel</a>
          <a className="bg-white border px-3 py-2 rounded" href={`${client.defaults.baseURL}/exports/pdf`}>Export PDF</a>
        </div>
      </div>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded shadow">
        {Object.entries(form).map(([key, value]) => (
          <input key={key} className="border p-2 rounded" placeholder={key} value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        ))}
        <div className="md:col-span-2">
          <p className="text-xs text-slate-500 mb-1">Referensi ID Pegawai</p>
          <p className="text-xs text-slate-600">{employees.map((item) => `${item.id}:${item.full_name}`).join(' | ')}</p>
        </div>
        <button className="md:col-span-2 bg-maroon text-white py-2 rounded">Simpan Penugasan</button>
      </form>

      {message && <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded">{message}</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr><th className="p-2">No Surat</th><th>Kegiatan</th><th>Lokasi</th><th>Tanggal</th><th>Status</th></tr>
          </thead>
          <tbody>
            {assignments.map((item) => (
              <tr key={item.id} className="border-b"><td className="p-2">{item.letter_number}</td><td>{item.activity_name}</td><td>{item.location}</td><td>{item.start_date} s/d {item.end_date}</td><td>{item.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsPage;
