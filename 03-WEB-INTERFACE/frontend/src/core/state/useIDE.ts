import { useIDEStore } from './IDEContext';

/**
 * Hook to access IDE state
 * This file is separate to avoid react-refresh warnings
 * 
 * Note: We use Zustand store directly, no need for Context
 */
export const useIDE = useIDEStore;

