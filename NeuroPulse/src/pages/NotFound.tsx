import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui";

export default function NotFound() {
  return <EmptyState title="Page not found" body="That address doesn't exist in NeuroPulse." action={<Link to="/" className="btn-primary">Go to dashboard</Link>} />;
}
