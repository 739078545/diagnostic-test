import React, { useEffect, useState } from "react";
import { Grid, Select, Typography, MenuItem } from "@mui/material";
import { GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID } from "./globals";
import { IUniversityClass } from "./types/api_types";
import { GradeTable } from "./components/GradeTable";
import { calculateAllStudentGrades } from "./utils/calculate_grade";

function App() {
  // You will need to use more of these!
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [classes, setClasses] = useState<IUniversityClass[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [studentNames, setStudentNames] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);

  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */
  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await fetch(`${BASE_API_URL}/class/listBySemester/fall2022?buid=${MY_BU_ID}`, {
          method: 'GET',
          headers: GET_DEFAULT_HEADERS()
        });
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    }
    fetchClasses();
  }, []);

  useEffect(() => {
    async function fetchStudents() {
      try {
        if (!selectedClassId) return;
        const response = await fetch(`${BASE_API_URL}/class/listStudents/${selectedClassId}?buid=${MY_BU_ID}`, {
          method: 'GET',
          headers: GET_DEFAULT_HEADERS()
        });
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }
    fetchStudents();
  }, [selectedClassId]);

  useEffect(() => {
    async function fetchStudentNames() {
      try {
        const names = await Promise.all(students.map(async (studentId) => {
          const response = await fetch(`${BASE_API_URL}/student/GetById/${studentId}?buid=${MY_BU_ID}`, {
            method: 'GET',
            headers: GET_DEFAULT_HEADERS()
          });
          if (!response.ok) throw new Error(`Failed to fetch student name for ID: ${studentId}`);
          const data = await response.json();
          return data[0]?.name;
        }));
        setStudentNames(names);
      } catch (error) {
        console.error('Error fetching student names:', error);
      }
    }
    if (students.length > 0) fetchStudentNames();
  }, [students]);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const grades = await calculateAllStudentGrades(selectedClassId, students);
        setGrades(grades);
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    }
    if (students.length > 0) fetchGrades();
  }, [selectedClassId,students]);


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>Spark Assessment</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom>Select a class</Typography>
          <Select fullWidth label="Class" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value as string)}>
            {classes.map((classItem) => (
              <MenuItem key={classItem.classId} value={classItem.classId}>
                {classItem.title}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>Final Grades</Typography>
          <GradeTable studentList={students} studentNameList={studentNames} selectedClassId={selectedClassId} classList={classes} studentGrade={grades} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
