
// Add type property to toast calls
toast({
  title: "Plan deleted",
  description: `${plan.name} plan has been deleted.`,
  type: "success"
});

toast({
  title: "Plan updated",
  description: `${data.name} plan has been updated.`,
  type: "success"
});

toast({
  title: "Plan created",
  description: `${data.name} plan has been created.`,
  type: "success"
});

toast({
  title: "Error",
  description: "There was a problem saving the plan.",
  type: "error",
  variant: "destructive"
});

toast({
  title: "Plans exported",
  description: "Subscription plans have been exported to JSON.",
  type: "success"
});
