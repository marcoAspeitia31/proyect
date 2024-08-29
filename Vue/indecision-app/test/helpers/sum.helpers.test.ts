import { test} from 'vitest'
import {sum} from '../../src/helpers/sum.helpers';

test('adds 1 + 2 to equal 3', () => {

    if (sum(1,2) != 3){
        throw new Error('la suma no es corecta')
    }
}) 