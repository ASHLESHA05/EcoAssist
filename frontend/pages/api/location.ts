export default async function handler(req: any, res: any) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress || '8.8.8.8'; // Fallback IP
  
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/json?token=89561a80c64198`);
      const data = await response.json();
  
      if (data.error) {
        return res.status(500).json({ error: data.error });
      }
  
      res.status(200).json({
        city: data.city,
        region: data.region,
        country: data.country,
        coordinates: data.loc,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch location' });
    }
  }
  