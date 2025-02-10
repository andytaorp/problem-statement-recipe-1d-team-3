import { useState } from "react";

function FoodAnalyzer() {
  const [image, setImage] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/foodAnalysis/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to analyze image.");

      setFoodData(data.foodItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-analyzer">
      <h2>Analyze Your Dish</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {error && <p className="error">{error}</p>}

      {foodData && (
        <div className="results">
          <h3>Detected Food Items</h3>
          <ul>
            {foodData.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> - {item.calories} kcal
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FoodAnalyzer;
