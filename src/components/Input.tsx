interface InputProps {
  label?: string;
  type?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const Input = ({
  label = "",
  type = "text",
  name = "",
  id = "",
  placeholder = "",
  required = false,
  textarea = false,
  value = "",
  onChange = () => {},
}: InputProps) => {
  return (
    <div>
      <label
        className={`block mb-2 text-sm font-medium text-gray-600 dark:text-white ${
          required ? "required" : ""
        }`}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={4}
          name={name}
          id={id}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder={placeholder}
          required={required}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder={placeholder}
          required={required}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Input;
