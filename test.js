const mongoose = require('mongoose');
const User = require('./server/models/user');


mongoose.connect('mongodb://admin:admin1@ds135916.mlab.com:35916/online-consultations', {
    useMongoClient: true
});

const run = async () => {


    const users = await User.find();
    console.log(users[0]._id.equals(users[1]._id));

}
run();
