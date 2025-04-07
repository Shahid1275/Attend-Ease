"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProvinceCities } from "../../../utils/api";
import { ProvinceWithCities } from "../../../types/province";

const ProvinceCitiesPage = () => {
  const { id } = useParams();
  const [province, setProvince] = useState<ProvinceWithCities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinceCities = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch province cities with the token
        const data = await getProvinceCities(Number(id), token);
        setProvince(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProvinceCities();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!province) return <div>Province not found</div>;

  return (
    <div>
      <h1>{province.name}</h1>
      <h2>Cities</h2>
      <ul>
        {province.cities.map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProvinceCitiesPage;