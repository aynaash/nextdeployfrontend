// "use client";
//
// import { createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";
// import { useAuthModal } from "./sign-in-modal.tsx";
//
// type ModalContextType = {
//   // Original functionality
//   setShowSignInModal: Dispatch<SetStateAction<boolean>>;
//   // New functionality
//   showAuthModal: (isSignUp?: boolean) => void;
//   setIsSignUp: Dispatch<SetStateAction<boolean>>;
// };
//
// export const ModalContext = createContext<ModalContextType>({
//   setShowSignInModal: () => {},
//   showAuthModal: () => {},
//   setIsSignUp: () => {},
// });
//
// export default function ModalProvider({ children }: { children: ReactNode }) {
//   const { AuthModal, setShowModal, setIsSignUp, isSignUp } = useAuthModal();
//
//   const showAuthModal = (signUp = false) => {
//     setIsSignUp(signUp);
//     setShowModal(true);
//   };
//
//   return (
//     <ModalContext.Provider
//       value={{
//         // Original functionality
//         setShowSignInModal: setShowModal, // Maps setShowSignInModal to setShowModal
//         // New functionality
//         showAuthModal,
//         setIsSignUp,
//       }}
//     >
//       {children}
//       <AuthModal />
//     </ModalContext.Provider>
//   );
// }
//
// export const useModal = () => useContext(ModalContext);
