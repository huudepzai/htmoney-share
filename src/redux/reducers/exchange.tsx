const initialState = {
    groups: [],
		wallet: [],
		fillters: {
      groupType: "chi",
      selectedFill: "thisMonth",
      startDateFill: new Date(),
      endDateFill: new Date(),
    }
}

function exChangeReducer(state = initialState, action:any) {
    switch (action.type) {
        case 'ADD_GROUP':
					return {
							...state,
							groups: action.groups
					};
        case 'ADD_WALLET':
					return {
						...state,
						wallet: action.wallet,
					};
        case 'ADD_FILLTER':
					return {
						...state,
						fillters: action.fillters,
					};
        default:
            return state;
    }
}

export default exChangeReducer;