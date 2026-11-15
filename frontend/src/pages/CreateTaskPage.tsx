import { useNavigate } from 'react-router-dom';
import type { Task } from '../types/task';

function CreateTaskPage() {
  const navigate = useNavigate();

  const handleTaskCreated = (task: Task) => {
    console.log('Task created:', task);
    navigate('/');
  };

  return (
    <section className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Create Task
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a new task to your team's workload.
        </p>
      </div>

    </section>
  );
}

export default CreateTaskPage;