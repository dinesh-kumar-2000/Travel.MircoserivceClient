import { RootState } from '@/store/store';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

/**
 * Typed selector hook for Redux Toolkit
 * Use this hook instead of plain `useSelector` to get proper TypeScript support
 *
 * @example
 * const user = useAppSelector(state => state.auth.user);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
