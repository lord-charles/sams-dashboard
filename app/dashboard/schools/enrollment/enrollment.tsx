"use client"
 
import EnrollmentStats from "./enrollment-stats"
import { type School } from "./school-table-enrollment/schools"

export default function Enrollment({ schools,allSchools }: { schools: School[], allSchools: School[] }) {


  return (
    <div className="bg-gradient-to-b from-primary/20 to-background">
      
          <EnrollmentStats allSchools={allSchools} schoolsData={schools} />
   
    </div>
  )
}

