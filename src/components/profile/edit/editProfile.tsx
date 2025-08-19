import { Edit, Save, X, Star, Sparkles, CheckCircle } from "lucide-react";
import FloatingLabel from "../../common/floatingLabel";
import { useEffect, useState, useMemo } from "react";
import { IUser } from "../../../types";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
import { motion } from "framer-motion";
import {
  updateUserData,
  fetchUserData,
  userLogout,
} from "../../../features/user/userThunk";
import { getCountries, Country } from "../../../services/countryData";
import Select from "react-select";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};

const floatingVariants = {
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface EditProfileProps {
  setActiveTab: React.Dispatch<
    React.SetStateAction<"profile" | "blogs" | "edit" | "password">
  >;
  success: () => void;
}

const EditProfile = ({ setActiveTab, success }: EditProfileProps) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[] | null>(null);

  const [profile, setProfile] = useState<Partial<IUser>>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    about: user?.about ?? "",
    country: user?.country ?? "",
    isGoogleUser: user?.isGoogleUser ?? false,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();
        setCountries(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        about: user.about ?? "",
        country: user.country ?? "",
        isGoogleUser: user.isGoogleUser ?? false,
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!profile.firstName) {
      newErrors.push("First name is required");
    }

    if (!profile.lastName) {
      newErrors.push("Last name is required");
    }

    if (!profile.email) {
      newErrors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.push("Invalid email format");
    }

    if (!profile.country) {
      newErrors.push("Country is required");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleInputChange =
    (field: keyof IUser) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setProfile((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setErrors([]);
      setSuccessMessage("");
    };

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      await dispatch(updateUserData({ user: profile })).unwrap();
      await dispatch(fetchUserData()).unwrap();
      setSuccessMessage(
        "Profile updated successfully! Your changes have been saved."
      );
      success();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to update profile";
      setErrors([errorMessage]);
      if (error === "Token expired" || error === "Unauthorized") {
        dispatch(userLogout());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const countryOptions = useMemo(
    () =>
      countries?.map((country) => ({
        value: country.code,
        label: (
          <div className="flex items-center gap-2">
            <img
              src={country.flag}
              alt={`${country.name} flag`}
              className="w-5 h-5"
            />
            {country.name}
          </div>
        ),
      })) ?? [],
    [countries]
  );

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        variants={cardVariants}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-800 rounded-xl flex items-center justify-center shadow-lg"
          variants={floatingVariants}
          animate="float"
        >
          <Edit className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            Edit Profile
            <Sparkles className="w-6 h-6 text-gray-400" />
          </h1>
          <p className="text-gray-400">Update your cosmic identity</p>
        </div>
      </motion.div>

      {successMessage && (
        <motion.div
          className="bg-green-900/50 border border-green-500 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
            </motion.div>
            <span className="text-green-400 text-sm font-medium">Success!</span>
          </div>
          <p className="text-green-300 text-sm mt-1">{successMessage}</p>
        </motion.div>
      )}

      <motion.div
        className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-600 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
        variants={cardVariants}
        whileHover="hover"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-gray-600 to-gray-800"></div>

        <form>
          <div className="p-8">
            <div className="space-y-8">
              {errors.length > 0 && (
                <motion.div
                  className="bg-red-900/50 border border-red-500 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">
                      Please fix the following errors:
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div className="space-y-6" variants={cardVariants}>
                  <h3 className="text-gray-100 text-xl font-semibold border-b border-gray-600 pb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                    Personal Information
                  </h3>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FloatingLabel
                      label="First Name"
                      value={profile.firstName ?? ""}
                      onChange={handleInputChange("firstName")}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FloatingLabel
                      label="Last Name"
                      value={profile.lastName ?? ""}
                      onChange={handleInputChange("lastName")}
                    />
                  </motion.div>

                  {profile.isGoogleUser ? (
                    <motion.div
                      className="relative w-full bg-gray-900 border border-gray-600 rounded-lg p-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-gray-100 text-sm font-medium">
                          Google Account
                        </span>
                      </div>
                      <input
                        value={profile.email ?? ""}
                        type="email"
                        readOnly
                        className="w-full bg-transparent text-gray-400 text-sm border-none outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed for Google accounts
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FloatingLabel
                        label="Email Address"
                        type="email"
                        value={profile.email ?? ""}
                        onChange={handleInputChange("email")}
                      />
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <label
                      htmlFor="country"
                      className="text-gray-100 text-sm font-medium block mb-2"
                    >
                      Country
                    </label>
                    <Select
                      id="country"
                      options={countryOptions}
                      value={
                        countryOptions.find(
                          (option) => option.value === profile.country
                        ) ?? null
                      }
                      onChange={(option) => {
                        setProfile((prev) => ({
                          ...prev,
                          country: option?.value ?? "",
                        }));
                        setErrors([]);
                        setSuccessMessage("");
                      }}
                      placeholder="Select a country"
                      isLoading={countries === null}
                      isDisabled={countries === null}
                      className="text-gray-100"
                      menuPortalTarget={document.body}
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#1F2937",
                          borderColor: errors.includes("Country is required")
                            ? "#EF4444"
                            : "#4B5563",
                          borderRadius: "0.75rem",
                          padding: "0.5rem",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: errors.includes("Country is required")
                              ? "#EF4444"
                              : "#9CA3AF",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#1F2937",
                          borderRadius: "0.75rem",
                          marginTop: "0.25rem",
                          zIndex: 9999,
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#4B5563"
                            : state.isFocused
                            ? "#374151"
                            : "#1F2937",
                          color: "#F3F4F6",
                          padding: "0.75rem",
                          "&:hover": { backgroundColor: "#374151" },
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#F3F4F6",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9CA3AF",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#9CA3AF",
                          "&:hover": { color: "#F3F4F6" },
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      aria-label="Select your country"
                    />
                  </motion.div>
                </motion.div>

                <motion.div className="space-y-6" variants={cardVariants}>
                  <h3 className="text-gray-100 text-xl font-semibold border-b border-gray-600 pb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-gray-400" />
                    Additional Details
                  </h3>

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="text-gray-100 text-sm font-medium">
                      About Me
                    </label>
                    <textarea
                      value={profile.about ?? ""}
                      onChange={handleInputChange("about")}
                      className="w-full h-32 p-4 bg-gray-900 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-xl focus:border-gray-400 focus:outline-none resize-none transition-colors"
                      placeholder="Share your cosmic story..."
                    />
                  </motion.div>

                  {profile.isGoogleUser && (
                    <motion.div
                      className="bg-gradient-to-r from-green-900 to-blue-900 border border-gray-600 rounded-xl p-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-gray-100 text-sm font-medium">
                          Google Account
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">
                        This account is connected via Google Sign-In
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <motion.div
                className="flex justify-end gap-4 pt-6 border-t border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type="button"
                  className="px-8 py-3 text-gray-100 border-2 border-gray-500 rounded-xl hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("profile")}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className={`px-8 py-3 ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700"
                  } text-white rounded-xl transition-all duration-300 font-medium shadow-lg flex items-center gap-2`}
                  whileHover={!isLoading ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-600 rounded-xl p-6 mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        variants={cardVariants}
        whileHover="hover"
      >
        <h3 className="text-gray-100 text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gray-400" />
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <motion.div
            className="space-y-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-gray-400">Account Type:</span>
            <p className="text-gray-100 font-medium flex items-center gap-2">
              {profile.isGoogleUser ? (
                <>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Google Account
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Regular Account
                </>
              )}
            </p>
          </motion.div>
          <motion.div
            className="space-y-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-gray-400">Account Status:</span>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-gray-100 font-medium">Active</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProfile;
