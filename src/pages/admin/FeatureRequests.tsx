
// Fix the specific part with the status comparison issue
const approvedRequests = filteredRequests.filter(request => 
  ["approved", "in-progress"].includes(request.status as string)
);
