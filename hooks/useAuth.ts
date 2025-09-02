
// FIX: Removed unused imports. 'AuthContext' was not exported, causing an error. The file only re-exports useAuth.
// This is a convenience hook to avoid importing useContext and AuthContext in every component.
// The actual implementation is in context/AuthContext.tsx.
// We are re-exporting the useAuth hook from there.
export { useAuth } from '../context/AuthContext';