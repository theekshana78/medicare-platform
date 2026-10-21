import PropTypes from "prop-types";

export default function Badge({
  children,
  variant = "primary",
  withDot = false,
  icon = null,
  className = "",
  ...rest
}) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} {...rest}>
      {withDot && <span className="badge-dot" />}
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "success", "warning", "danger", "info", "neutral"]),
  withDot: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};
