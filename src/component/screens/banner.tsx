import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Navbar from '../navbar/navbar';
import { Star } from 'lucide-react';
import { useEffect } from 'react';
import { api } from '../../api';
// Removed Toggle import - no longer using top/bottom toggle
// import Toggle from 'react-toggle';
// import 'react-toggle/style.css'; // default styles


const BannerCategory: React.FC = () => {
  // Removed top/bottom toggle - now only single banner type
  // const [isChecked, setIsChecked] = useState(false);

  const [banner, setBanner] = useState<{
    imageUrl: string | null;
    link?: string;
  }>({
    imageUrl: null,
    link: ''
  });


  const [bannerList, setBannerList] = useState<any[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, file: File) => {
    try {
      console.log("file", file);
      if (file) {
        const formData = new FormData();
        formData.append('image', file);

        const { data } : any = await api.post('/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("data", data);
        setBanner(prev => ({
          ...prev,
          imageUrl: data.imageUrl ? data.imageUrl : null
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setBanner(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    getBanners();
  }, []);

  const handleUploadBanners = async () => {
    try {
      const bannerData = {
        link: banner.link,
        imageUrl: banner.imageUrl
      };
      
      const response: any = await api.post('/add-banner', { data : bannerData });
      console.log("response", response);  
      if (response.status === 200 || response.status === 201) {
        alert("Banner added successfully");
        setBanner({ imageUrl: null, link: '' });
        await getBanners(); // Refresh banner list after adding
        console.log("banners", banner);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getBanners = async () => {
    try {
      // Removed position parameter - now fetching all banners without position distinction
      const response: any = await api.get('/get-all-banner');
      if (response.status === 200) {
        console.log("response.data.data", response.data.data)
        console.log("response.data", response.data.data);
        setBannerList(response.data.data);
        console.log("response.data.data", response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const markBanner = async (id: string, isMain: number) => {
    try {
      console.log("id", id);
      const response: any = await api.post('/mark-banner', { bannerId: id, isMain});
      if (response.status === 200 || response.status === 201) {
        isMain ? alert("Banner marked successfully") : alert("Banner unmarked successfully");
        await getBanners();
      }else{
        alert("Failed to mark banner, may be another banner is already marked as main");
      }
    } catch (error) {
      alert("Failed to mark banner, may be another banner is already marked as main");
      console.error("Error marking banner:", error);
    }
  }
  return (
    <div className="flex h-screen w-full bg-[#FFFFFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto h-full w-full">
        <Navbar />
        <div className="p-10 space-y-8">
          {/* Single banner upload - no array needed */}
          <div className="flex flex-col gap-4">
            <div className='flex relative gap-4'>
              <label htmlFor="banner-upload" className="border border-gray-300 rounded p-4 w-fit cursor-pointer">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt="Banner preview"
                    className={`max-w-xs max-h-40 rounded object-contain`}
                  />
                ) : (
                  <span className="text-sm text-gray-700">Upload banner</span>
                )}
              </label>
            </div>

            <input
              type="file"
              id="banner-upload"
              accept="image/*"
              onChange={(e) => handleFileChange(e, e.target.files?.[0] as File)}
              className="hidden"
            />
            <input
              type="text"
              placeholder="Enter the link.."
              value={banner.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
            />
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => handleUploadBanners()}
              className="bg-blue-500 w-full mb-10 text-white px-4 py-2 rounded-xl hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
            >
              Upload Banner
            </button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6 m-4 mb-8'>
          {bannerList.map((bannerItem: any) => (
            <div 
              key={bannerItem._id} 
              className="relative flex flex-col gap-4 p-4 border rounded-xl shadow-md bg-white cursor-pointer hover:shadow-lg transition"
              onClick={() => markBanner(bannerItem.id?.toString(), bannerItem.is_main ? 0 : 1)}
            >
              {/* Star icon */}
              <div className="absolute top-2 right-2">
                <Star 
                  size={24} 
                  className={`${bannerItem.is_main ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              </div>

              {/* Image Section */}
              <div className='flex items-center gap-4 mt-6'>
                <img
                  src={bannerItem.image_url}
                  className="w-full h-40 rounded-lg object-cover"
                  alt='banner'
                />
              </div>

              {/* Banner Info */}
              <div className='flex flex-col gap-2'>
                <div className="text-sm text-blue-600 break-all">
                  {bannerItem.link ? (
                    <a href={bannerItem.link} target="_blank" rel="noopener noreferrer">
                      {bannerItem.link}
                    </a>
                  ) : (
                    'No Link'
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )

};

export default BannerCategory;
