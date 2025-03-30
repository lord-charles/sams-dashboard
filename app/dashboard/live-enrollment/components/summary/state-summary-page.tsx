"use client"
import StateSummary from "./state-summary"

interface StateData {
  _id: string
  state10Details: Array<{
    modifiedBy?: string
    totalEnrolled: number
    totalDropped: number
    totalSchools: number
    uniquePayam28: string[]
    uniqueCounty28: string[]
  }>
  stats: {
    [year: string]: number
  }
}

export default function StateSummaryPage({
  data,
}: {
  stateId: string
  data: StateData
}) {
  return (
    <div className="container py-4">
      <StateSummary data={data} />
    </div>
  )
}

