/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */


import {GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID} from "../globals";

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */

async function fetchClassAndStudentData(classID: string, studentID: string) {
  const assignmentUrl = `${BASE_API_URL}/class/listAssignments/${classID}?buid=${MY_BU_ID}`;
  const gradesUrl = `${BASE_API_URL}/student/listGrades/${studentID}/${classID}/?buid=${MY_BU_ID}`;

  const [assignmentResponse, gradesResponse] = await Promise.all([
    fetch(assignmentUrl, { method: 'GET', headers: GET_DEFAULT_HEADERS() }),
    fetch(gradesUrl, { method: 'GET', headers: GET_DEFAULT_HEADERS() })
  ]);

  if (!assignmentResponse.ok || !gradesResponse.ok) {
    throw new Error('Error fetching data');
  }

  const assignments = await assignmentResponse.json();
  const grades = await gradesResponse.json();

  return { assignments, grades: grades.grades[0] };
}


export async function computeStudentGrade(studentId: string, classId: string): Promise<number> {
  try {
    const { assignments, grades } = await fetchClassAndStudentData(classId, studentId);
    let totalWeight = 0, totalScore = 0;

    for (let assignment of assignments) {
      const grade = Number(grades[assignment.assignmentId]) || 0;
      const weight = assignment.weight;
      totalScore += grade * weight;
      totalWeight += weight;
    }

    if (totalWeight === 0) throw new Error('Total weight is zero, invalid data');
    return totalScore / totalWeight;
  } catch (error) {
    console.error('Error computing student grade:', error);
    return 0;
  }
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calculateAllStudentGrades(classID: string, studentList: string[]): Promise<number[]> {
  try {
    const gradesPromises = studentList.map(studentID => computeStudentGrade(studentID, classID));
    return await Promise.all(gradesPromises);
  } catch (error) {
    console.error("Error calculating class grades:", error);
    return studentList.map(() => 0);
  }
}
