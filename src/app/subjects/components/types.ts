// Types cho react-select
export interface OptionType {
  value: string;
  label: string;
}

// Types cho subject
export interface SubjectData {
  ma_mh: string;
  ten_mh: string;
  so_tin_chi: number;
  ma_chuyen_nganh: string;
  loai: string;
  ten_chuyen_nganh?: string;
  ten_khoa?: string;
}

export interface MajorData {
  ma_chuyen_nganh: string;
  ten_chuyen_nganh: string;
  ten_khoa: string;
}

// Custom styles cho react-select
export const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "40px",
    borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
    borderRadius: "6px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(37, 99, 235, 0.1)" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    border: "1px solid #e2e8f0",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#334155",
    fontSize: "14px",
    fontWeight: "500",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#64748b",
    borderRadius: "0 4px 4px 0",
    "&:hover": {
      backgroundColor: "#ef4444",
      color: "white",
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#f1f5f9"
      : "white",
    color: state.isSelected ? "white" : "#334155",
    fontSize: "14px",
    "&:hover": {
      backgroundColor: state.isSelected ? "#2563eb" : "#f1f5f9",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "14px",
  }),
  noOptionsMessage: (base: any) => ({
    ...base,
    color: "#6b7280",
    fontSize: "14px",
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 10000,
    position: "absolute",
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: "200px",
  }),
};
