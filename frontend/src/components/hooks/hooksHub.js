// path: frontend\src\components\dashboardUtils\hooksHub.js

import { useGetCurrentUser } from './queries/useGetCurrentUser';
import { useGetContactRequestsByContext } from './queries/useGetContactRequestsByContext';

import { useAcceptContactRequest } from './mutations/useAcceptContactRequest';
import { useRejectContactRequest } from './mutations/useRejectContactRequest';


export {
    useGetContactRequestsByContext,
    useAcceptContactRequest,
    useRejectContactRequest,
    useGetCurrentUser
}
