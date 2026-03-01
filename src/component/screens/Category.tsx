import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { api } from '../../api';

// One object per subcategory in the form — replaces the old parallel arrays
// (newSubcategories, uploadedFile, uploadedFileUrl, imageUrl, subCatId)
interface SubcatForm {
  id?: string;        // only set when editing an existing subcategory
  name: string;
  imageUrl?: string;   // backend URL returned after upload
  previewUrl?: string; // local blob URL for frontend preview
}

interface Subcategory {
  _id?: string;
  name: string;
  image?: string;
}

interface CategoryItem {
  _id?: string;
  category: string;
  subcategories: Subcategory[];
}

const Category: React.FC = () => {
  // ---- List state ----
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ---- Form state ----
  const [categoryName, setCategoryName] = useState<string>('');
  const [subcats, setSubcats] = useState<SubcatForm[]>([{ name: '' }]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editCatId, setEditCatId] = useState<string | null>(null);

  // ---- Image preview modal ----
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ================== API calls ==================

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/get-all-category', {
        params: { isSkipAuth: true }
      });
      console.log("data", data.data);
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---- Reset form to initial state ----
  const resetForm = () => {
    setCategoryName('');
    setSubcats([{ name: '' }]);
    setIsEditMode(false);
    setEditCatId(null);
  };

  // ---- Add / Update category ----
  const handleSubmitCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please fill category name');
      return;
    }

    const validSubcats = subcats.filter(s => s.name.trim() && s.imageUrl !== undefined && s.imageUrl !== null);
    if (validSubcats.length === 0) {
      alert('Please add at least one subcategory.');
      return;
    }

    try {
      if (!isEditMode) {
        // ---- CREATE ----
        const payload = {
          category: categoryName,
          subcategories: validSubcats.map(s => ({
            name: s.name,
            image: s.imageUrl || null
          }))
        };

        const response = await api.post('/add-categories', payload);
        if (response.status === 200 || response.status === 201) {
          alert('Category added successfully');
          resetForm();
          fetchCategories();
        }
      } else {
        // ---- UPDATE ----
        const payload = {
          category: categoryName,
          categoryId: editCatId,
          subcategories: validSubcats.map(s => ({
            subcategoryId: s.id,
            name: s.name,
            image: s.imageUrl || null
          }))
        };

        const response = await api.post('/update-category', payload);
        if (response.status === 200 || response.status === 201) {
          alert('Category updated successfully');
          resetForm();
          fetchCategories();
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category or category already exists');
    }
  };

  // ---- Delete category or subcategory ----
  const handleDeleteCategory = async (categoryId: string | null, subcategoryId: string | null, isCategory: boolean) => {

    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      let response: any;
      if(isCategory) {
        response = await api.post(`/delete-category`, { categoryId, isCategory });
      } else {
        response = await api.post(`/delete-category`, { subcategoryId, isCategory });
      }
      if (response.status === 200 || response.status === 201) {
        alert('Deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  // ================== Form helpers ==================

  // ---- Update a subcategory field by index ----
  const updateSubcat = (index: number, updates: Partial<SubcatForm>) => {
    setSubcats(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  // ---- Add new empty subcategory field ----
  const addSubcatField = () => {
    setSubcats(prev => [...prev, { name: '' }]);
  };

  // ---- Remove subcategory field by index ----
  const removeSubcatField = (index: number) => {
    setSubcats(prev => prev.filter((_, i) => i !== index));
  };

  // ---- Handle image upload for a subcategory ----
  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", e);
    console.log("e.target", e.target);
    console.log("e.target.files", e.target.files);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response: any = await api.post('/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response?.status === 200 || response?.status === 201) {
        alert('File uploaded successfully');
        console.log("response", response.data);
        console.log("Uploaded image url", URL.createObjectURL(file));
        updateSubcat(index, {
          imageUrl: response.data.imageUrl,
          previewUrl: URL.createObjectURL(file)
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  // ---- Populate form when editing an existing category ----
  const handleEditCategory = (categoryId: string) => {
    console.log("categoryId", categoryId);
    const category: any = categories.find((cat: any) => cat.category_id.toString() === categoryId);
    if (!category) return;
    console.log("category", category);

    setCategoryName(category.category_name);
    setEditCatId(categoryId);
    setSubcats(
      category.subcategories.map((sub: any) => ({
        id: sub.subcategory_id,
        name: sub.subcategory_name,
        imageUrl: sub.image_url,
        previewUrl: sub.image_url  // use blob url as preview for existing images
      }))
    );
    setIsEditMode(true);
  };

  // ---- Open image preview modal ----
  const handleImageClick = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  // ================== Render ==================

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-[#F0F2FD] p-6">
          <div className="max-w-4xl mx-auto">

            {/* ---- Add / Edit Category Form ---- */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Category Management</h1>
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  {isEditMode ? 'Edit Category' : 'Add New Category'}
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                  />

                  {/* Subcategory fields */}
                  <div className="space-y-2">
                    {subcats.map((subcat, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={subcat.name}
                          placeholder="Enter subcategory name"
                          onChange={(e) => updateSubcat(index, { name: e.target.value })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6362E7] focus:border-transparent focus:outline-none"
                        />

                        {/* Hidden file input */}
                        <input
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={(e) => handleFileChange(index, e)}
                          id={`subcat-file-${index}`}
                        />
                        <label
                          htmlFor={`subcat-file-${index}`}
                          className='flex p-x-2 items-center justify-center w-28 h-14 bg-slate-100 text-black rounded-lg cursor-pointer hover:bg-slate-200 hover:-translate-y-1 transition-all duration-300 ease-in-out'
                        >
                          {isEditMode ? "Edit Image" : "Upload Image"}
                        </label>

                        {/* Upload status & preview — derived from imageUrl, no extra boolean needed */}
                        {subcat.previewUrl ? (
                          <>
                            <span className='text-green-500 text-center'>Uploaded</span>
                            <img
                              src={subcat.previewUrl || subcat.imageUrl}
                              alt=''
                              className='w-32 h-20 rounded-lg cursor-pointer'
                              onClick={() => handleImageClick(subcat.previewUrl || subcat.imageUrl!)}
                            />
                          </>
                        ) : (
                          <span className='text-red-500 text-center'>Not Uploaded</span>
                        )}

                        {/* Add a button to remove the subcategory field */}
                        {index === subcats.length - 1 ? (
                          <button
                            onClick={addSubcatField}
                            className="p-2 text-[#6362E7] hover:bg-gray-100 rounded-lg focus:outline-none"
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => removeSubcatField(index)}
                            className="p-2 text-red-500 hover:bg-gray-100 rounded-lg focus:outline-none"
                          >
                            {isEditMode ? '' : <X size={20} />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSubmitCategory}
                    className="w-full px-6 py-2 bg-[#6362E7] text-white rounded-lg hover:bg-[#5251c7] focus:outline-none focus:ring-2 focus:ring-[#6362E7] focus:ring-opacity-50"
                  >
                    {isEditMode ? "Update Category" : "Add Category"}
                  </button>
                </div>
              </div>
            </div>

            {/* ---- Categories List ---- */}
            <div className='flex flex-col mb-8 mt-8 bg-white rounded-xl shadow-lg p-3'>
              <h1 className='text-2xl text-center font-bold text-gray-800 mb-6'>All Categories</h1>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-gray-500 py-8">Loading categories...</div>
                ) : categories && categories.length > 0 ? (
                  categories.filter((cat : any)=> cat?.category_id !== null).map((category: any) => (
                    <div key={category.category_id.toString()} className="border border-gray-100 rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-medium ml-2 text-gray-800">Category : {category.category_name}</h3>
                        <div className='flex items-center'>
                          <button
                            onClick={() => handleDeleteCategory(category.category_id.toString(), null, true)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-colors"
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Delete Category</span>
                          </button>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            onClick={() => handleEditCategory(category.category_id.toString())}
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      <div className="space-y-2">
                        {category.subcategories?.map((subcategory: any, subIndex: number) => (
                          <div key={subIndex} className="flex justify-between items-center pl-4 py-2 hover:bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-600">{subIndex + 1}.</span>
                              <span className="text-gray-600">{subcategory.subcategory_name}</span>
                              {subcategory.image_url && (
                                <img
                                  src={subcategory.image_url}
                                  alt=''
                                  className='w-12 h-8 rounded-lg cursor-pointer'
                                  onClick={() => handleImageClick(subcategory.image_url)}
                                />
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              {/* Delete subcategory */}
                              <button
                                className="flex items-center space-x-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg focus:outline-none transition-colors"
                                title="Delete subcategory"
                                onClick={() => handleDeleteCategory(null, subcategory.subcategory_id?.toString(), false)}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">No categories available</div>
                )}
              </div>
            </div>

            {/* Image Preview Modal */}
            {previewOpen && previewUrl && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-10" onClick={() => setPreviewOpen(false)}></div>
                <div className="absolute w-1/2 h-96 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                  <img src={previewUrl} className="w-full h-full object-contain p-4 z-20" alt='' />
                  <button
                    className="absolute bg-red-400 rounded-full p-1 -top-2 -right-2 hover:bg-red-600"
                    onClick={() => setPreviewOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
