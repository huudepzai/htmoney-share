const CHANGE_THEME = 'CHANGE_THEME';

export function changeTheme(data:any) {
    return {
      type: CHANGE_THEME,
      selectedTheme: data
    }
}