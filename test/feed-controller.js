const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const User = require('../models/user');
const FeedController = require('../controllers/feed');
const { mongoTestDbUrl } = require('../utils/constant');

describe('Feed controller - Login', function() {
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
    it('should add created post to the creator', function(done) {

        const req = {
            body: {
                title: "Test post",
                conent: "Test post content",
            },
            file: {
                path: "server-file-path",
            },
            userId: "6370eed835d461e119e31f5d"
        };
        const res = {
            status: function() {
                return this;
            },
            json: function() {}
        };
        FeedController.createPost(req, res, () => {}).then((savedUser) => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        })
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
