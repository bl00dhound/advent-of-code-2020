const solution = require('../15/pz15_1');

describe('Day 15', () => {

  describe('Part 1', () => {

    it('should return 1 if starting numbers are "1,3,2"', async () => {
      expect(await solution('1,3,2')).toBe(1);
    });
    it('should return 10 if starting numbers are "2,1,3"', async () => {
      expect(await solution('2,1,3')).toBe(10);
    });
    it('should return 27 if starting numbers are "1,2,3"', async () => {
      expect(await solution('1,2,3')).toBe(27);
    });
    it('should return 78 if starting numbers are "2,3,1"', async () => {
      expect(await solution('2,3,1')).toBe(78);
    });
    it('should return 438 if starting numbers are "3,2,1"', async () => {
      expect(await solution('3,2,1')).toBe(438);
    });
    it('should return 1836 if starting numbers are "3,1,2"', async () => {
      expect(await solution('3,1,2')).toBe(1836);
    });
  });
});
