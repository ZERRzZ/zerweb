import React from 'react';

interface IProps {
  providers: React.ComponentType<any>[];
  children: React.ReactNode;
}

export const AppProvider: React.FC<IProps> = props => {
  let {providers = [], children} = props;

  const createProvider = () => {
    for (let i = providers.length - 1; i >= 0; i--) {
      let Provider = providers[i];
      children = <Provider>{children}</Provider>;
    }
    return <React.Fragment>{children}</React.Fragment>;
  };
  return createProvider();
};