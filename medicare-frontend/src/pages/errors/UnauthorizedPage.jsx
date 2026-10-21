import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div
      className="layout-container flex-col items-center justify-center text-center"
      style={{ minHeight: "75vh", padding: "4rem 1rem" }}
    >
      <Badge variant="danger" icon={<ShieldAlert size={14} />} className="mb-4">
        HTTP Error 403 &bull; Access Denied
      </Badge>

      <h1 style={{ fontSize: "4.5rem", fontWeight: "900", color: "var(--color-danger)", margin: 0, lineHeight: 1 }}>
        403
      </h1>

      <h2 className="text-h2 mt-2">Restricted Clinical Privilege</h2>

      <p className="text-muted text-lead" style={{ maxWidth: "520px", margin: "1rem auto 2rem" }}>
        Your current session role (<strong>{user?.role ? user.role.toUpperCase() : "GUEST"}</strong>) does not hold authorization to access this administrative resource.
      </p>

      <div className="flex-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" icon={<Home size={16} />}>
            Return to My Dashboard
          </Button>
        </Link>
        <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Previous View
        </button>
      </div>
    </div>
  );
}
