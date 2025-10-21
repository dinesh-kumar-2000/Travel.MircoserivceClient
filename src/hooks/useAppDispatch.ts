import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

/**
 * Typed dispatch hook for Redux Toolkit
 * Use this hook instead of plain `useDispatch` to get proper TypeScript support
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction());
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
