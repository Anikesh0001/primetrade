import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm text-slate-400">Projects</p>
          <h2 className="mt-2 text-2xl font-semibold">Manage your portfolio</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm text-slate-400">Security</p>
          <h2 className="mt-2 text-2xl font-semibold">JWT + RBAC enabled</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-sm text-slate-400">Infrastructure</p>
          <h2 className="mt-2 text-2xl font-semibold">Postgres + Redis</h2>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
