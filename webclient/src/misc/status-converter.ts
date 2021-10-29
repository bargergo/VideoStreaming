export enum Status {
  UPLOAD_STARTED = 'Upload started',
  UPLOADED = 'Uploaded',
  CONVERTED = 'Converted'
};

export function convertStatus(code: number): string {
  switch (code) {
    case 0: return Status.UPLOAD_STARTED;
    case 1: return Status.UPLOADED;
    case 2: return Status.CONVERTED;
  }
  return '' + code;
};