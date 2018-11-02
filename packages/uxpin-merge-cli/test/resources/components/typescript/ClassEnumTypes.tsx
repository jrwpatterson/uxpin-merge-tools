import * as React from 'react';

export interface Props {
  /**
   * Any element
   */
  children?:React.ReactNode;
  appearance:'secondary' | 'primary' | 'link';
}

export default class ClassEnumTypes extends React.PureComponent<Props> {

  public render():JSX.Element {
    const { children, appearance } = this.props;
    return (
      <div>
        <button className={appearance}>
          {children}
        </button>
      </div>
    );
  }
}
