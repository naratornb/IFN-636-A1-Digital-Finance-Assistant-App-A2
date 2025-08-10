import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ReportList = ({ reports, setReports, setEditingReport }) => {
  const { user } = useAuth();

  const handleDelete = async (reportId) => {
    try {
      await axiosInstance.delete(`/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReports(reports.filter((report) => report._id !== reportId));
    } catch (error) {
      alert('Failed to delete report.');
    }
  };

  return (
    <div>
      {reports.map((report) => (
        <div key={report._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold"> {report.title}</h2>
          <p>{report.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(report.reportdate).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingReport(report)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(report._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
