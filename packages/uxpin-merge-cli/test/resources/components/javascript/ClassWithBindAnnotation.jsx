import React, { Component, PropTypes } from 'react';

export default class ClassWithBindAnnotation extends Component {

  render() {
    const { isChecked, onChange, label, name } = this.props;
    return (
      <label>
        {label}
        <input type="checkbox" name={name} onChange={onChange} checked={isChecked} />
      </label>
    );
  }
}

ClassWithBindAnnotation.propTypes = {
  /**
   * @uxpinbind onChange 0.target.checked
   */
  isChecked: PropTypes.bool,
  /**
   * @uxpinbind onDisabled
   * Here is further description of the property
   */
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onDisabled: PropTypes.func,
};

ClassWithBindAnnotation.defaultProps = {
  isChecked: false,
  isDisabled: false,
  name: '',
};
