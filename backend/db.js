import mongoose from 'mongoose'

const mongoUrl = 'mongodb://localhost:27017/inoteBook'
export const connectToMongo = () => {

    mongoose.connect(mongoUrl, () => {

        console.log('Connected to Mongo Succesfully')
    })
}

