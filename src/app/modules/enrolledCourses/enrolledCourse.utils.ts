export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: 'N/A',
    gradePoints: totalMarks,
  }

  if (totalMarks >= 80) {
    result = {
      grade: 'A',
      gradePoints: 4.0,
    }
  } else if (totalMarks >= 60) {
    result = {
      grade: 'B',
      gradePoints: 3.5,
    }
  } else if (totalMarks >= 40) {
    result = {
      grade: 'C',
      gradePoints: 3.0,
    }
  } else if (totalMarks >= 20) {
    result = {
      grade: 'D',
      gradePoints: 2.0,
    }
  } else if (totalMarks >= 0) {
    result = {
      grade: 'F',
      gradePoints: 0.0,
    }
  } else {
    result = {
      grade: 'N/A',
      gradePoints: totalMarks,
    }
  }

  return result
}
