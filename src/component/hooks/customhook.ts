import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"


interface PaginationProps {
    itemsPerPage: number,
    list: any[],
    currentPage?: number
}
 
export const useEditModal = () => {
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [suggestion,  setSuggestion] = useState<any[]>([]);


    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleEditClick = (providerId: string) => {
        setEditingProviderId(providerId);
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setEditingProviderId(null);
    };

    return {
        handleEditClick,
        closeEditModal,
        isEditOpen,
        editingProviderId,
        handleItemsPerPageChange,
        setIsEditOpen,
        setEditingProviderId,
        itemsPerPage,
        setItemsPerPage,
        currentPage,
        setCurrentPage
    }
}

export const usePagination = ({ list, itemsPerPage }: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    // filter, paid and unpaid states (commented out)
    // const [showFilter, setShowFilter] = useState(false);
    // const [paid, setPaid] = useState(false);
    // const [unpaid, setUnpaid] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const filteredProviders = list?.filter((item: any) => {
    const term = searchTerm.toLowerCase();
    return (
        (typeof item?.name === 'string' && item.name.toLowerCase().includes(term)) ||
        (typeof item?.business_name === 'string' && item.business_name.toLowerCase().includes(term)) ||
        (typeof item?.user_email === 'string' && item.user_email.toLowerCase().includes(term)) ||
        (typeof item?.address === 'string' && item.address.toLowerCase().includes(term)) ||
        item?.pinCode?.toString().includes(term) ||
        item?.phoneNo?.toString().includes(term)
    );
    });

    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const lastIdx = currentPage * itemsPerPage;
    const currentItems = filteredProviders.slice(startIdx, lastIdx);


    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
    if (searchTerm.length > 0) {
      const term = searchTerm.toLowerCase();
      const filtered = list?.filter((item: any) =>
        item?.name?.toLowerCase().includes(term) ||
        item?.business_name?.toLowerCase().includes(term) ||
        item?.user_email?.toLowerCase().includes(term)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

  }, [searchTerm, list]);

    return {
        // filter, paid, unpaid (commented out — pass dummy values so consumers don't break)
        showFilter: false,
        setShowFilter: (() => {}) as Dispatch<SetStateAction<boolean>>,
        paid: false,
        setPaid: (() => {}) as Dispatch<SetStateAction<boolean>>,
        unpaid: false,
        setUnpaid: (() => {}) as Dispatch<SetStateAction<boolean>>,
        showSuggestions,
        setShowSuggestions,
        searchTerm,
        setSearchTerm,
        totalPages,
        startIdx,
        lastIdx,
        currentItems,
        handlePageChange,
        currentPage,
        setCurrentPage,
        isLoading,
        setIsLoading,
        suggestions,
        setSuggestions
    }
}