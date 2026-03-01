import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext } from 'react';

// initializing a new context

type IdContextType = {
    providerId : any,
    setProviderId : Dispatch<SetStateAction<any |  null>>
    image : any,
    setImage : Dispatch<SetStateAction<any |  null>>
    isOpen : any, 
    setIsOpen : Dispatch<SetStateAction<any |  null>>
    selectedDocument : any,
    setSelectedDocument : Dispatch<SetStateAction<any |  null>>
    phoneNumber: string,
    setPhoneNumber: Dispatch<SetStateAction<string>>
}

const IdContext = createContext<IdContextType | undefined>(undefined);


type IdProviderProps = {
    children : ReactNode
}

export const IdProvider: React.FC<IdProviderProps> = ({ children }) => {
    const [providerId, setProviderId] =  useState<string>('')
    const [image, setImage] = useState<any>({})
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedDocument, setSelectedDocument] = useState<number | null>(null)
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    return <IdContext.Provider value={{
        providerId,
        setProviderId,
        image,
        setImage, 
        isOpen,
        setIsOpen, 
        selectedDocument, 
        setSelectedDocument,
        phoneNumber,
        setPhoneNumber
    }}>
        {children}
    </IdContext.Provider>
}

export const useIdContext = () => {
    const context = useContext(IdContext);
    if(!context){
        throw new Error('useIdContext must be used within an IdProvider');
    }
    return context;
}

export const useProviderId = () => useIdContext().providerId;
export const useSetProviderId = () => useIdContext().setProviderId;
export const useImage = () => useIdContext().image;
export const useSetImage = () => useIdContext().setImage;
export const useIsOpen = () => useIdContext().isOpen;
export const useSetIsOpen = () => useIdContext().setIsOpen;
export const useSelectedDocument = () => useIdContext().selectedDocument;
export const useSetSelectedDocument = () => useIdContext().setSelectedDocument;
export const usePhoneNumber = () => useIdContext().phoneNumber;
export const useSetPhoneNumber = () => useIdContext().setPhoneNumber;
