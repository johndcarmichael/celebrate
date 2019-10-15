/* eslint-env jest */
const expect = require('expect');
const { random } = require('faker');
const {
  celebrate,
  Joi,
  isCelebrate,
} = require('../lib');

describe('isCelebrate()', () => {
  describe.each`
        value | expected
        ${Error()} | ${false}
        ${'errr'} | ${false}
        ${0} | ${false}
        ${[0, 1]} | ${false}
        ${null} | ${false}
        ${undefined} | ${false}
      `('isCelebrate($value)', ({ value, expected }) => {
  it(`returns ${expected}`, () => {
    expect.assertions(1);
    expect(isCelebrate(value)).toBe(expected);
  });
});

  it('returns true if the error object came from celebrate', () => {
    expect.assertions(1);
    const middleware = celebrate({
      headers: {
        accept: Joi.string().regex(/xml/),
      },
    });

    middleware({
      headers: {
        accept: random.number(),
      },
    }, null, (err) => {
      expect(isCelebrate(err)).toBe(true);
    });
  });
});
