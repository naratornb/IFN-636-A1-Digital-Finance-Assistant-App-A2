import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get('/api/reports', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReports(response.data);
      } catch (error) {
        alert('Failed to fetch reports.');
      }
    };

    fetchReports();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <ReportForm
        reports={reports}
        setReports={setReports}
        editingReport={editingReport}
        setEditingReport={setEditingReport}
      />
      <ReportList reports={reports} setReports={setReports} setEditingReport={setEditingReport} />
    </div>
  );
};

export default Reports;
