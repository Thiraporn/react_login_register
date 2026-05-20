import { useState } from "react";
import { CheckCircle, AlertCircle, Info, Search } from "lucide-react";

type InputProps = {
  label?: string;//   optional
  placeholdercode?: string;//   optional
  placeholderdesc?: string;//   optional
  name?: string;//   optional
  type?: React.HTMLInputTypeAttribute;//   optional
  placeholder?: string; //   optional
  className?: string; //   optional
  value?: string; //   optional 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;//   optional
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;//   optional
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;//   optional
  required?: boolean; //   optional
};
type SuggestionItem = {
  code: string;
  nameTH: string;
  nameEN?: string;
  dataObject?: object;
};
export const Input = ({ label, type = "text", placeholder, name, value, onChange, onFocus, onBlur, required }: InputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        className="border rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500  border-gray-300"
      />
    </div>
  )
};

/* =========================
   VALIDATED INPUT
========================= */
export const InputWithValidation = ({
  name,
  placeholder,
  value,
  onChange,
  validator,
  required,
  describedBy,
  errorMessage = "This is an error message.",
  disabled = false
}: {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validator: (val: string) => boolean;
  required?: boolean;
  describedBy?: string;
  errorMessage?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [focus, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = validator(value);
  // Determine when to show error/success states  cover by touched and value length to avoid showing validation on initial render
  const showError = touched && !isValid;//&& value.length > 0 
  const showSuccess = touched && isValid;//&& value.length > 0 
  const showIcon = touched;//&& value.length > 0
  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setFocus(false);
            setTouched(true);
          }}
          required={required}
          className={`
            w-full px-4 py-2 pr-10 border rounded-xl outline-none
            ${value.length === 0 ? "border-gray-300" : ""}
            ${showSuccess ? "border-green-500" : ""}
            ${showError ? "border-red-500" : ""}
            ${disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
              : "bg-white"}
          `}

          aria-describedby={describedBy}
          aria-invalid={!isValid}
          disabled={disabled}
        />
        {/* ICON */}
        {showIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (
              <AlertCircle className="text-red-500 w-5 h-5" />
            )}
          </span>
        )}

      </div>
      <p
        id={describedBy}
        className={
          showError
            ? "mt-2 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600"
            : "sr-only"
        } >
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>{errorMessage}</span>


      </p>
    </div>
  );
};

export const InputSearch = ({
  label = "Search",
  placeholder = "Search...",
  value,
  suggestions = [],
  onSelect,
  onBlurDesc,
  onChange,
  mode = "create"
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  suggestions?: SuggestionItem[];
  onSelect?: (item: SuggestionItem) => void;
  onBlurDesc?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode?: "create" | "edit";
}) => {
  return (
    <div className="space-y-2">

      {/* LABEL */}
      <label htmlFor="search-input" className="block text-sm font-medium text-gray-700"  >
        {label}
      </label>

      {/* SEARCH BOX */}
      <div className="relative">
        {/* ICON */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        {/* INPUT */}
        <input
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

            {suggestions.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => onSelect?.(item)}
                className="w-full border-b px-4 py-3 text-left transition hover:bg-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-800">
                  {item.code ?? "No code"}
                </div>

                <div className="text-xs text-gray-500">
                  {item.nameTH ?? item.nameEN ?? "Description not available"}
                </div>

              </button>
            ))}

          </div>
        )}

      </div>

      {/* MODE BADGE */}
      {/* <div className="flex items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2 py-1 font-medium ${mode === "edit"
            ? "bg-amber-100 text-amber-700"
            : "bg-emerald-100 text-emerald-700"
            }`}
        >
          {mode === "edit"
            ? "EDIT MODE"
            : "CREATE MODE"}
        </span>

      </div> */}

    </div>
  );
};

export const InputCombo = ({
  type = "text",
  codePlaceholder,
  descPlaceholder,
  namecode,
  namedesc,
  valuecode,
  valuedesc,
  onChangeCode,
  onChangeDesc,
  disabled,
  suggestions = [],
  onSelect,
  onBlurDesc
}: {
  type?: string;
  codePlaceholder?: string;
  descPlaceholder?: string;
  namecode?: string;
  namedesc?: string;
  valuecode?: string;
  valuedesc?: string;
  onChangeCode?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDesc?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  suggestions?: SuggestionItem[];

  onSelect?: (item: SuggestionItem) => void;
  onBlurDesc?: (e: React.ChangeEvent<HTMLInputElement>) => void;


}) => (
  <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4 relative">
    <input
      type={type}
      placeholder={codePlaceholder}
      name={namecode}
      value={valuecode}
      onChange={onChangeCode}
      className={`border rounded-xl px-4 py-2 w-full md:col-span-3  border-gray-300 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      disabled={disabled}
    />

    <input
      type={type}
      placeholder={descPlaceholder}
      name={namedesc}
      value={valuedesc}
      onChange={onChangeDesc}
      onBlur={onBlurDesc}
      className="border rounded-xl px-4 py-2 w-full md:col-span-9  border-gray-300"


    />

    {/* DROPDOWN */}
    {suggestions.length > 0 && (
      <div className="absolute  z-30 left-0 right-0 top-full bg-white border rounded-xl mt-1 max-h-60 overflow-y-auto shadow">


        {suggestions.map((item) => (
          <div
            key={item.code}
            onClick={() => onSelect?.(item)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium">{item.code}</div>
            <div className="text-xs text-gray-500">
              {item.nameTH ?? item.nameEN ?? "Description not available"}
            </div>
          </div>
        ))}

      </div>
    )}
  </div>
);
/* =========================
   VALIDATED INPUT
========================= */

// export const InputComboWithValidation = ({
//   type = "text",
//   codePlaceholder,
//   descPlaceholder,
//   namecode,
//   namedesc,
//   valuecode,
//   valuedesc,
//   onChangeCode,
//   onChangeDesc,
//   disabled,
//   suggestions = [],
//   onSelect,
//   validator
// }: {
//   type?: string;
//   codePlaceholder?: string;
//   descPlaceholder?: string;
//   namecode?: string;
//   namedesc?: string;
//   valuecode?: string;
//   valuedesc?: string;
//   onChangeCode?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onChangeDesc?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   disabled?: boolean;
//   className?: string;
//   suggestions?: SuggestionItem[];
//   onSelect?: (item: SuggestionItem) => void;
//   validator: (val: string) => boolean;

// }) => {
//   const [focus, setFocus] = useState(false);
//   const [touched, setTouched] = useState(false);

//   const isValid = validator(valuedesc);
//   // Determine when to show error/success states  cover by touched and value length to avoid showing validation on initial render
//   const showError = touched && !isValid;//&& value.length > 0 
//   const showSuccess = touched && isValid;//&& value.length > 0 
//   const showIcon = touched;//&& value.length > 0
//   return (
//     <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4 relative">
//       <input
//         type={type}
//         placeholder={codePlaceholder}
//         name={namecode}
//         value={valuecode}
//         onChange={onChangeCode}
//         className={`border rounded-xl px-4 py-2 w-full md:col-span-3  border-gray-300 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
//           }`}
//         disabled={disabled}
//       />

//       <input
//         type={type}
//         placeholder={descPlaceholder}
//         name={namedesc}
//         value={valuedesc}
//         onChange={onChangeDesc}
//         className="border rounded-xl px-4 py-2 w-full md:col-span-9  border-gray-300"


//       />

//       {/* DROPDOWN */}
//       {suggestions.length > 0 && (
//         <div className="absolute left-0 right-0 top-full bg-white border rounded-xl mt-1 max-h-60 overflow-y-auto shadow">


//           {suggestions.map((item) => (
//             <div
//               key={item.code}
//               onClick={() => onSelect?.(item)}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//             >
//               <div className="font-medium">{item.code}</div>
//               <div className="text-xs text-gray-500">
//                 {item.nameTH}
//               </div>
//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   )
// };

// export const Select = ({ label }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-medium mb-1">{label}</label>
//     <select className="border rounded-xl px-4 py-2 w-full outline-none  border-gray-300">
//       <option>Select option</option>
//     </select>
//   </div>
// );
export const Select = ({
  label,
  value,
  onChange,
  children,
}: {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
    )}

    <select
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-2
        border border-gray-300 rounded-xl
        outline-none
        focus:ring-2 focus:ring-blue-500
      "
    >
      {children}
    </select>
  </div>
);
export const Checkbox = ({ label, value, checked, onChange }: { label: string; value: string; checked?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label className="flex items-center gap-2">
    <input type="checkbox" value={value} checked={checked} onChange={onChange} /> {label}
  </label>
);

export const Radio = ({ label, name, value, checked, onChange }: {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex items-center gap-2">
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} /> {label}
  </label>
);

export const TextArea = ({ label, placeholder, value, onChange }
  : {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    className?: string; //   optional

  }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea placeholder={placeholder} value={value} onChange={onChange} className="border rounded-xl px-4 py-2 w-full outline-none  border-gray-300" rows={4} />
  </div>
);

export const FileInput = () => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">Upload file</label>
    <input type="file" className="border rounded-xl px-4 py-2 w-full  border-gray-300" />
  </div>
);

export const Toggle = () => (
  <div className="flex items-center gap-2">
    <input type="checkbox" className="w-5 h-5" />
    <span>Toggle</span>
  </div>
);

export const ToggleSwitch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition
          ${value ? "bg-teal-600" : "bg-gray-300"}
        `}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition
            ${value ? "translate-x-5" : ""}
          `}
      />
    </button>
  );
};
export const TooltipButton = ({
  icon: Icon,
  label,
  onClick,
  className = "",
  disabled = false,
}: {
  icon: any;
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="relative group inline-flex">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-1 rounded hover:bg-gray-100 disabled:opacity-50 ${className}`}
      >
        <Icon size={18} />
      </button>

      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2
                   bg-black text-white text-xs px-2 py-1 rounded
                   opacity-0 group-hover:opacity-100
                   whitespace-nowrap pointer-events-none"
      >
        {label}
      </span>
    </div>
  );
};
