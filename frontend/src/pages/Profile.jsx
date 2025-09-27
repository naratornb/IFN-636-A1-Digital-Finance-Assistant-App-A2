import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setFormData({
          name: data.name ?? '',
          email: data.email ?? '',
          university: data.university ?? '',
          address: data.address ?? '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.token) return;

    setIsSaving(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4d4d4d] flex items-center justify-center">
        <p className="uppercase tracking-[0.4em] text-sm text-[#4b4b4b]">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4d4d4d] text-white flex flex-col">
      <div className="flex-1 flex items-start justify-center px-6 py-6">                
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl px-16 py-14"        >
          <h1 className="text-3xl font-light uppercase tracking-[0.6em] text-center text-[#f2f2f2] mb-8">            
            PROFILE INFO
          </h1>

          <div className="space-y-10">
            <div className="flex flex-col w-full">
              <label className="uppercase tracking-[0.35em] text-sm font-medium text-[#d7d7d7]">
                Username
              </label>              
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                className="bg-transparent border-b border-[#8d8d8d] text-white text-base tracking-[0.1em] pb-2 focus:outline-none focus:border-[#f5c400] placeholder:text-[#bdbdbd]"
                placeholder="Username"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="uppercase tracking-[0.35em] text-sm font-medium text-[#d7d7d7]">
                Email address
              </label>              
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="bg-transparent border-b border-[#8d8d8d] text-white text-base tracking-[0.1em] pb-2 focus:outline-none focus:border-[#f5c400] placeholder:text-[#bdbdbd]"
                placeholder="Email address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              <div className="flex flex-col w-full">
                <label className="uppercase tracking-[0.35em] text-sm font-medium text-[#d7d7d7]">
                  University
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={handleChange('university')}
                  className="bg-transparent border-b border-[#8d8d8d] text-white text-base tracking-[0.1em] pb-2 focus:outline-none focus:border-[#f5c400] placeholder:text-[#bdbdbd]"
                  placeholder="University"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="uppercase tracking-[0.35em] text-sm font-medium text-[#d7d7d7]">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleChange('address')}
                  className="bg-transparent border-b border-[#8d8d8d] text-white text-base tracking-[0.1em] pb-2 focus:outline-none focus:border-[#f5c400] placeholder:text-[#bdbdbd]"
                  placeholder="Address"
                />
              </div>
            </div>          
          </div>

          <div className="mt-16 flex justify-center">
            <button
              type="submit"
              disabled={isSaving}
              className="uppercase tracking-[0.4em] text-sm font-semibold bg-[#f5c400] text-[#2f2f2f] px-20 py-3 shadow-[0_14px_28px_rgba(245,196,0,0.35)] transition-colors duration-200 hover:bg-[#ffd200] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
