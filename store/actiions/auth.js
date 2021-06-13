import AsyncStorage from "@react-native-async-storage/async-storage";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
let timer;

export const automaticLogin = (token, userId, validUser, expiryTime) => {
  return async (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: LOGIN,
      validUser,
      token,
      userId,
    });
  };
};
export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBNcZ-aRfcuzzKVb6zG1DKNH3HSQOUTQ9g",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }
    const resData = await response.json();
    dispatch(automaticLogin(resData.idToken,resData.localId, true, parseInt(resData.expiresIn)*1000))
    dispatch({
      type: LOGIN,
      validUser: true,
      token: resData.idToken,
      userId: resData.localId,
    });
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(token, userId, expirationDate);
  };
};

export const signin = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBNcZ-aRfcuzzKVb6zG1DKNH3HSQOUTQ9g",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      throw new Error(errorResData.error.message);
    }
    const resData = await response.json();
    console.log(resData);
    dispatch(automaticLogin(resData.idToken,resData.localId, true, parseInt(resData.expiresIn)*1000))
    // dispatch({
    //   type: LOGIN,
    //   validUser: true,
    //   token: resData.idToken,
    //   userId: resData.localId,
    // });
    const expirationDate2 = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate2);
  };
};

export const logout = () => {
  AsyncStorage.removeItem("userData");
  if (timer) {
    clearTimeout(timer);
  }
  return {
    type: LOGOUT,
  };
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
