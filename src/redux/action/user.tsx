const SIGN_IN = 'SIGN_IN';
const SIGN_OUT = 'SIGN_IN';
const CHECK_AUTH = 'CHECK_AUTH';
export function singInUser(data) {
    return {
      type: SIGN_IN,
      userInfo: data
    }
}

export function singOutUser() {
    return {
      type: SIGN_OUT
    }
}
  
export function loadingLogin(loadingLogin) {
    return {
      type: CHECK_AUTH,
      loadingLogin: loadingLogin
    }
  }
  