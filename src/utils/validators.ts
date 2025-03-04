
import { ValidationError, ValidationResult, ValidationRule, ValidationRules } from '@/types';

/**
 * Simulates the validation process for demo purposes
 * In a real application, this would connect to your Supabase Edge Function
 */
export const validateExcelFile = async (file: File): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Generate random validation results for demonstration
      const totalRows = Math.floor(Math.random() * 1000) + 100;
      const errorsCount = Math.floor(Math.random() * 20);
      
      const validationErrors: ValidationError[] = [];
      const passedRules: ValidationRule[] = [];
      
      // Randomly assign passed and failed rules
      ValidationRules.forEach(rule => {
        if (Math.random() > 0.3) {
          passedRules.push(rule);
        } else {
          // Create random errors for this rule
          const rowCount = Math.floor(Math.random() * 10) + 1;
          const affectedRows = Array.from({ length: rowCount }, 
            () => Math.floor(Math.random() * totalRows) + 1);
          
          validationErrors.push({
            rule,
            rows: affectedRows,
            details: getErrorDetailsByRule(rule.id)
          });
        }
      });
      
      const validRows = totalRows - validationErrors.reduce(
        (acc, err) => acc + err.rows.length, 0
      );
      
      const result: ValidationResult = {
        fileName: file.name,
        fileSize: file.size,
        timestamp: new Date(),
        status: validationErrors.length === 0 ? 'success' : 'error',
        validationErrors,
        passedRules,
        totalRows,
        validRows
      };
      
      resolve(result);
    }, 2000); // 2 second delay to simulate processing
  });
};

/**
 * Get detailed error message based on rule type
 */
function getErrorDetailsByRule(ruleId: string): string {
  switch (ruleId) {
    case 'required-fields':
      return 'Some rows are missing required fields such as "Employee ID", "Department", or "Date".';
    case 'data-formats':
      return 'Incorrect date formats detected. Expected format is "YYYY-MM-DD".';
    case 'duplicate-records':
      return 'Multiple records with identical Employee ID and Date combinations found.';
    case 'logical-constraints':
      return 'Time-out values occur before Time-in values for some records.';
    default:
      return 'Validation errors detected in the file.';
  }
}

/**
 * Format file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Checks if the file is a valid Excel file
 */
export const isExcelFile = (file: File): boolean => {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet'
  ];
  return validTypes.includes(file.type);
};
