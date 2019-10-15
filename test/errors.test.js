/* eslint-env jest */
const expect = require('expect');
const { random } = require('faker');
const {
  celebrate,
  Joi,
  errors,
} = require('../lib');

describe('errors()', () => {
  it('responds with a joi error from celebrate middleware', () => {
    expect.assertions(3);
    const middleware = celebrate({
      query: {
        role: Joi.number().integer().min(4),
      },
    });
    const handler = errors();
    const next = jest.fn();
    const res = {
      status(statusCode) {
        expect(statusCode).toBe(400);
        return {
          send(err) {
            expect(err).toMatchSnapshot();
            expect(next).not.toHaveBeenCalled();
          },
        };
      },
    };

    middleware({
      query: {
        role: random.number({ min: 0, max: 3 }),
      },
      method: 'GET',
    }, null, (err) => {
      handler(err, undefined, res, next);
    });
  });

  it('passes the error through next if not a joi error from celebrate middleware', () => {
    const handler = errors();
    const res = {
      status() {
        throw Error('status called');
      },
    };

    const schema = Joi.object({
      role: Joi.number().integer().min(4),
    });

    const { error } = schema.validate({
      role: random.word(),
    });
    handler(error, undefined, res, (e) => {
      expect(e).toEqual(error);
    });
  });

  it('only includes key values if joi returns details', () => {
    expect.assertions(3);
    const middleware = celebrate({
      body: {
        first: Joi.string().required(),
      },
    });
    const handler = errors();
    const next = jest.fn();
    const res = {
      status(statusCode) {
        expect(statusCode).toBe(400);
        return {
          send(err) {
            expect(err).toMatchSnapshot();
            expect(next).not.toHaveBeenCalled();
          },
        };
      },
    };

    middleware({
      body: {
        role: random.word(),
      },
      method: 'POST',
    }, null, (err) => {
      err.joi.details = null; // eslint-disable-line no-param-reassign
      handler(err, undefined, res, next);
    });
  });
});
