/* eslint-env jest */
const expect = require('expect');
const {
  Joi,
  format,
} = require('../lib');


describe('format()', () => {
  // Need a real Joi error to use in a few places for these tests
  const schema = Joi.string().valid('foo');
  const result = schema.validate(null);
  describe.each`
    value
    ${null}
    ${undefined}
    ${Error()}
    `('format($value)', ({ value }) => {
  it('throws an error', () => {
    expect.assertions(1);
    expect(() => format(value)).toThrow();
  });
});
  it('throws an error if the source is not a valid string', () => {
    expect.assertions(1);
    expect(() => format(result, 'foo')).toThrow(Joi.ValidationError);
  });
  it('throws an error if the option arguments is incorrect', () => {
    expect.assertions(1);
    expect(() => format(result, 'body', false)).toThrow(Joi.ValidationError);
  });
  it('returns a formatted error object without options', () => {
    expect.assertions(1);
    expect(format(result, 'body')).toMatchSnapshot();
  });
  it('returns a formatted error object with options', () => {
    expect.assertions(1);
    expect(format(result, 'body', { celebrated: true })).toMatchSnapshot();
  });
});
