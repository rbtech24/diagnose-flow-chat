
// Add type property to toast calls
toast({
  title: "User not found",
  description: "The requested user could not be found.",
  type: "error",
  variant: "destructive",
});

toast({
  title: "Error",
  description: "Failed to load user data.",
  type: "error",
  variant: "destructive",
});

toast({
  title: "Error",
  description: error.message,
  type: "error",
  variant: "destructive",
});

toast({
  title: "Password reset email sent",
  description: `A password reset email has been sent to ${userData.email}.`,
  type: "success"
});

toast({
  title: "Error",
  description: "An unexpected error occurred. Please try again.",
  type: "error",
  variant: "destructive",
});

toast({
  title: "User deleted",
  description: "The user has been successfully deleted.",
  type: "success"
});

toast({
  title: "Error",
  description: "Failed to delete user.",
  type: "error",
  variant: "destructive",
});

toast({
  title: "Error",
  description: "An unexpected error occurred. Please try again.",
  type: "error",
  variant: "destructive",
});
