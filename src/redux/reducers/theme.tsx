const initialState = {
  selectedTheme: 'light'
}

function themeReducer(state = initialState, action:any) {
  switch (action.type) {
      case 'CHANGE_THEME':
        return {
            ...state,
            selectedTheme: action.selectedTheme
        };
      default:
          return state;
  }
}

export default themeReducer;