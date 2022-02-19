const mongoose = require('mongoose');

// Connect to MongoDb
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));


// Schema Creation    
const courseSchema = new mongoose.Schema({

    name: {  // Built in validators
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/ 
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        // uppercase: true,
        trim: true
    },
    author: String,
    // tags: { // Custom Validator
    //     type: Array,
    //     validate: {
    //         validator: function(v) {
    //             return v && v.length > 0;
    //         },
    //         message: 'A course should have at least one tag '
    //     }
    // },
    tags: { // Async  Validator
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                setTimeout(() => {
                    // Do some async work
                    const result = v && v.length > 0;
                    callback(result)
                }, 3000);
            },
            message: 'A course should have at least one tag '
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: { // Built in validators
        type: Number,
        required: function() { return this.isPublished; },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v=> Math.round(v)
    }
});

// Model creation
const Course = mongoose.model('Course', courseSchema);

// Adding data to mongodb
async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'WEB',
        author: 'Raj',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8,
    });

    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        // Validation Errors
        for(field in ex.errors)
            console.log('Error', ex.errors[field].message);
    }
}

// createCourse();

async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10;

    const courses = await Course
        .find({ _id: '6210b55efb04e5279c91bde6' })
        .sort({ name: 1 })
        .select('name price');

    console.log(courses[0].price);
}

getCourses();