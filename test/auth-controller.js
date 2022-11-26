const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const User = require('../models/user');
const AuthController = require('../controllers/auth');
const { mongoTestDbUrl } = require('../utils/constant');

describe('Auth controller - Login', function() {
    before(function(done) {
        mongoose
            .connect(mongoTestDbUrl)
            .then(result => {
                const user = new User({
                    email: 'test@gmail.com',
                    password: 'tester',
                    name: 'Test',
                    posts: [],
                    _id: "6370eed835d461e119e31f5d"
                });
                return user.save();
            })
            .then(() => {
              done();  
            })
            .catch(err => console.log(err));
    })
    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: "test@gmail.com",
                password: '123qwe'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done(); // wait until this code block excute, mocha provide this `done` function to test assync test
        });

        User.findOne.restore()
    });

    it('should send a response with valid user status for an existing user', function(done) {
        const req = {userId: "6370eed835d461e119e31f5d"};
        const res = {
            statusCode: 500,
            userStaus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStaus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, () => {})
        .then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStaus).to.be.equal('I am new!');
            done();
        });
    });

    after(function(done) {
        User.deleteMany({})
        .then(() => {
            return mongoose.disconnect();
        })
        .then(() => {
            done();
        });
    });
})
