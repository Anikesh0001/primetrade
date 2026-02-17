import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Project, ProjectStatus, projectService } from "../services/projects";
import toast from "react-hot-toast";

const emptyForm = { title: "", description: "", status: "ACTIVE" as ProjectStatus };

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await projectService.list();
      setProjects(result.items);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await projectService.update(editingId, form);
        toast.success("Project updated");
      } else {
        await projectService.create(form);
        toast.success("Project created");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProjects();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Unable to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({ title: project.title, description: project.description, status: project.status });
  };

  const handleDelete = async (id: string) => {
    try {
      await projectService.remove(id);
      toast.success("Project removed");
      await loadProjects();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Unable to delete project");
    }
  };

  return (
    <Layout title="Projects">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Project portfolio</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-400">Loading projects...</p>
          ) : (
            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{project.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase text-slate-200">
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-3 text-sm">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-indigo-300 hover:text-indigo-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-rose-300 hover:text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-sm text-slate-400">No projects yet.</p>}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">{editingId ? "Edit project" : "New project"}</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
            <textarea
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
            <select
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update project" : "Create project"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="w-full rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-200"
              >
                Cancel edit
              </button>
            )}
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default Projects;
