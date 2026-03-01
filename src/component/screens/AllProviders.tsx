import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import BusinessCard from '../common/BusinessCard';
import { useEditModal, usePagination } from '../hooks/customhook';

interface ServiceProvider {
  _id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string[];
  phoneNo: string;
}

const AllProviders: React.FC = () => {

  const [providerList, setProviderList] = useState<any[]>([]);
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
    showFilter,
    setShowFilter,
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
  } = usePagination({ list: providerList, itemsPerPage: itemsPerPage });

  const handleApply = () => {
    
    setShowFilter(false);
  }
 

  const api = axios.create({
    'baseURL': 'http://82.180.144.143/api'
  })

  const handleViewDocument = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/get-provider-list`);

      console.log("response", response)
      if (Array.isArray(response.data?.data)) {
        setProviderList(response.data?.data);
      } else {
        console.error("Expected array of providers but got:", response.data?.data);
        setProviderList([]);
      }
    } catch (error) {
      console.error("Error fetching provider list:", error);
      setProviderList([]);
    } finally {
      setIsLoading(false);
    }
  }
  const handleStatusUpdate = async (providerId: string, status: string) => {
    try {
      const response = await api.put(`/update-provider-status/${providerId}`, { status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response", response)
      if (response.status === 200) {
        alert("Provider status updated successfully");
        handleViewDocument();
      } else {
        alert("Failed to update provider status");
      }
    } catch (error) {
      console.error("Error updating provider status:", error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/delete-provider/${id}`);
      console.log("response", response)
      if (response.status === 200) {
        alert("Provider deleted successfully");
        handleViewDocument();
      } else {
        alert("Failed to delete provider");
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      alert("Failed to delete provider");
    }
  }

  useEffect(() => {
    handleViewDocument();
  }, []);

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <BusinessCard
          tittle="All Providers"
          subtittle="Manage provider accounts"
          modal={{
            isEditOpen,
            editingProviderId,
            setIsEditOpen,
            closeEditModal,
            handleEditClick,
            handleItemsPerPageChange,
            setEditingProviderId,
          }}
          pagination={{
            currentPage,
            itemsPerPage,
            currentItems,
            firstIdx: startIdx,
            lastIdx,
            setCurrentPage,
            setItemsPerPage,
            handlePageChange,
            totalPages
          }}
          filters={{
            searchTerm,
            setSearchTerm,
            showFilter,
            setShowFilter,
            suggestions,
            showSuggestions,
            setShowSuggestions,
            setSuggestions,
          }}
          list={providerList}
          isLoading={isLoading}
          handleStatusUpdate={handleStatusUpdate}
          handleApply={handleApply}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AllProviders;
