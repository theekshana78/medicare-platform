import { Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

export default function NotFoundPage() {
  return (
    <div
      className="layout-container flex-col items-center justify-center text-center"
      style={{ minHeight: "70vh", padding: "4rem 1rem" }}
    >
      <Badge variant="warning" icon={<AlertTriangle size={14} />} className="mb-4">
        HTTP Error 404
      </Badge>

      <h1 style={{ fontSize: "5rem", fontWeight: "900", color: "var(--color-primary)", margin: 0, lineHeight: 1 }}>
        404
      </h1>

      <h2 className="text-h2 mt-2">Clinical Route Not Found</h2>

      <p className="text-muted text-lead" style={{ maxWidth: "500px", margin: "1rem auto 2rem" }}>
        The page or healthcare record you are looking for does not exist or has been relocated to another clinical department.
      </p>

      <div className="flex-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={<Home size={16} />}>
            Back to Home
          </Button>
        </Link>
        <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Previous Page
        </button>
      </div>
    </div>
  );
}
