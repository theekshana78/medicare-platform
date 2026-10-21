import PropTypes from "prop-types";

export function Card({ children, hover = false, className = "", ...rest }) {
  const hoverClass = hover ? "card-hover" : "";
  return (
    <div className={`card ${hoverClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...rest }) {
  return (
    <div className={`card-header ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...rest }) {
  return (
    <h3 className={`card-title ${className}`.trim()} {...rest}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = "", ...rest }) {
  return (
    <div className={`card-body ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...rest }) {
  return (
    <div className={`card-footer ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  hover: PropTypes.bool,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
