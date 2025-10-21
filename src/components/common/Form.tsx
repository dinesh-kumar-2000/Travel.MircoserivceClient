import React, { FormEvent, ReactNode } from 'react';

export interface FormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
  id?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = '',
  id,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {children}
    </form>
  );
};

// Form Group - wrapper for form fields
export interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
}) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

// Form Actions - wrapper for form buttons
export interface FormActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  align = 'right',
  className = '',
}) => {
  const alignmentStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center space-x-3 pt-4 ${alignmentStyles[align]} ${className}`}
    >
      {children}
    </div>
  );
};

// Form Helper Text
export interface FormHelperTextProps {
  children: ReactNode;
  error?: boolean;
  className?: string;
}

export const FormHelperText: React.FC<FormHelperTextProps> = ({
  children,
  error = false,
  className = '',
}) => {
  return (
    <p
      className={`
        mt-1 text-sm
        ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
        ${className}
      `}
    >
      {children}
    </p>
  );
};

// Complete Form Field with Label, Input, and Error
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  multiline = false,
  rows = 3,
  className = '',
}) => {
  const inputClasses = `
    w-full px-4 py-2 rounded-lg border transition-colors
    ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
    }
    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <FormGroup className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
        />
      )}

      {error && (
        <FormHelperText error id={`${name}-error`}>
          {error}
        </FormHelperText>
      )}

      {helperText && !error && (
        <FormHelperText id={`${name}-helper`}>{helperText}</FormHelperText>
      )}
    </FormGroup>
  );
};

// Form Section - for grouping related fields
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div
      className={`border-t border-gray-200 pt-6 dark:border-gray-700 ${className}`}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
};
