/**
 * You might find it useful to have some dummy data for your own testing.
 * Feel free to write this function if you find that feature desirable.
 * 
 * When you come to office hours for help, we will ask you if you have written
 * this function and tested your project using it.
 */
import React from 'react';


import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {IGradeTable} from "../types/api_types";

export function dummyData() {
  return [];
}

/**
 * This is the component where you should write the code for displaying the
 * the table of grades.
 *
 * You might need to change the signature of this function.
 *
 */
export const GradeTable : React.FC<IGradeTable> = ({studentList, studentNameList, selectedClassId, classList, studentGrade}) => {
  return (
    <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student ID</TableCell>
          <TableCell>Student Name</TableCell>
          <TableCell>Class ID</TableCell>
          <TableCell>Class Name</TableCell>
          <TableCell>Semester</TableCell>
          <TableCell>Final Grade</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {studentList.map((studentId, index) => (
          <TableRow key={studentId}>
          <TableCell>{studentId}</TableCell>
          <TableCell>{studentNameList[index]}</TableCell>
          <TableCell>{selectedClassId}</TableCell>
          <TableCell>{classList.find((item) => item.classId === selectedClassId)?.title}</TableCell>
          <TableCell>Fall 2022</TableCell>
          <TableCell>{studentGrade[index]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
};
