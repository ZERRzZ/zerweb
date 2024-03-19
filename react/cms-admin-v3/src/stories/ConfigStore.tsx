import React, { Dispatch, useReducer, useEffect } from "react";

interface IConfigContext {
  menuCollapsed: boolean;
  userInfo: any;
  menuParentKey?: string;
}

type ActionType = {
  type: 'menuCollapsed' | 'userInfo' | 'menuParentKey';
  value: any;
}

let defaultState = {
  menuCollapsed: false,
  userInfo: undefined,
  menuParentKey: undefined
} as IConfigContext;

const reducer = (prevState: IConfigContext, action: ActionType) => {
  switch (action.type) {
    case "menuCollapsed":
      return {
        ...prevState,
        menuCollapsed: action.value
      };
    case "userInfo":
      return {
        ...prevState,
        userInfo: action.value
      };
    case "menuParentKey":
      return {
        ...prevState,
        menuParentKey: action.value
      };
    default:
      return prevState
  }
};

export const ConfigContext = React.createContext({} as {
  state: IConfigContext;
  dispatch: Dispatch<ActionType>;
  userHasPems: (pems?: string[]) => boolean;
});

export const ConfigProvider: React.FC = props => {
  let [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {

  }, [])

  const userHasAuth = (auth: string) => {
    if (state.userInfo && state.userInfo.authList) {
      return state.userInfo.authList.includes(auth);
    }
    return false;
  };

  const userHasRole = (role: string) => {
    if (state.userInfo && state.userInfo.roleList) {
      return state.userInfo.roleList.includes(role);
    }
    return false;
  };

  const userHasPems = (pems?: string[]) => {
    if (pems && pems.length) {
      for (let i = 0; i < pems.length; i++) {
        let array = pems[i].split(',');
        if (array.every(a => userHasAuth(a))) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  return <ConfigContext.Provider {...props} value={{ state, dispatch, userHasPems }} />
};