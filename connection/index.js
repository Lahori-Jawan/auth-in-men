import mongoose from 'mongoose';

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/auth'

const options = { useNewUrlParser: true, autoIndex: false, bufferCommands: false, useFindAndModify: false }

mongoose.connect(url, options, (error) => {
  if(error) return console.log('Error connecting mongoDB', error.message)
  console.log('connected to mongoDB');
})

mongoose.connection.on('error', (error) => console.log('MongoDB disconnected',error.message));

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {   
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected because node process ended'); 
    process.exit(0); 
  }); 
});

export default mongoose
