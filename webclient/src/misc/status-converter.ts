export function convertStatus(code: number): string {
  switch (code) {
    case 0: return 'Upload started';
    case 1: return 'Uploaded';
    case 2: return 'Converted';
  }
}