/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import React, { useEffect, useState } from "react";


import { IUniversityClass, IAssignmentWeights} from "../types/api_types";
import {GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID} from "../globals";
import fetchStudentList from "../App";

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */

export async function calculateStudentFinalGrade(
  studentId: string,
  classId: string,
): Promise<number> {
  try {
    const assignmentWeights = await fetchAssignmentWeights(classId);
    const studentGrades = await fetchStudentGrades(studentId, classId);
    const studentGradesArray = Object.entries(studentGrades).map(([assignmentId, grade]) => ({
      assignmentId,
      grade: Number(grade),
    }));
    const weightedGrades = studentGradesArray.map(({ assignmentId, grade }) => {
      const assignment = assignmentWeights.find((a: IAssignmentWeights) => a.assignmentId === assignmentId);
      if (assignment) {
        const weightedGrade = assignment.weight * grade;
        return weightedGrade;
      }
      return 0; 
    });
    const validWeightedGrades = weightedGrades.filter((wg) => wg !== 0);
    const overallGrade = validWeightedGrades.reduce((acc, curr) => acc + curr, 0);
    return overallGrade;
  } catch (error) {
    console.error('Error calculating final grade:', error);
    return 0; 
  }
}

export async function fetchAssignmentWeights(classId: string) {
  const res = await fetch(`${BASE_API_URL}/class/listAssignments/${classId}?buid=${MY_BU_ID}`, {
    method: 'GET',
    headers: GET_DEFAULT_HEADERS(),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch assignment weights');
  }
  const data = await res.json();
  const weights = data.map((assignment : IAssignmentWeights) =>  ({
    assignmentId: assignment.assignmentId,
    weight: assignment.weight,
  }));
  return data
}

// returns the student grades and its corresponding assignment
export async function fetchStudentGrades(studentID: string, classID: string) {
  const res = await fetch(`${BASE_API_URL}/student/listGrades/${studentID}/${classID}/?buid=${MY_BU_ID}`, {
      method: 'GET',
      headers: GET_DEFAULT_HEADERS(),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch student grades');
    }
    const data = await res.json();
    const grades = data.grades[0];
    return grades 
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrade(classID: string, studentList: string[]): Promise<number[]> {
  try {
    const finalGradesPromises = studentList.map(async (studentID) => {
      return await calculateStudentFinalGrade(studentID, classID);
    });
    const finalGrades = await Promise.all(finalGradesPromises);   
    return finalGrades;
  } catch (error) {
    console.error("Error calculating final grades:", error);
    return [0]; 
  }
}
