const initialState = {
    isLoading: true,
    isSignout: false,
    userInfo: null,
    loadingLogin: false,
    allUser: []
}

function useReducer(state = initialState, action) {
    switch (action.type) {
        case 'SIGN_IN':
            return {
                ...state,
                isSignout: false,
                userInfo: action.userInfo,
                isLoading: false,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isSignout: true,
                userInfo: null,
                isLoading: false,
            };
        case 'CHECK_AUTH':
            return {
                ...state,
                loadingLogin: action.status,
            };
        case 'SET_ALL_USERS':
          return {
            ...state,
            allUser: action.allUser
          }
        default:
            return state;
    }
}

export default useReducer;