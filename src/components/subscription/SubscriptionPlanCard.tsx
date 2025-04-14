
// Change the trial period calculation to handle both properties
const trialPeriodText = (plan) => {
  const period = (plan.trialPeriod !== undefined ? plan.trialPeriod : 
    plan.trial_period !== undefined ? plan.trial_period : 
    14);
  return `${period}-day trial period`;
};
