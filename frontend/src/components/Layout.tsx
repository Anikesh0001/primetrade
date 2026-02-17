import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

const Layout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch {
      toast.error("Unable to logout");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="text-lg font-semibold">Intern Platform</div>
        <div className="flex gap-4 text-sm">
          <Link to="/dashboard" className="text-slate-200 hover:text-white">
            Dashboard
          </Link>
          <Link to="/projects" className="text-slate-200 hover:text-white">
            Projects
          </Link>
          <button onClick={handleLogout} className="text-rose-300 hover:text-rose-200">
            Logout
          </button>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
