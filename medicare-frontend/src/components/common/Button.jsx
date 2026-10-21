import PropTypes from "prop-types";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  onClick,
  ...rest
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== "md" ? `btn-${size}` : "";
  const loadingClass = loading ? "btn-loading" : "";
  const blockClass = fullWidth ? "btn-block" : "";

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${loadingClass} ${blockClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {!loading && icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger", "ghost", "success"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
