import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/spotify/profile", { credentials: "include" });
        if (!response.ok) {
          throw new Error("Not logged in");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Not logged in");
      }
    };

    getProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          { error ? (
            <p>{error}</p>
          ) : profile ? (
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 