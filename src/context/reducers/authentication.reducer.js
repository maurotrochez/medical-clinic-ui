import { SET_USER } from '../actions/authentication.action'

export default function (state, action) {
    switch (action.type) {
        
        case SET_USER:
            return {
                ...state,
                isAuthenticated: !(action.payload === undefined || action.payload === null || (typeof action.payload === 'object' && Object.keys(action.payload).length === 0) ||
                                (typeof action.payload === 'string' && action.payload.trim().length === 0)),
                user: action.payload
            }
        default:
            return state;
    }
}