export function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = [
    'password',
    'accessToken',
    'refreshToken',
    'apiKey',
    'secret',
    'creditCard',
    'ssn'
  ];
  
  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item));
  }
  
  const result: any = {};
  for (const key in data) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      result[key] = '**REDACTED**';
    } else if (typeof data[key] === 'object') {
      result[key] = redactSensitiveData(data[key]);
    } else {
      result[key] = data[key];
    }
  }
  
  return result;
}
