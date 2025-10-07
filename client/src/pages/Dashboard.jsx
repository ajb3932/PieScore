import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';
import { pies, reviews } from '../utils/api';

export function Dashboard({ user, onLogout }) {
  const [allPies, setAllPies] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [newPieName, setNewPieName] = useState('');
  const [newPieImageUrl, setNewPieImageUrl] = useState('');
  const [newPiePrice, setNewPiePrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('add');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedPie, setSelectedPie] = useState(null);
  const [fillingScore, setFillingScore] = useState(0);
  const [pastryScore, setPastryScore] = useState(0);
  const [appearanceScore, setAppearanceScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [valueForMoneyScore, setValueForMoneyScore] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const [piesData, reviewsData] = await Promise.all([
        pies.getAll(),
        reviews.getMyReviews(),
      ]);
      setAllPies(piesData);
      setMyReviews(reviewsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPie = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPieName.trim()) {
      setError('Pie name is required');
      return;
    }

    const price = newPiePrice ? parseFloat(newPiePrice) : null;

    try {
      await pies.create(newPieName.trim(), newPieImageUrl.trim() || null, price);
      setSuccess('Pie added successfully!');
      setNewPieName('');
      setNewPieImageUrl('');
      setNewPiePrice('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const openReviewModal = (pie) => {
    setSelectedPie(pie);
    setFillingScore(0);
    setPastryScore(0);
    setAppearanceScore(0);
    setOverallScore(0);
    setValueForMoneyScore(0);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedPie(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');

    if (!fillingScore || !pastryScore || !appearanceScore || !overallScore || !valueForMoneyScore) {
      setError('All ratings are required');
      return;
    }

    try {
      await reviews.create(
        selectedPie.id,
        fillingScore,
        pastryScore,
        appearanceScore,
        overallScore,
        valueForMoneyScore
      );
      setSuccess('Review submitted successfully!');
      closeReviewModal();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const hasReviewed = (pieId) => {
    return myReviews.some((review) => review.pie_id === pieId);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header user={user} onLogout={onLogout} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

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

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('add')}
            className={`btn ${
              activeTab === 'add' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Add New Pie
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`btn ${
              activeTab === 'review' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Review Pies
          </button>
        </div>

        {activeTab === 'add' && (
          <div className="card animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Add New Pie
            </h2>
            <form onSubmit={handleAddPie} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pie Name *
                </label>
                <input
                  type="text"
                  value={newPieName}
                  onChange={(e) => setNewPieName(e.target.value)}
                  placeholder="Enter pie name..."
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newPieImageUrl}
                  onChange={(e) => setNewPieImageUrl(e.target.value)}
                  placeholder="https://example.com/pie-image.jpg"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price per Pie (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPiePrice}
                  onChange={(e) => setNewPiePrice(e.target.value)}
                  placeholder="2.50"
                  className="input"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Add Pie
              </button>
            </form>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="card animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Review Pies
            </h2>

            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading pies...</p>
            ) : allPies.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No pies available. Add a pie first!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPies.map((pie) => {
                  const reviewed = hasReviewed(pie.id);
                  return (
                    <div
                      key={pie.id}
                      className={`p-4 border rounded-lg transition-all ${
                        reviewed
                          ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
                          : 'bg-white dark:bg-gray-800 border-primary hover:shadow-lg cursor-pointer'
                      }`}
                      onClick={() => !reviewed && openReviewModal(pie)}
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {pie.name}
                      </h3>
                      {reviewed ? (
                        <span className="text-sm text-green-600 dark:text-green-400">
                          ✓ Already reviewed
                        </span>
                      ) : (
                        <span className="text-sm text-primary">
                          Click to review →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={reviewModalOpen}
        onClose={closeReviewModal}
        title={`Review: ${selectedPie?.name}`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filling
            </label>
            <StarRating value={fillingScore} onChange={setFillingScore} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pastry
            </label>
            <StarRating value={pastryScore} onChange={setPastryScore} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Appearance
            </label>
            <StarRating value={appearanceScore} onChange={setAppearanceScore} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overall Rating
            </label>
            <StarRating value={overallScore} onChange={setOverallScore} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value for Money
            </label>
            <StarRating value={valueForMoneyScore} onChange={setValueForMoneyScore} />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary flex-1">
              Submit Review
            </button>
            <button
              type="button"
              onClick={closeReviewModal}
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
