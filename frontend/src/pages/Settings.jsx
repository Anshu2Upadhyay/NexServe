import {
  ArrowLeft,
  CheckCircle2,
  Crosshair,
  MapPin,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const TOKEN_STORAGE_KEY =
  "nexserve_token";

const Settings = () => {
  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  const role =
    user?.role === "worker"
      ? "worker"
      : "customer";

  const dashboardPath =
    role === "worker"
      ? "/worker/dashboard"
      : "/customer/dashboard";

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
  });

  const [location, setLocation] =
    useState({
      latitude: null,
      longitude: null,
    });

  const [saving, setSaving] =
    useState(false);

  const [locationSaving, setLocationSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!user) return;

    // User data is an external context source that must hydrate this editable form.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      area: user.area || "",
    });

    if (user.location) {
      setLocation({
        latitude:
          user.location.latitude ??
          null,
        longitude:
          user.location.longitude ??
          null,
      });
    }
  }, [user]);

  const getToken = () => {
    return localStorage.getItem(
      TOKEN_STORAGE_KEY
    );
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type":
        "application/json",
      ...(token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {}),
    };
  };

  const handleProfileChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const endpoint =
        role === "worker"
          ? `${API_BASE_URL}/workers/profile`
          : `${API_BASE_URL}/users/profile`;

      const response =
        await fetch(endpoint, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            name:
              profile.name.trim(),
            phone:
              profile.phone.trim(),
            city:
              profile.city.trim(),
            area:
              profile.area.trim(),
          }),
        });

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data?.message ||
            "Profile update failed."
        );
      }

      const updatedUser =
        data.user ||
        data.worker ||
        data.data;

      updateUser({
        ...(updatedUser || {}),
        name:
          updatedUser?.name ??
          profile.name.trim(),
        phone:
          updatedUser?.phone ??
          profile.phone.trim(),
        city:
          updatedUser?.city ??
          profile.city.trim(),
        area:
          updatedUser?.area ??
          profile.area.trim(),
        role:
          updatedUser?.role ||
          role,
      });

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile save error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const saveLocation = async (
    latitude,
    longitude
  ) => {
    const endpoint =
      role === "worker"
        ? `${API_BASE_URL}/workers/location`
        : `${API_BASE_URL}/users/location`;

    const response =
      await fetch(endpoint, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          latitude:
            Number(latitude),
          longitude:
            Number(longitude),
        }),
      });

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data?.message ||
          "Location update failed."
      );
    }

    const savedLocation =
      data.location ||
      data.user?.location ||
      data.worker?.location;

    const finalLocation = {
      latitude:
        savedLocation?.latitude ??
        Number(latitude),

      longitude:
        savedLocation?.longitude ??
        Number(longitude),
    };

    setLocation(finalLocation);

    updateUser({
      location: finalLocation,
    });

    return finalLocation;
  };

  const reverseGeocode = async (
    latitude,
    longitude
  ) => {
    try {
      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
            latitude
          )}&lon=${encodeURIComponent(
            longitude
          )}&zoom=18&addressdetails=1`,
          {
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      if (!response.ok) {
        return null;
      }

      const data =
        await response.json();

      const address =
        data?.address || {};

      const city =
        address.city ||
        address.town ||
        address.municipality ||
        address.county ||
        "";

      const area =
        address.suburb ||
        address.neighbourhood ||
        address.village ||
        "";

      return {
        city,
        area,
      };
    } catch (err) {
      console.warn(
        "Reverse geocoding failed:",
        err
      );

      return null;
    }
  };

  const updateCurrentLocation =
    useCallback(() => {
      setLocationSaving(true);
      setMessage("");
      setError("");

      if (!navigator.geolocation) {
        setError(
          "Geolocation is not supported by this browser."
        );

        setLocationSaving(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            await saveLocation(
              latitude,
              longitude
            );

            const locationData =
              await reverseGeocode(
                latitude,
                longitude
              );

            if (locationData) {
              const nextProfile = {
                ...profile,
                city:
                  locationData.city ||
                  profile.city,
                area:
                  locationData.area ||
                  profile.area,
              };

              setProfile(
                nextProfile
              );

              updateUser({
                city:
                  nextProfile.city,
                area:
                  nextProfile.area,
              });
            }

            setMessage(
              "Current location saved successfully."
            );
          } catch (err) {
            console.error(
              "GPS save error:",
              err
            );

            setError(
              err?.message ||
                "Unable to save current location."
            );
          } finally {
            setLocationSaving(false);
          }
        },
        (geoError) => {
          console.error(
            "Geolocation error:",
            geoError
          );

          let errorMessage =
            "Unable to get your location.";

          if (geoError.code === 1) {
            errorMessage =
              "Location permission denied. Please allow location access.";
          } else if (
            geoError.code === 2
          ) {
            errorMessage =
              "Location is currently unavailable.";
          } else if (
            geoError.code === 3
          ) {
            errorMessage =
              "Location request timed out. Please try again.";
          }

          setError(errorMessage);
          setLocationSaving(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }, [profile, updateUser]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        <Link
          to={dashboardPath}
          className="back-btn"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Settings
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
            }}
          >
            Manage your NexServe account
            and location.
          </p>
        </div>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "#e8f7ee",
            color: "#176b38",
          }}
        >
          <CheckCircle2
            size={16}
            style={{
              verticalAlign:
                "middle",
              marginRight: "7px",
            }}
          />

          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "#fdecec",
            color: "#b42318",
          }}
        >
          {error}
        </div>
      )}

      <section
        style={cardStyle}
      >
        <div
          style={sectionHeaderStyle}
        >
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              <UserRound
                size={19}
                style={{
                  verticalAlign:
                    "middle",
                  marginRight: "7px",
                }}
              />
              Profile
            </h2>

            <p
              style={{
                color: "#666",
              }}
            >
              Keep your account information
              up to date.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <Field
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              required
            />

            <Field
              label="Email"
              name="email"
              value={profile.email}
              disabled
            />

            <Field
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              required
            />

            <Field
              label="District / City"
              name="city"
              value={profile.city}
              onChange={handleProfileChange}
              required
            />

            <Field
              label="Area"
              name="area"
              value={profile.area}
              onChange={handleProfileChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={primaryButton}
          >
            <Save
              size={16}
              style={{
                verticalAlign:
                  "middle",
                marginRight: "6px",
              }}
            />

            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>
      </section>

      <section
        style={cardStyle}
      >
        <div
          style={sectionHeaderStyle}
        >
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              <MapPin
                size={19}
                style={{
                  verticalAlign:
                    "middle",
                  marginRight: "7px",
                }}
              />
              Location
            </h2>

            <p
              style={{
                color: "#666",
              }}
            >
              Your GPS location is used
              for nearby job matching.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={locationBoxStyle}>
            <strong>
              Latitude
            </strong>

            <div
              style={{
                marginTop: "6px",
              }}
            >
              {location.latitude !==
              null
                ? location.latitude
                : "Not set"}
            </div>
          </div>

          <div style={locationBoxStyle}>
            <strong>
              Longitude
            </strong>

            <div
              style={{
                marginTop: "6px",
              }}
            >
              {location.longitude !==
              null
                ? location.longitude
                : "Not set"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={
            updateCurrentLocation
          }
          disabled={locationSaving}
          style={primaryButton}
        >
          <Crosshair
            size={17}
            style={{
              verticalAlign:
                "middle",
              marginRight: "6px",
            }}
          />

          {locationSaving
            ? "Getting Location..."
            : "Use Current Location"}
        </button>
      </section>

      <section
        style={cardStyle}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          <ShieldCheck
            size={19}
            style={{
              verticalAlign:
                "middle",
              marginRight: "7px",
            }}
          />
          Account
        </h2>

        <p
          style={{
            color: "#666",
          }}
        >
          Logged in as{" "}
          <strong>
            {role}
          </strong>
        </p>

        <button
          type="button"
          onClick={
            handleLogout
          }
          style={dangerButton}
        >
          Logout
        </button>
      </section>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  required = false,
}) => {
  return (
    <div>
      <label>
        {label}
      </label>

      <input
        type={
          name === "email"
            ? "email"
            : "text"
        }
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{
          ...inputStyle,
          ...(disabled
            ? {
                background:
                  "#f5f5f5",
                cursor:
                  "not-allowed",
              }
            : {}),
        }}
      />
    </div>
  );
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: "12px",
  padding: "22px",
  marginBottom: "20px",
};

const sectionHeaderStyle = {
  marginBottom: "18px",
};

const locationBoxStyle = {
  padding: "14px",
  background: "#f8f8f8",
  borderRadius: "8px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  marginTop: "6px",
  padding: "11px 12px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  fontSize: "14px",
};

const primaryButton = {
  marginTop: "18px",
  padding: "11px 18px",
  border: "none",
  borderRadius: "7px",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};

const dangerButton = {
  padding: "11px 18px",
  border: "none",
  borderRadius: "7px",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};

export default Settings;