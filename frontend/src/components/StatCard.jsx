const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4 border-l-4 border-maroon">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default StatCard;
