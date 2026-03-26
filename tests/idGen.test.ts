import {useIdGen} from '../src/Composables/idGen.js';

describe('useIdGen', () => {
    it('generates same name for same argument', () => {
        const gen = useIdGen({instanceUid: 'test'});
        const id = gen('myField');
        expect(id).toBe(gen('myField'));
    });

    it('generates different ids for different names', () => {
        const gen = useIdGen({instanceUid: 'test'});
        expect(gen('a')).not.toBe(gen('b'));
    });

    it('generates different ids for different instanceUid', () => {
        expect(useIdGen({instanceUid: 'test1'})('a'))
            .not.toBe(useIdGen({instanceUid: 'test2'})('a'));
    });
});
