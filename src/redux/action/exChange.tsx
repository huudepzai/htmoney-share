const ADD_GROUP = 'ADD_GROUP';
const ADD_WALLET = 'ADD_WALLET';
const ADD_FILLTER = 'ADD_FILLTER';

export function addWallet(data:any) {
    return {
      type: ADD_WALLET,
      wallets: data
    }
}
  
export function addGroup(data:any) {
    return {
      type: ADD_GROUP,
      groups: data
    }
  }
  
export function addFilter(data:any) {
    return {
      type: ADD_FILLTER,
      fillters: data
    }
  }
  