import { useState } from "react";
import { CheckCircle, AlertCircle ,Info} from "lucide-react";

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
};
export const Input = ({ label, type = "text", placeholder,name, value, onChange, onFocus, onBlur,required }: InputProps) => {
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
  )};

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
}: { 
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validator: (val: string) => boolean;
  required?: boolean;
  describedBy?: string;
  errorMessage?: React.ReactNode; 
}) => {
  const [focus, setFocus] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = validator(value);  
  // Determine when to show error/success states  cover by touched and value length to avoid showing validation on initial render
  const showError = touched && !isValid;//&& value.length > 0 
  const showSuccess = touched && isValid;//&& value.length > 0 
  const showIcon = touched ;//&& value.length > 0
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
          `}
          
          aria-describedby={describedBy}  
          aria-invalid={!isValid}   
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
  
}) => ( 
  <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4 relative">
    <input
      type={type}
      placeholder={codePlaceholder}
      name={namecode}
      value={valuecode} 
      onChange={onChangeCode}
      className={`border rounded-xl px-4 py-2 w-full md:col-span-3  border-gray-300 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      disabled={disabled}   
    />

    <input
      type={type}
      placeholder={descPlaceholder}
      name={namedesc}
      value={valuedesc} 
      onChange={onChangeDesc}
      className="border rounded-xl px-4 py-2 w-full md:col-span-9  border-gray-300"
      
     
    />

     {/* DROPDOWN */}
    {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full bg-white border rounded-xl mt-1 max-h-60 overflow-y-auto shadow">


        {suggestions.map((item) => (
          <div
            key={item.code}
            onClick={() => onSelect?.(item)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium">{item.code}</div>
            <div className="text-xs text-gray-500">
              {item.nameTH}
            </div>
          </div>
        ))}

      </div>
    )}
  </div>
);
 
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
  children?: React.ReactNode;}) => (
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

export const TextArea = ({ label, placeholder }: InputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea     placeholder={placeholder} className="border rounded-xl px-4 py-2 w-full outline-none  border-gray-300" rows={4} />
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