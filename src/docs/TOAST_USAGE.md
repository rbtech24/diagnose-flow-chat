
# Toast Usage Guidelines

This application uses `react-hot-toast` for toast notifications. Here's how to use toast throughout the application:

## Direct Import (Recommended)

For most cases, directly import toast from react-hot-toast:

```typescript
import toast from 'react-hot-toast';

// Basic usage
toast("Message here");

// Variants
toast.success("Success message");
toast.error("Error message");
```

## Using the useToast Hook (for Components that need Context)

Some components may need the toast context. In those cases, use the hook:

```typescript
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  // Use it directly
  const handleClick = () => {
    toast("Message here");
  };
  
  // Or with shadcn/ui style object pattern (which will be adapted)
  const handleAction = () => {
    toast({
      title: "Title here",
      description: "Description here",
      variant: "default" // or "destructive"
    });
  };
}
```

## Using the Toast Helpers (for Consistent Formatting)

For consistent toast messaging across the application:

```typescript
import { showToast } from '@/utils/toast-helpers';

// Basic message
showToast.message("Simple message");

// Success message
showToast.success("Operation completed successfully");

// Error message
showToast.error("Something went wrong");

// Title and description format (shadcn/ui style)
showToast.titleDescription("Account Created", "Your account has been successfully created");

// With variant
showToast.titleDescriptionVariant("Warning", "This action cannot be undone", "destructive");
```

## Important Notes

1. The application uses a toast adapter system to support both direct react-hot-toast API and shadcn/ui style objects
2. Prefer using the direct toast import when possible for simplicity
3. Only use the useToast hook when you need context access
4. For components using shadcn/ui patterns, the adapter will handle the translation
