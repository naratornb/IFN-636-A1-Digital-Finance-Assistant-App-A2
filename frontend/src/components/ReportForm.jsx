import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ReportForm = ({ reports, setReports, editingReport, setEditingReport }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', reportdate: '' });

  useEffect(() => {
    if (editingReport) {
      setFormData({
        title: editingReport.title,
        description: editingReport.description,
        reportdate: editingReport.reportdate,
      });
    } else {
      setFormData({ title: '', description: '', reportdate: '' });
    }
  }, [editingReport]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReport) {
        const response = await axiosInstance.put(`/api/reports/${editingReport._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReports(reports.map((report) => (report._id === response.data._id ? response.data : report)));
      } else {
        const response = await axiosInstance.post('/api/reports', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReports([...reports, response.data]);
      }
      setEditingReport(null);
      setFormData({ title: '', description: '', reportdate: '' });
    } catch (error) {
      alert('Failed to save report.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingReport ? 'Edit Financial Report' : 'Add Financial Report'}</h1>
      <input
        type="text"
        placeholder="Report Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Report Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 py-10 px-2 border rounded"
        
      />
      <input
        type="date"
        value={formData.reportdate}
        onChange={(e) => setFormData({ ...formData, reportdate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingReport ? 'Update Report' : 'Add Report'}
      </button>
    </form>
  );
};

export default ReportForm;
