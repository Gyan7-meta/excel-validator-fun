
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationError, ValidationResult, ValidationRule } from '@/types';
import { formatFileSize } from '@/utils/validators';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Check, FileCog, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationResultsProps {
  result: ValidationResult;
  onReset: () => void;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ result, onReset }) => {
  if (!result) return null;

  const { fileName, fileSize, status, validationErrors, passedRules, totalRows, validRows } = result;
  
  // Calculate the percentage of valid rows
  const validPercentage = Math.round((validRows / totalRows) * 100);
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Summary Card */}
      <Card className="overflow-hidden">
        <CardHeader className={cn(
          "pb-4",
          status === 'success' ? "bg-success/10" : "bg-warning/10"
        )}>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCog className="h-5 w-5" />
                Validation Results
              </CardTitle>
              <CardDescription>
                {fileName} ({formatFileSize(fileSize)})
              </CardDescription>
            </div>
            <Badge variant={status === 'success' ? "outline" : "secondary"} className={cn(
              "text-sm",
              status === 'success' ? "border-success text-success" : "text-foreground"
            )}>
              {status === 'success' ? 'All Validations Passed' : 'Issues Found'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Rows</p>
              <p className="text-2xl font-semibold">{totalRows.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valid Rows</p>
              <p className="text-2xl font-semibold text-success">{validRows.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Invalid Rows</p>
              <p className="text-2xl font-semibold text-destructive">{(totalRows - validRows).toLocaleString()}</p>
            </div>
          </div>

          {/* Progress bar for valid percentage */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span>Valid Data</span>
              <span>{validPercentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full",
                  validPercentage > 90 ? "bg-success" : 
                  validPercentage > 70 ? "bg-info" : 
                  validPercentage > 40 ? "bg-warning" : "bg-destructive"
                )}
                style={{ width: `${validPercentage}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-all-200"
          >
            Validate Another File
          </button>
        </CardContent>
      </Card>

      {/* Validation Rules Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Rules</CardTitle>
          <CardDescription>Check results for each validation rule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passedRules.map((rule) => (
            <RuleResult key={rule.id} rule={rule} passed={true} />
          ))}
          
          {validationErrors.map((error) => (
            <RuleResult key={error.rule.id} rule={error.rule} passed={false} error={error} />
          ))}
        </CardContent>
      </Card>

      {/* Detailed Errors */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Validation Errors</CardTitle>
            <CardDescription>
              {validationErrors.length} {validationErrors.length === 1 ? 'issue' : 'issues'} found in your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {validationErrors.map((error) => (
              <div key={error.rule.id} className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  {error.rule.name}
                </h3>
                <p className="text-sm text-muted-foreground">{error.details}</p>
                
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">Affected Rows:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {error.rows.map((rowNum) => (
                      <Badge key={rowNum} variant="outline" className="text-xs">
                        Row {rowNum}
                      </Badge>
                    ))}
                    {error.rows.length > 10 && (
                      <Badge variant="outline" className="text-xs bg-muted">
                        +{error.rows.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface RuleResultProps {
  rule: ValidationRule;
  passed: boolean;
  error?: ValidationError;
}

const RuleResult: React.FC<RuleResultProps> = ({ rule, passed, error }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          passed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </div>
        <div>
          <p className="font-medium">{rule.name}</p>
          <p className="text-sm text-muted-foreground">{rule.description}</p>
        </div>
      </div>
      {!passed && error && (
        <Badge variant="outline" className="text-destructive border-destructive/30">
          {error.rows.length} {error.rows.length === 1 ? 'error' : 'errors'}
        </Badge>
      )}
    </div>
  );
};

export default ValidationResults;
