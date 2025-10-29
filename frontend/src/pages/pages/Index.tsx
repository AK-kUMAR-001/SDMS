import Layout from "../components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Welcome to the Student Database Management System
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a section from the sidebar to get started.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;