import { generateGoogleFolderName } from './docBuilder';

describe('docBuilder', () => {
  describe('generateGoogleFolderName', () => {
    it('Generates string with full month name and year for every month', () => {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      for (let i = 0; i < 12; i++) {
        const testDate = new Date(new Date().setFullYear(2023, i, 1));
        const res = generateGoogleFolderName(testDate);
        expect(res).toBe(`${monthNames[i]} 2023`);
      }
    });
  });
});
