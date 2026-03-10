import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { api } from '../../api';
import BusinessCard, { type BusinessCardProps } from '../common/BusinessCard';
import { useEditModal, usePagination } from '../hooks/customhook';

interface ServiceProvider {
  _id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string[];
  phoneNo: string;
}

const AllBusinesses: React.FC = () => {

  const [businessList, setBusinessList] = useState<any[]>([]);
  const {
    handleEditClick,
    closeEditModal,
    isEditOpen,
    editingProviderId,
    handleItemsPerPageChange,
    setIsEditOpen,
    setEditingProviderId,
    itemsPerPage,
    setItemsPerPage
  } = useEditModal();


  const {
    // showFilter, setShowFilter, paid, setPaid, unpaid, setUnpaid (filter/paid/unpaid commented out)
    showFilter,
    setShowFilter,
    paid,
    // setPaid,
    unpaid,
    // setUnpaid,
    showSuggestions,
    setShowSuggestions,
    searchTerm,
    setSearchTerm,
    startIdx,
    lastIdx,
    currentItems,
    handlePageChange,
    currentPage,
    setCurrentPage,
    isLoading,
    setIsLoading,
    suggestions,
    setSuggestions,
    totalPages
  } = usePagination({ list: businessList, itemsPerPage: itemsPerPage });

  // filter / paid / unpaid — commented out
  const handleApply = () => {
    // if (paid && unpaid) {
    //   fetchBusinessList()
    // } else if (paid) {
    //   const paidBusinesses = businessList?.filter((business: any) => business?.orderSubActive === true);
    //   setBusinessList(paidBusinesses);
    // } else if (unpaid) {
    //   const unpaidBusinesses = businessList?.filter((business: any) => business.orderSubActive == null || business.orderSubStatus == null);
    //   setBusinessList(unpaidBusinesses);
    // } else if (!paid && !unpaid) {
    //   fetchBusinessList()
    // }
    fetchBusinessList();
    setShowFilter(false);
  }
 

  const fetchBusinessList = async () => {
    try {
      setIsLoading(true);
      // Using the same provider list endpoint since businesses are similar to providers
      const response = await api.get(`/get-all-business`);

      console.log("response", response);

      
      if (Array.isArray(response.data?.data)) {
        setBusinessList(response.data?.data);
      } else {
        console.error("Expected array of businesses but got:", response.data?.data);
        setBusinessList([]);
      }
    } catch (error) {
      console.error("Error fetching business list:", error);
      setBusinessList([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusUpdate = async (businessId: string, status: string) => {
    try {
      const response = await api.put(`/update-provider-status/${businessId}`, { status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response", response)
      if (response.status === 200) {
        alert("Business status updated successfully");
        fetchBusinessList();
      } else {
        alert("Failed to update business status");
      }
    } catch (error) {
      console.error("Error updating business status:", error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await api.post(`/delete-business`, { business_id: Number(id) });
      console.log("response", response)
      if (response.status === 200 || response.status === 201) {
        alert("Business deleted successfully");
        fetchBusinessList();
      } else {
        alert("Failed to delete business");
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      alert("Failed to delete business");
    }
  }

  // Mark business as popular or recent (toggle) — call mark-business API
  const handleMarkBusiness = async (businessId: string | number, field: 'is_popular' | 'is_recent', currentValue: number) => {
    try {
      const payload = field === 'is_popular'
        ? { business_id: Number(businessId), is_popular: currentValue === 1 ? 0 : 1 }
        : { business_id: Number(businessId), is_recent: currentValue === 1 ? 0 : 1 };

        console.log("payload", payload);
      const response = await api.post('/update-business-flags', payload);
      if (response.status === 200 || response.status === 201) {
        alert(`Business added into ${field === 'is_popular' ? 'Popular' : 'Recent'} successfully`);
        fetchBusinessList();
      } else {
        alert(`Failed to update ${field === 'is_popular' ? 'Popular' : 'Recent'}`);
      }
    } catch (error) {
      console.error('Error marking business:', error);
      alert('Failed to update');
    }
  };

  // Verify business — call verify-business API
  const handleVerifyBusiness = async (businessId: string | number, currentValue: number) => {
    try {
      const payload  = { business_id: Number(businessId), is_verified: currentValue === 1 ? 0 : 1 }
      console.log("payload", payload);
      const response = await api.post('/update-business-flags', payload);
      console.log("response", response);
      if (response.status === 200 || response.status === 201) {
        alert(`Business ${currentValue === 1 ? 'unverified' : 'verified'} successfully`);
        fetchBusinessList();
      } else {
        alert('Failed to verify business');
      }
    } catch (error) {
      console.error('Error verifying business:', error);
      alert('Failed to verify business');
    }
  };

  const handleSubmitReview = async (businessId: string | number, review: string) => {
    try {
      const payload = {
        business_id: Number(businessId),
        review,
      };
      console.log("submit-review payload", payload);
      const response = await api.post('/submit-review', payload);
      console.log("submit-review response", response);
      if (response.status === 200 || response.status === 201) {
        alert('Review submitted successfully');
        await fetchBusinessList();
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  useEffect(() => {
    fetchBusinessList();
  }, []);

  const businessCardProps: BusinessCardProps = {
    tittle: "All Businesses",
    subtittle: "Manage all business accounts",
    modal: {
      isEditOpen,
      editingProviderId,
      setIsEditOpen,
      closeEditModal,
      handleEditClick,
      handleItemsPerPageChange,
      setEditingProviderId,
    },
    pagination: {
      currentPage,
      itemsPerPage,
      currentItems,
      firstIdx: startIdx,
      lastIdx,
      setCurrentPage,
      setItemsPerPage,
      handlePageChange,
      totalPages,
    },
    filters: {
      searchTerm,
      setSearchTerm,
      showFilter,
      setShowFilter,
      suggestions,
      showSuggestions,
      setShowSuggestions,
      setSuggestions,
    },
    list: businessList,
    isLoading,
    handleStatusUpdate,
    handleApply,
    handleDelete,
    onMarkBusiness: handleMarkBusiness,
    onVerifyBusiness: handleVerifyBusiness,
    onSubmitReview: handleSubmitReview,
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <BusinessCard {...businessCardProps} />
      </div>
    </div>
  );
};

export default AllBusinesses;
