
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ValidationResults from '@/components/ValidationResults';
import { ValidationResult } from '@/types';
import { motion } from 'framer-motion';

// Add framer-motion for enhanced animations
<lov-add-dependency>framer-motion@^10.16.4</lov-add-dependency>

const Index = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleValidationComplete = (result: ValidationResult) => {
    setValidationResult(result);
  };

  const handleReset = () => {
    setValidationResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/30">
      <header className="w-full py-8 md:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center justify-center px-3 py-1 mb-2 rounded-full bg-primary/10 text-primary text-xs font-medium">
            Excel Validator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Validate your Excel data with ease
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto px-4">
            Upload your spreadsheet to check for missing fields, incorrect formats, duplicates, and logical constraints.
          </p>
        </motion.div>
      </header>

      <main className="flex-1 w-full max-w-5xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {!validationResult ? (
            <FileUpload onValidationComplete={handleValidationComplete} />
          ) : (
            <ValidationResults result={validationResult} onReset={handleReset} />
          )}
        </motion.div>
      </main>

      <footer className="w-full py-6 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Excel Validator • Designed with precision and simplicity</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
