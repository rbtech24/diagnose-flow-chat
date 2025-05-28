
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

interface SecureFormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function SecureForm<T extends z.ZodType>({ 
  schema, 
  onSubmit, 
  children, 
  className 
}: SecureFormProps<T>) {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className={className}
        noValidate // Disable browser validation to use our custom validation
      >
        {children}
      </form>
    </Form>
  );
}
