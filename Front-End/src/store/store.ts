/** @format */

import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

// login user store
const storeKey = 'auth';

// initial state
const INITIAL_STATE = {
	token: '',
};

export const authToken = atomWithStorage(storeKey, INITIAL_STATE);
