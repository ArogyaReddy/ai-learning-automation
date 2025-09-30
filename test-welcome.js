const LessonGenerator = require('./ai-tools/lesson-generator');

const generator = new LessonGenerator();
const lesson = generator.getWelcomeLesson();

console.log(lesson);