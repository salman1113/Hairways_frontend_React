import React, { useState, useEffect } from 'react';
import { getServices, createService, deleteService, getCategories } from '../../services/api';
import { Trash2 } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', duration_minutes: '', description: '', image: null, category: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [srvData, catData] = await Promise.all([getServices(), getCategories()]);
    setServices(srvData);
    setCategories(catData);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.category) return alert("Select Category!");
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append('name', newService.name);
        formData.append('price', newService.price);
        formData.append('duration_minutes', newService.duration_minutes);
        formData.append('description', newService.description);
        formData.append('category', newService.category);
        formData.append('is_active', true);
        if (newService.image) formData.append('image', newService.image);

        await createService(formData);
        alert("Service Added!");
        setNewService({ name: '', price: '', duration_minutes: '', description: '', image: null, category: '' });
        fetchData();
    } catch (error) { alert("Failed to add service."); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
      if(window.confirm("Are you sure?")) {
          await deleteService(id);
          fetchData();
      }
  };

  return (
    <div>
        <h1 className="text-3xl font-serif font-bold text-[#3F0D12] mb-8">Service Menu</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-lg h-fit">
                <h3 className="font-bold text-lg mb-4 text-[#3F0D12]">Add New Service</h3>
                <form onSubmit={handleAddService} className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-3 border rounded-xl" required
                        value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                    <select className="w-full p-3 border rounded-xl bg-white" 
                        value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Price" className="w-full p-3 border rounded-xl" required
                            value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                        <input type="number" placeholder="Mins" className="w-full p-3 border rounded-xl" required
                            value={newService.duration_minutes} onChange={e => setNewService({...newService, duration_minutes: e.target.value})} />
                    </div>
                    <input type="file" onChange={e => setNewService({...newService, image: e.target.files[0]})} className="w-full text-sm"/>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-[#3F0D12] text-white rounded-xl font-bold">
                        {loading ? "Adding..." : "Add Service"}
                    </button>
                </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
                {services.map(srv => (
                    <div key={srv.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={srv.image || "https://via.placeholder.com/100"} className="w-16 h-16 rounded-xl object-cover bg-gray-100"/>
                            <div><h4 className="font-bold text-[#3F0D12]">{srv.name}</h4><p className="text-sm">₹{srv.price}</p></div>
                        </div>
                        <button onClick={() => handleDelete(srv.id)} className="text-[#D72638] bg-red-50 p-2 rounded-lg"><Trash2 size={20}/></button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
export default AdminServices;