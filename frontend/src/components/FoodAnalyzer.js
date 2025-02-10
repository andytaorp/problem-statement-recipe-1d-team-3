import { useState } from "react";

function FoodAnalyzer() {
  const [image, setImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_USER_TOKEN = "1629ac1e19db2585a06365d8ddf2f3d6540913e7";

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const analyzeFood = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setNutritionData(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("https://api.logmeal.com/v2/image/segmentation/complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${API_USER_TOKEN}` },
        body: formData,
      });

      const result = await response.json();
      if (!result.imageId) {
        throw new Error("Failed to analyze the image.");
      }

      const nutritionResponse = await fetch("https://api.logmeal.com/v2/recipe/nutritionalInfo", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_USER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId: result.imageId }),
      });

      const nutritionResult = await nutritionResponse.json();

      const uniqueFoods = [...new Set(nutritionResult.foodName?.map(item => item.toLowerCase()))];

      setNutritionData({
        ...nutritionResult,
        foodName: uniqueFoods.map(item => item.charAt(0).toUpperCase() + item.slice(1)), // Capitalize first letter
      });
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-analyzer">
      <h2>Food Analyzer</h2>
      
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={analyzeFood} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Food"}
      </button>

      {/* Display Nutritional Information */}
      {nutritionData && (
        <div className="nutrition-info">
          <h3>Nutrition Information</h3>
          <p><strong>Calories:</strong> {nutritionData.nutritional_info?.calories || "N/A"} kcal</p>
          <p><strong>Serving Size:</strong> {nutritionData.nutritional_info?.serving_size || "N/A"} g</p>

          <h4>Detected Food Items:</h4>
          <ul>
            {nutritionData.foodName?.length > 0 ? (
              nutritionData.foodName.map((food, index) => (
                <li key={index}>{food}</li>
              ))
            ) : (
              <p>No food items detected.</p>
            )}
          </ul>

          <h4>Daily Intake Reference:</h4>
          <ul>
            {nutritionData.nutritional_info?.dailyIntakeReference
              ? Object.entries(nutritionData.nutritional_info.dailyIntakeReference).map(([key, value]) => (
                  <li key={key}>
                    <strong>{value.label}:</strong> {value.percent.toFixed(2)}% ({value.level})
                  </li>
                ))
              : <p>No daily intake data available.</p>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FoodAnalyzer;
