
interface HandleConnection {
  isConnected: boolean;
  isNoOutcome: boolean;
}

export const getHandleStyle = (connection: HandleConnection) => ({
  width: '12px',
  height: '12px',
  border: '2px solid',
  borderColor: connection.isConnected 
    ? (connection.isNoOutcome ? '#ea384c' : '#22c55e') 
    : '#ef4444',
  backgroundColor: connection.isConnected 
    ? (connection.isNoOutcome ? '#fecdd3' : '#bbf7d0')
    : '#fecaca',
  cursor: connection.isConnected ? 'pointer' : 'default',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
});
