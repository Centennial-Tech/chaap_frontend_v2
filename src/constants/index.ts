// Constants for the application
export const Config = {
  API: import.meta.env.VITE_API_URL,
};

export const productTypes = [
  { value: "drug", label: "Drug" },
  { value: "biologic", label: "Biologic" },
  { value: "medical device", label: "Medical Device" },
  { value: "combination product", label: "Combination Product" },
];
