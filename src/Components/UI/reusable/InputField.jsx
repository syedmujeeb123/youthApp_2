import React from "react";

function InputField({
  label,
  name,
  type = "text",
  value,
  comment,
  onChange,
  placeholder = "",
  options = [],
  className = "",
  required = false,
  showCommentInput = false,
}) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {type === "radio" && options.length > 0 ? (
        <div className="flex items-center gap-4">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-1 text-sm text-gray-700"
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                data-type="value"
                onChange={onChange}
                className="accent-blue-600"
                required={required}
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
      )}

      {showCommentInput && (
        <input
          type="text"
          name={name}
          value={comment}
          placeholder="Add a comment..."
          data-type="comment"
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      )}
    </div>
  );
}

export default InputField;
