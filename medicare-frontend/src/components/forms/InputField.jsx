import { forwardRef } from "react";
import PropTypes from "prop-types";
import { AlertCircle } from "lucide-react";

const InputField = forwardRef(function InputField(
  {
    label,
    name,
    type = "text",
    placeholder = "",
    error = "",
    hint = "",
    required = false,
    disabled = false,
    iconLeft = null,
    iconRight = null,
    className = "",
    ...rest
  },
  ref
) {
  const hasIconLeft = Boolean(iconLeft);
  const hasIconRight = Boolean(iconRight);
  const isInvalid = Boolean(error);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <div className="input-with-icon">
        {hasIconLeft && <span className="input-icon-left">{iconLeft}</span>}

        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${hasIconLeft ? "has-icon-left" : ""} ${
            hasIconRight ? "has-icon-right" : ""
          } ${isInvalid ? "is-invalid" : ""}`.trim()}
          {...rest}
        />

        {hasIconRight && <span className="input-icon-right">{iconRight}</span>}
      </div>

      {isInvalid && (
        <span className="form-error">
          <AlertCircle size={14} />
          {error}
        </span>
      )}

      {!isInvalid && hint && <span className="form-hint">{hint}</span>}
    </div>
  );
});

InputField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  className: PropTypes.string,
};

export default InputField;
