import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { StarDisplay } from '../components/StarRating';
import { Modal } from '../components/Modal';
import { reviews, pies } from '../utils/api';

export function Leaderboard({ user, onLogout }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPie, setSelectedPie] = useState(null);
  const [editPieName, setEditPieName] = useState('');
  const [editPieImageUrl, setEditPieImageUrl] = useState('');
  const [editPiePrice, setEditPiePrice] = useState('');

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await reviews.getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const openEditModal = (pie) => {
    setSelectedPie(pie);
    setEditPieName(pie.name);
    setEditPieImageUrl(pie.image_url || '');
    setEditPiePrice(pie.price || '');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedPie(null);
    setEditPieName('');
    setEditPieImageUrl('');
    setEditPiePrice('');
  };

  const handleEditPie = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editPieName.trim()) {
      setError('Pie name is required');
      return;
    }

    const price = editPiePrice ? parseFloat(editPiePrice) : null;

    try {
      await pies.update(selectedPie.id, editPieName.trim(), editPieImageUrl.trim() || null, price);
      setSuccess('Pie updated successfully!');
      closeEditModal();
      loadLeaderboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePie = async (pieId, pieName) => {
    if (!confirm(`Are you sure you want to delete "${pieName}"? This will also delete all reviews for this pie.`)) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await pies.delete(pieId);
      setSuccess('Pie deleted successfully!');
      loadLeaderboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header user={user} onLogout={onLogout} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🏆 Mince Pie Leaderboard
          </h1>
          <button
            onClick={loadLeaderboard}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {loading && leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🥧</div>
            <p className="text-gray-600 dark:text-gray-400">Loading pies...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">🥧</div>
            <p className="text-gray-600 dark:text-gray-400">
              No pies have been added yet!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Pie Name</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Reviews</th>
                  <th className="px-4 py-3 text-left">Filling</th>
                  <th className="px-4 py-3 text-left">Pastry</th>
                  <th className="px-4 py-3 text-left">Appearance</th>
                  <th className="px-4 py-3 text-left">Overall</th>
                  <th className="px-4 py-3 text-left">Value</th>
                  {user?.isAdmin && <th className="px-4 py-3 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((pie, index) => (
                  <tr key={pie.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4 font-bold text-primary">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-4">
                      {pie.image_url ? (
                        <div className="relative w-16 h-16">
                          <img
                            src={pie.image_url}
                            alt={pie.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div
                            className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl absolute top-0 left-0"
                            style={{ display: 'none' }}
                          >
                            🥧
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                          🥧
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                      {pie.name}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      {pie.price ? `£${pie.price.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      {pie.review_count || 0}
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={pie.avg_filling} />
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={pie.avg_pastry} />
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={pie.avg_appearance} />
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={pie.avg_overall} />
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay value={pie.avg_value_for_money} />
                    </td>
                    {user?.isAdmin && (
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(pie)}
                            className="px-3 py-1 bg-christmas-gold text-gray-900 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePie(pie.id, pie.name)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="mt-8 card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Individual Reviews
            </h2>
            <div className="space-y-6">
              {leaderboard.map((pie) => (
                <div key={pie.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                    {pie.name}
                  </h3>
                  {pie.reviews && pie.reviews.length > 0 ? (
                    <div className="space-y-2">
                      {pie.reviews.map((review) => (
                        <div key={review.id} className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300 w-32">
                            {review.username}:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            F:{review.filling_score} P:{review.pastry_score} A:{review.appearance_score} O:{review.overall_score}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      No reviews yet
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        title={`Edit Pie: ${selectedPie?.name}`}
      >
        <form onSubmit={handleEditPie} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pie Name *
            </label>
            <input
              type="text"
              value={editPieName}
              onChange={(e) => setEditPieName(e.target.value)}
              placeholder="Enter pie name..."
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={editPieImageUrl}
              onChange={(e) => setEditPieImageUrl(e.target.value)}
              placeholder="https://example.com/pie-image.jpg"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (£) (optional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editPiePrice}
              onChange={(e) => setEditPiePrice(e.target.value)}
              placeholder="2.50"
              className="input"
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary flex-1">
              Save Changes
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
