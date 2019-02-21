import React, { PropTypes } from 'react';
import appearancePropTypes from './propTypes/appearancePropTypes';
import modifiers from './utils/modifiers';

const FunctionWithSpreadPropTypes = ({ children, appearance, modifier }) => {
  return (
    <div>
      <button
        className={`${appearance} ${modifier}`}
      >
        {children}
      </button>
    </div>
  );
};

FunctionWithSpreadPropTypes.propTypes = {
  ...appearancePropTypes,
  children: PropTypes.node,
  modifier: PropTypes.oneOf(modifiers),
};

export default FunctionWithSpreadPropTypes;
