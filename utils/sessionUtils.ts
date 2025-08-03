
// Session utility functions

export interface Session {
  id: string;
  podId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

/**
 * Check if a session is about to start (within the next 5 minutes)
 * @param session The session to check
 * @returns boolean indicating if session is starting soon
 */
export const isSessionStartingSoon = (session: Session): boolean => {
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  
  return session.startTime > now && session.startTime <= fiveMinutesFromNow;
};

/**
 * Generate a QR code value for a session
 * @param session The session for which to generate a QR code
 * @returns A string value to be encoded in the QR code
 */
export const generateQRValue = (session: Session): string => {
  // In a real implementation, this would create a signed JWT or similar
  // that the pod could verify when scanned
  const timestamp = new Date().getTime();
  return `GYM:${session.podId}:${session.id}:${timestamp}`;
};

/**
 * Get time remaining until a session starts in seconds
 * @param session The session to check
 * @returns Number of seconds until session starts, or 0 if already started
 */
export const getSecondsUntilSession = (session: Session): number => {
  const now = new Date();
  
  if (session.startTime <= now) {
    return 0;
  }
  
  const diffMs = session.startTime.getTime() - now.getTime();
  return Math.floor(diffMs / 1000);
};

