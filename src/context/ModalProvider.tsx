 
import ModalUI from "@/components/ui-elements/Modal/ModalUI";
import { createContext, useContext, useState, ReactNode } from "react"; 

export type ModalType = "loading" | "success" | "error" | "warning" | "info";

export interface ModalContextType {
  showModal: (type: ModalType, message?: string) => void;
  hideModal: () => void;
}

//  ใช้ undefined ตาม best practice
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

//  hook กันใช้ผิดที่
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};
 
//  type modal state
interface ModalState {
  open: boolean;
  type: ModalType;
  message: string;
}



export default function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: "loading",
    message: "",
  });

  //  ใส่ type ให้ param
  const showModal = (type: ModalType, message = "") => {
    setModal({ open: true, type, message });
  };

  //  ใช้ prev กัน bug state
  const hideModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };
  //  ให้ global กันง่ายๆ (แต่ระวังใช้ผิดที่)
  if (typeof window !== "undefined") {
    (window as any).showModal = showModal;
    (window as any).hideModal = hideModal;
  }
  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modal.open && <ModalUI modal={modal} />}
      {/* {modal.open && (
        <ModalUI
          open={modal.open}
          type={modal.type}
          title="Confirm"
          message={modal.message}
          onClose={hideModal}
        />
      )} */}
    </ModalContext.Provider>
  );

  
}