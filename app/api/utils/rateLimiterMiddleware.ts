// @ts-ignore
import { get, set } from "lodash";
const rateLimiter = {};

const rateLimiterMiddleware = (ip: any, rateLimit: number) => {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute ago

  const requestTimestamps = get(rateLimiter, ip, []).filter(
    (timestamp: any) => timestamp > windowStart
  );
  requestTimestamps.push(now);

  set(rateLimiter, ip, requestTimestamps);

  return requestTimestamps.length <= rateLimit;
};

export default rateLimiterMiddleware;
