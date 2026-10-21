import { forwardRef } from "react";
import PropTypes from "prop-types";
import { AlertCircle } from "lucide-react";

const SelectField = forwardRef(function SelectField(
  {
    label,
    name,
    options = [],
    error = "",
    hint = "",
    required = false,
    disabled = false,
    placeholder = "Select an option...",
    className = "",
    ...rest
  },
  ref
) {
  const isInvalid = Boolean(error);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={name}
        name={name}
        disabled={disabled}
        className={`form-select ${isInvalid ? "is-invalid" : ""}`.trim()}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default SelectField;
