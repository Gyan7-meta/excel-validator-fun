
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
}

export interface ValidationError {
  rule: ValidationRule;
  rows: number[];
  details: string;
}

export interface ValidationResult {
  fileName: string;
  fileSize: number;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  validationErrors: ValidationError[];
  passedRules: ValidationRule[];
  totalRows: number;
  validRows: number;
}

export interface UploadStatus {
  status: 'idle' | 'uploading' | 'validating' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export const ValidationRules: ValidationRule[] = [
  {
    id: 'required-fields',
    name: 'Required Fields',
    description: 'Check for missing required fields'
  },
  {
    id: 'data-formats',
    name: 'Data Formats',
    description: 'Validate correct data formats (dates, numbers, etc.)'
  },
  {
    id: 'duplicate-records',
    name: 'Duplicate Records',
    description: 'Identify duplicate records in the dataset'
  },
  {
    id: 'logical-constraints',
    name: 'Logical Constraints',
    description: 'Verify logical constraints (e.g., time-in before time-out)'
  }
];
