const { financeData } = require('./statements.js');
const { ects, mentors } = require('./participants.js');

module.exports = {

  // Todays date components
  date: new Date(),
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  currentDay: new Date().getDate(),

  // Insert values here
  ects,
  mentors,

  // Create finance statements data 
  financeData
}
