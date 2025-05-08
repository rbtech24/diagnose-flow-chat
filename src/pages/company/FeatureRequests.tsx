
// Fix the specific part with the status comparison issue
const pendingRequests = filteredRequests.filter((request) => 
  ["pending", "submitted"].includes(request.status)
);
