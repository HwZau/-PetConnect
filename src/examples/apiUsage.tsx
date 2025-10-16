// Example React components using API hooks

import React, { useState } from "react";
import { apiClient } from "../services/apiClient";
import { useApi, useFileUpload } from "../hooks";
import { API_ENDPOINTS } from "../config/api";
import type { UserProfile, Pet } from "../services/exampleServices";

// ==================== React Component Examples ====================

// 1. Using useApi hook in React components
function UserProfileComponent() {
  // Auto-fetch profile on mount
  const {
    data: profile,
    loading,
    error,
    refetch,
  } = useApi<UserProfile>(API_ENDPOINTS.USERS.PROFILE, { immediate: true });

  // Update profile function
  const { execute: updateProfile, loading: updating } = useApi<UserProfile>(
    API_ENDPOINTS.USERS.UPDATE
  );

  const handleUpdateProfile = async (userData: Partial<UserProfile>) => {
    const result = await updateProfile("PUT", userData);
    if (result.success) {
      refetch(); // Refresh profile data
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <button
        onClick={() => handleUpdateProfile({ name: "New Name" })}
        disabled={updating}
      >
        {updating ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
}

// 2. Using useFileUpload hook
function AvatarUpload() {
  const { upload, loading, progress, error } = useFileUpload<{ url: string }>(
    API_ENDPOINTS.UPLOAD.AVATAR
  );

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await upload(file, { userId: "123" });
      if (result.success) {
        console.log("Upload successful:", result.data);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileSelect}
        accept="image/*"
        disabled={loading}
      />
      {loading && (
        <div>
          <p>Uploading... {progress}%</p>
          <progress value={progress} max={100} />
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

// 3. Using with search parameters
function PetList() {
  const { data: pets, loading, get } = useApi<Pet[]>(API_ENDPOINTS.PETS.LIST);

  const searchPets = (filters: Record<string, string>) => {
    get(filters); // Pass filters as query parameters
  };

  return (
    <div>
      <button onClick={() => searchPets({ category: "dog" })}>
        Search Dogs
      </button>
      <button onClick={() => searchPets({ age: "young" })}>
        Search Young Pets
      </button>

      {loading && <div>Loading...</div>}
      {pets?.map((pet) => (
        <div key={pet.id}>{pet.name}</div>
      ))}
    </div>
  );
}

// 4. Cancel requests example
function CancelableRequest() {
  const { loading, execute } = useApi<unknown>("/api/long-request");

  const cancelTokenSource = apiClient.createCancelToken();

  const startRequest = () => {
    execute("GET", undefined, undefined);
  };

  const cancelRequest = () => {
    cancelTokenSource.cancel("User canceled request");
  };

  return (
    <div>
      <button onClick={startRequest} disabled={loading}>
        Start Request
      </button>
      <button onClick={cancelRequest} disabled={!loading}>
        Cancel Request
      </button>
    </div>
  );
}

// 5. Multiple file upload example
function MultipleFileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleMultipleUpload = async () => {
    setUploading(true);
    try {
      const result = await apiClient.uploadMultipleFiles(
        API_ENDPOINTS.UPLOAD.MULTIPLE,
        files,
        { category: "pet-photos" },
        (progress) => {
          console.log("Upload progress:", progress);
        }
      );

      if (result.success) {
        console.log("All files uploaded:", result.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
      />
      <button onClick={handleMultipleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
}

// Export components for use
export {
  UserProfileComponent,
  AvatarUpload,
  PetList,
  CancelableRequest,
  MultipleFileUpload,
};
