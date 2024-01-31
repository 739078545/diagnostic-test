import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

/**
 * You will find globals from this file useful!
 */
import {GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID} from "./globals";
import { IUniversityClass, IStudent, IAssignmentWeights} from "./types/api_types";
import {GradeTable} from "./components/GradeTable";
import {calcAllFinalGrade} from "./utils/calculate_grade";
import { log } from "console";

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [studentList, setStudentList] = useState<string[]>([]);
  const [studentNameList, setStudentNameList] = useState<string[]>([]);
  const [finalGrade, setFinalGrade] = useState<number[]>([]);

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
  const fetchClassList = async() => {
    const res = await fetch('https://spark-se-assessment-api.azurewebsites.net/api/class/listBySemester/fall2022?buid=U83682995',
    {
      method: 'GET',
      headers: GET_DEFAULT_HEADERS() 
    }
    )
    if (!res.ok) {
      throw new Error('Failed to fetch class list');
    }
    const data = await res.json();
    setClassList(data);
    const classIds = data.map((string: { classId: any; }) => string.classId);
    return classIds;
  }

  const fetchStudentList = async () => {
    try {
      if (currClassId) {
       // console.log("current classs ID: ", currClassId);

        const res = await fetch(
          `${BASE_API_URL}/class/listStudents/${currClassId}?buid=${MY_BU_ID}`,
          {
            method: 'GET',
            headers: GET_DEFAULT_HEADERS(),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch student list');
        }

        const data = await res.json();
        setStudentList(data);
      }
    } catch (error) {
      console.error('Error fetching student list:');
    }
  }
  
  const fetchStudentNameList = async () => {
    try {
      const names = await Promise.all(
        studentList.map(async (studentId) => {
        const res = await fetch(
          `${BASE_API_URL}/student/GetById/${studentId}?buid=${MY_BU_ID}`,
          {
            method: 'GET',
            headers: GET_DEFAULT_HEADERS(),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch studentID');
        }

        const data = await res.json();
            return data[0]?.name 
          })
        );
        setStudentNameList(names);
      } catch (error) {
        console.error('Error fetching student list:');
    }
  }

  const fetchData = async () => {
    try {
      const finalGrade = await calcAllFinalGrade(currClassId, studentList);
      setFinalGrade(finalGrade);
    //  console.log("calcAllFinalGrade returns", finalGrade);
    } catch (error) {
      console.error("Error fetching final grade:", error);
    }
  };

  useEffect(() => {
    fetchClassList();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            <Select fullWidth={true} label="Class">
              {/* You'll need to place some code here to generate the list of items in the selection */}
            </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <div>Place the grade table here</div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
