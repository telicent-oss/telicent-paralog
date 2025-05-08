import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const VerticalDivider = ({ color = "border-whiteSmoke-400", height = "h8" }, props) => (
  <div className={classNames("border-r self-center", height, color)} {...props} />
);
export default VerticalDivider;

VerticalDivider.propTypes = {
  height: PropTypes.string,
};
