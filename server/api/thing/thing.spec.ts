/// <reference path="../../typings/tsd.d.ts" />

import should = require('should');
import app = require('../../app');
import request = require('supertest');

describe('GET /api/things', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/things')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        should.not.exist(err)
        expect(err).toBeNull();
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
