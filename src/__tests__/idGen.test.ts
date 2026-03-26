import { useIdGen } from '../Composables/idGen.js';

describe('useIdGen', () => {
  it('generates unique ids', () => {
    const gen = useIdGen();
    const id1 = gen.next();
    const id2 = gen.next();
    expect(id1).not.toBe(id2);
  });
});
