import { expect } from 'chai';
import { slashesToSemicolons, semicolonsToSlashes } from '../../src/utils';

describe('utils', () => {

    describe('slashesToSemicolons', () => {
        it('should return input if not contains a slash', () => {
            expect(slashesToSemicolons('input;output')).eq('input;output');
        });
        it('should return input if not contains a slash', () => {
            expect(slashesToSemicolons('input/middle/output')).eq('input;middle;output');
        });
    });

    describe('semicolonsToSlashes', () => {
        it('should return input if not contains a semicolon', () => {
            expect(semicolonsToSlashes('input/output')).eq('input/output');
        });
        it('should return input if not contains a slash', () => {
            expect(semicolonsToSlashes('input;middle;output')).eq('input/middle/output');
        });
    });
});