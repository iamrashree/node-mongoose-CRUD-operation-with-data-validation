const mongoose = require('mongoose');

// Connect to MongoDb
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));


// Schema Creation    
const courseSchema = new mongoose.Schema({
    name: { type: String },
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

// Model creation
const Course = mongoose.model('Course', courseSchema);

// Adding data to mongodb
async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Raj',
        tags: ['angular', 'frontend'],
        isPublished: true
    });

    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        console.log('Error', ex.message);
    }
}

// createCourse();

/* Comparison Operators 
    eq (equal), ne (not equal), gt (greater than)
    gte (greater than or equal to), lt (less than)
    lte (less than or equal to), in, nin (not in) 
*/

/* Logical oOperators
    or, and
*/

/* Regular expressions
    Starts with, Ends with, Contains
*/

async function getCourses() {

    const pageNumber = 2;
    const pageSize = 10;

    const courses = await Course
        .find({ author: 'Raj', isPublished: true })
        // .find({ price: { $gte: 10, $lte: 20 } })
        // .find({ price: { $in: [10, 15, 20] } })
        // .find() // To return all data
        // .or([ { author: 'Raj' }, { isPublished: true } ])
        // .and([ {}, {} ])

        // Starts with raj
        // .find({ author: /^raj/ })

        // Ends with raj
        // .find({ author: /Raj$/i })

        // Contains Raj
        // .find({ author: /.*Raj.*/i })

        .skip((pageNumber - 1) * pageSize) // pagination to skip the data
        .limit(10)
        .sort({ name: 1 }) // 1 for Ascending order and -1 for descending
        // .select({ name: 1, tags: 1 }); // returns only name and tags.
        .count(); // Count the data

    console.log(courses);
}

// getCourses();

async function updateCourseApproach1(id) {
    // Approach: Query first
    // findBYId()
    // Modify its properties
    // save()

    const course = await Course.findById(id);
    if (!course) return;

    course.isPublished = true;
    course.author = 'Another author';

    /* // we can also set properties
        course.set({
            isPublished: true,
            author: 'Another author'
        })
    */

    const result = await course.save();
    console.log(result);
}

// updateCourseApproach1('620fce5bc07b9d4198676956');

async function updateCourseApproach2(id) {

    // Approach: Update first
    // Update directly
    // Optionally: get the updated document

    const result = await Course.updateOne({ _id: id }, {
        $set: {
            author: 'Chand',
            isPublished: false
        }
    }, { new: true });

    console.log(course);
}

//updateCourseApproach2('620fce5bc07b9d4198676956');

async function updateCourseApproach3(id) {

    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Chand',
            isPublished: false
        }
    }, { new: true });

    console.log(course);
}

// updateCourseApproach3('620fce5bc07b9d4198676956');


async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
}

// removeCourse('620fce5bc07b9d4198676956');


async function removeCourseMany(id) {
    // const result =  await Course.deleteMany({ _id: id });
    const course = await Course.findByIdAndRemove(id);
    console.log(course); // returns null
}

// removeCourseMany('620fce5bc07b9d4198676956');