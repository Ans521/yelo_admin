import { ChevronLeft, ChevronRight, Search, Trash2, Star, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

interface ServiceProvider {
  _id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string[];
  phoneNo: string;
}

export interface BusinessCardProps {
  tittle: string;
  subtittle: string;

  modal: {
    isEditOpen: boolean;
    editingProviderId: string | null;
    setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
    closeEditModal: () => void;
    handleEditClick: (id: any) => void;
    handleItemsPerPageChange : (event: React.ChangeEvent<HTMLSelectElement>) => void
    setEditingProviderId : React.Dispatch<React.SetStateAction<string | null>>,
  };

  pagination: {
    currentPage: number;
    itemsPerPage: number;
    currentItems: ServiceProvider[];
    firstIdx: number;
    lastIdx: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
    handlePageChange: (pageNumber: number) => void;
    totalPages: number;
  };

  filters: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    showFilter: boolean;
    setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
    // paid: boolean;
    // setPaid: React.Dispatch<React.SetStateAction<boolean>>;
    // unpaid: boolean;
    // setUnpaid: React.Dispatch<React.SetStateAction<boolean>>;
    showSuggestions: boolean;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    suggestions: any[],
    setSuggestions: React.Dispatch<React.SetStateAction<any[]>>
  };
  handleApply? : () => void
  list: ServiceProvider[];
  isLoading: boolean;
  handleStatusUpdate?: (providerId: string, status: string) => void;
  handleDelete?: (id: string) => void;
  /** Toggle is_popular or is_recent via mark-business API */
  onMarkBusiness?: (businessId: string | number, field: 'is_popular' | 'is_recent', currentValue: number) => void;
  /** Set business as verified via verify-business API */
  onVerifyBusiness?: (businessId: string | number, currentValue: number) => void;
  /** Submit a review / rating for a business */
  onSubmitReview?: (businessId: string | number, rating: string) => Promise<void> | void;
}


const BusinessCard = ({ tittle, subtittle, modal, pagination, filters, list, isLoading, handleDelete, onMarkBusiness, onVerifyBusiness, onSubmitReview }: BusinessCardProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBusinessId, setReviewBusinessId] = useState<string | number | null>(null);
  const [reviewText, setReviewText] = useState('');
  
  const openGallery = (gallery: string[] | undefined) => {
    setGalleryImages(Array.isArray(gallery) ? gallery : []);
    setGalleryOpen(true);
  };

  const openServicesModal = (services: string[] | undefined) => {
    setServicesList(Array.isArray(services) ? services : []);
    setServicesModalOpen(true);
  };

  return (
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#F0F2FD]">
        <div className='mb-5 -mt-1'>
          <h1 className="text-2xl font-bold text-gray-800">{tittle}</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row lg:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="mt-1 text-sm text-gray-600">{subtittle}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar with Auto-suggestions */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Businesses...."
                    value={filters.searchTerm}
                    onChange={(e) => filters.setSearchTerm(e.target.value)}
                    onFocus={() => filters.setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => filters.setShowSuggestions(false), 200)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                  {/* Suggestions Dropdown */}
                  {filters.showSuggestions && filters.suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filters.suggestions.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            filters.setSearchTerm(item.business_name || item.name || '');
                            filters.setShowSuggestions(false);
                          }}
                        >
                          <span className="text-sm text-gray-800">{item.business_name || item.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Filter, paid and unpaid — commented out */}
                {/* <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => filters.setShowFilter(!filters.showFilter)}>
                  <Filter size={20} className="text-gray-600 mr-2" />
                  <span>Filters</span>
                </button> */}

                {/* Filter panel (paid / unpaid) — commented out */}
                {/* {isProvider && filters.showFilter && (
                  <div className="w-full max-w-sm mx-auto p-4 bg-white shadow rounded-2xl absolute right-6 top-16 z-20 cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold mb-3">Filters</h2>
                      <h2 className='text-sm font-thin mb-3 cursor-pointer bg-slate-100 hover:bg-slate-200 hover:font-semibold p-1 px-2 rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out' onClick={() => filters.setShowFilter(false)}>Close</h2>
                    </div>
                    <div className="flex items-center mb-2">
                      <input type="checkbox" id="paid" checked={filters.paid} onChange={(e) => filters.setPaid(e.target.checked)} className="mr-2" />
                      <label htmlFor="paid">Paid Service Provider</label>
                    </div>
                    <div className="flex items-center mb-4">
                      <input type="checkbox" id="unpaid" checked={filters.unpaid} onChange={(e) => filters.setUnpaid(e.target.checked)} className="mr-2" />
                      <label htmlFor="unpaid">Unpaid Service Provider</label>
                    </div>
                    <button onClick={handleApply} className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 hover:scale-105 transition-transform duration-200 ease-in-out">Apply</button>
                  </div>
                    )} */}

              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-2 border-[#6362E7] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Phone No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services Offered</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Gallery</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popular</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newly Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating (0–5)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pagination.currentItems.map((row: any, index: number) => {
                      const businessId = row?.business_id ?? row?._id;
                      const isPopular = Number(row?.is_popular) === 1;
                      const isRecent = Number(row?.is_recent) === 1;
                      const isVerified = Number(row?.is_verified) === 1;
                      return (
                        <tr key={businessId ?? index} className="hover:bg-gray-50 transition-colors duration-200 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pagination.firstIdx + index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{row?.business_name ?? '—'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate" title={row?.address}>{row?.address ?? '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row?.category_name ?? '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row?.subcategory_name ?? '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row?.user_email ?? '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row?.user_name ?? '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row?.user_phoneno ?? '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Array.isArray(row?.services_offered) && row.services_offered.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => openServicesModal(row.services_offered)}
                                className="text-sm font-medium text-[#6362E7] hover:text-[#4f4ee0] underline"
                              >
                                View ({row.services_offered.length})
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => openGallery(row?.gallery)}
                              className="text-sm font-medium text-[#6362E7] hover:text-[#4f4ee0] underline"
                            >
                              View Gallery
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {onMarkBusiness && (
                              <button
                                type="button"
                                onClick={() => onMarkBusiness(businessId, 'is_popular', Number(row?.is_popular) || 0)}
                                className="flex items-center gap-1 group/star"
                                title={isPopular ? 'Remove from Popular' : 'Mark as Popular'}
                              >
                                <Star size={20} className={isPopular ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300 group-hover/star:text-yellow-400'} />
                                <span className="text-xs font-medium text-gray-600">Popular</span>
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {onMarkBusiness && (
                              <button
                                type="button"
                                onClick={() => onMarkBusiness(businessId, 'is_recent', Number(row?.is_recent) || 0)}
                                className="flex items-center gap-1 group/star"
                                title={isRecent ? 'Remove from Newly Added' : 'Mark as Newly Added'}
                              >
                                <Star size={20} className={isRecent ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300 group-hover/star:text-yellow-400'} />
                                <span className="text-xs font-medium text-gray-600">Newly Added</span>
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {onVerifyBusiness && (
                              <button
                                type="button"
                                onClick={() => onVerifyBusiness(businessId, Number(row?.is_verified) || 0)}
                                className="flex items-center gap-1"
                                title={isVerified ? 'Verified' : 'Verify business'}
                              >
                                <ShieldCheck size={20} className={isVerified ? 'text-green-600' : 'text-gray-300 hover:text-green-500'} />
                                <span className="text-xs font-medium text-gray-600">{isVerified ? 'Verified' : 'Verify'}</span>
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {onSubmitReview && (
                              <div className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewBusinessId(businessId);
                                    setReviewText(row?.review ?? '');
                                    setReviewModalOpen(true);
                                  }}
                                  className="text-xs font-medium text-[#6362E7] hover:text-[#4f4ee0] underline"
                                >
                                  {row?.review ? 'Edit rating' : 'Give rating'}
                                </button>
                                {row?.review && (
                                  <span
                                    className="text-xs text-gray-500 max-w-[180px] truncate"
                                    title={row.review}
                                  >
                                    {row.review}/5
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {handleDelete && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${row?.business_name ?? 'this business'}"?`)) {
                                      handleDelete(String(businessId));
                                    }
                                  }}
                                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Gallery modal — shows row.gallery images with Close button */}
              {galleryOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setGalleryOpen(false)}>
                  <div className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Gallery</h3>
                      <button
                        type="button"
                        onClick={() => setGalleryOpen(false)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {galleryImages.length === 0 ? (
                        <p className="text-gray-500 col-span-full">No images in gallery.</p>
                      ) : (
                        galleryImages.map((item: { url: string; isMain: boolean }, i: number) => (
                          <img
                            key={i}
                            src={item.url}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ))
                      )
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Services Offered modal — shows list of services with Close button */}
              {servicesModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setServicesModalOpen(false)}>
                  <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Services Offered</h3>
                      <button
                        type="button"
                        onClick={() => setServicesModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-80">
                      {servicesList.length === 0 ? (
                        <p className="text-gray-500">No services listed.</p>
                      ) : (
                        <ul className="space-y-2">
                          {servicesList.map((service: string, i: number) => (
                            <li key={i} className="text-sm text-gray-800 py-1 border-b border-gray-100 last:border-0">
                              {i + 1}. {service}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Review modal — inline simple overlay to submit rating */}
              {reviewModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setReviewModalOpen(false)}>
                  <div
                    className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">Give rating</h3>
                    <input
                      type="number"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      min={0}
                      max={5}
                      step={0.1}
                      placeholder="Enter rating between 0 and 5"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setReviewModalOpen(false);
                          setReviewBusinessId(null);
                          setReviewText('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!onSubmitReview || reviewBusinessId == null) return;
                          await onSubmitReview(reviewBusinessId, reviewText.trim());
                          setReviewModalOpen(false);
                          setReviewBusinessId(null);
                          setReviewText('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#6362E7] rounded-lg hover:bg-[#4f4ee0] transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination Section */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between items-center     gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                      value={pagination.itemsPerPage}
                      onChange={modal.handleItemsPerPageChange}
                      className="border rounded-md px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-[#6362E7] focus:border-transparent"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span className="text-sm text-gray-700">entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => pagination.handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`p-2 rounded-md ${pagination.currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-200'
                        } transition-colors`}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-5 py-2 bg-[#6362E7] text-white font-medium rounded-lg shadow-md hover:bg-[#4f4ee0] transition-colors duration-200 cursor-pointer">
                      {pagination.currentPage}
                    </span>
                    <button
                      onClick={() => pagination.handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`p-2 rounded-md ${pagination.currentPage === pagination.totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-200'
                        } transition-colors`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-700">
                    Showing {pagination.firstIdx + 1} to {pagination.lastIdx} of {list.length} entries
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  )
}

export default BusinessCard
