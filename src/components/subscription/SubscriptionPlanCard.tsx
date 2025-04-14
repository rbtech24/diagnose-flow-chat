
// Change the trial period calculation to handle both properties
{(plan.trialPeriod !== undefined ? plan.trialPeriod : 
  plan.trial_period !== undefined ? plan.trial_period : 
  14)}-day trial period
