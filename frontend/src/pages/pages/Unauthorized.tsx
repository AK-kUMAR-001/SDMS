import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="text-xl text-muted-foreground mt-2">Access Denied</p>
      <p className="mt-4">
        You do not have the necessary permissions to view this page.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

export default Unauthorized;