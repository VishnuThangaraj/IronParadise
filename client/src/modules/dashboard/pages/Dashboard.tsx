const Dashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-3xl text-zinc-900 dark:text-zinc-100">
          Dashboard Overview
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Welcome back. Here is what's happening at IronParadise today.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
