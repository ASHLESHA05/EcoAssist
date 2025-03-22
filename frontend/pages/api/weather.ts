export default async function handler(req:any, res:any) {
    const { city, state } = req.query;
    const apiKey = "5a41d643613d3cf0275678e38786a5da";
  
    try {
      // Step 1: Get City Coordinates
      const geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},IN&limit=1&appid=${apiKey}`
      );
      const geoData = await geoResponse.json();
  
      if (!geoData.length) {
        return res.status(404).json({ error: 'Location not found' });
      }
      const { lat, lon } = geoData[0];
  
      // Step 2: Get Weather Details
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherResponse.json();
  
      // Step 3: Get Air Quality Details
      const airQualityResponse = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const airQualityData = await airQualityResponse.json();
  
      const uvIndexResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      const uvIndexData = await uvIndexResponse.json();
  
      res.status(200).json({
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        airQuality: airQualityData.list[0].main.aqi,
        uvIndex: uvIndexData.value,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }
  